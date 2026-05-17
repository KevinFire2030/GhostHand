#!/usr/bin/env python3
"""expense-receipt 웹훅 테스트 스크립트.

사용법:
    python webhook_test.py image.png
    python webhook_test.py ../sample/receipt_01_cafe_meeting.png

기능:
    1. 입력받은 영수증 이미지 파일 경로를 expense-receipt 웹훅으로 전송
    2. Hermes Gateway가 만든 webhook 세션 파일을 폴링해서 최종 JSON 결과 확인
    3. 추천 계정, 추천 이유, 전체 소요 시간 출력
"""

from __future__ import annotations

import argparse
import hashlib
import hmac
import json
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any

ROUTE_NAME = "expense-receipt"
DEFAULT_WEBHOOK_URL = f"http://localhost:8644/webhooks/{ROUTE_NAME}"
HERMES_HOME = Path.home() / ".hermes"
SUBSCRIPTIONS_FILE = HERMES_HOME / "webhook_subscriptions.json"
SESSIONS_DIR = HERMES_HOME / "sessions"
DEFAULT_TIMEOUT_SECONDS = 180


def resolve_image_path(value: str) -> str:
    """입력 이미지 경로를 웹훅에 넘길 문자열로 변환한다.

    - http/https URL이면 그대로 사용한다.
    - 절대 경로면 그대로 검증 후 사용한다.
    - 상대 경로면 다음 순서로 찾는다.
      1. 현재 실행 위치 기준
      2. 이 스크립트가 있는 src 폴더 기준
      3. v2.0/sample 폴더 기준
    """
    if value.startswith(("http://", "https://")):
        return value

    raw = Path(value).expanduser()
    candidates = []

    if raw.is_absolute():
        candidates.append(raw)
    else:
        script_dir = Path(__file__).resolve().parent
        candidates.extend(
            [
                Path.cwd() / raw,
                script_dir / raw,
                script_dir.parent / "sample" / raw,
            ]
        )

    for candidate in candidates:
        if candidate.exists() and candidate.is_file():
            return str(candidate.resolve())

    searched = "\n".join(f"- {c}" for c in candidates)
    raise FileNotFoundError(f"이미지 파일을 찾지 못했습니다. 확인한 경로:\n{searched}")


def load_route_secret(route_name: str = ROUTE_NAME) -> str:
    """~/.hermes/webhook_subscriptions.json에서 route secret을 읽는다."""
    if not SUBSCRIPTIONS_FILE.exists():
        raise FileNotFoundError(f"웹훅 subscription 파일이 없습니다: {SUBSCRIPTIONS_FILE}")

    data = json.loads(SUBSCRIPTIONS_FILE.read_text(encoding="utf-8"))
    route = data.get(route_name)
    if not route:
        raise KeyError(f"'{route_name}' 웹훅 route가 없습니다. 먼저 route를 생성하세요.")

    secret = route.get("secret")
    if not secret:
        raise ValueError(f"'{route_name}' route에 secret이 없습니다.")
    return secret


def sign_payload(payload_bytes: bytes, secret: str) -> str:
    """Hermes webhook이 검증하는 GitHub 스타일 HMAC 서명 생성."""
    digest = hmac.new(secret.encode("utf-8"), payload_bytes, hashlib.sha256).hexdigest()
    return "sha256=" + digest


def call_webhook(image_path: str, webhook_url: str) -> dict[str, Any]:
    """웹훅 호출 후 202 accepted 응답 JSON을 반환한다."""
    secret = load_route_secret()
    payload = {
        "image_url": image_path,
        "event_type": "receipt_test",
        "requested_by": "webhook_test.py",
    }
    payload_bytes = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    signature = sign_payload(payload_bytes, secret)

    request = urllib.request.Request(
        webhook_url,
        data=payload_bytes,
        headers={
            "Content-Type": "application/json",
            "X-Hub-Signature-256": signature,
            "X-GitHub-Event": "receipt_test",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=10) as response:
            body = response.read().decode("utf-8")
            result = json.loads(body)
            result["http_status"] = response.status
            return result
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"웹훅 호출 실패: HTTP {exc.code}\n{body}") from exc
    except urllib.error.URLError as exc:
        raise RuntimeError(f"웹훅 서버에 연결할 수 없습니다: {exc}") from exc


def extract_final_json_from_session(session_file: Path) -> dict[str, Any] | None:
    """세션 JSON에서 최종 assistant JSON 응답을 찾아 파싱한다."""
    try:
        session = json.loads(session_file.read_text(encoding="utf-8"))
    except Exception:
        return None

    if session.get("platform") != "webhook":
        return None

    messages = session.get("messages") or []
    for message in reversed(messages):
        if message.get("role") != "assistant":
            continue
        content = message.get("content")
        if not isinstance(content, str):
            continue
        content = content.strip()
        if "recommended_account" not in content:
            continue
        try:
            parsed = json.loads(content)
        except json.JSONDecodeError:
            continue
        if isinstance(parsed, dict):
            return parsed
    return None


def wait_for_result(
    delivery_id: str,
    image_path: str,
    started_at: float,
    timeout_seconds: int,
) -> dict[str, Any]:
    """Hermes webhook 세션 파일을 폴링해서 최종 결과를 기다린다.

    현재 expense-receipt route는 deliver=log라서 HTTP 응답은 202로 즉시 끝난다.
    최종 추천 결과는 Gateway가 만든 webhook session JSON에 저장되므로 그 파일을 확인한다.

    주의: webhook 세션 JSON에는 delivery_id가 직접 저장되지 않을 수 있다.
    그래서 이번 호출 이후에 수정된 webhook 세션 중 입력 이미지 경로가 들어있는
    세션을 찾아 최종 assistant JSON을 읽는다.
    """
    deadline = time.time() + timeout_seconds
    seen_files: set[Path] = set()

    while time.time() < deadline:
        if SESSIONS_DIR.exists():
            session_files = sorted(
                SESSIONS_DIR.glob("session_*.json"),
                key=lambda p: p.stat().st_mtime,
                reverse=True,
            )
            for session_file in session_files[:50]:
                try:
                    stat = session_file.stat()
                except OSError:
                    continue
                # 이번 호출보다 너무 오래된 세션은 건너뛴다.
                if stat.st_mtime < started_at - 5:
                    continue

                text = session_file.read_text(encoding="utf-8", errors="replace")
                if image_path not in text:
                    continue
                if '"platform": "webhook"' not in text:
                    continue

                seen_files.add(session_file)
                result = extract_final_json_from_session(session_file)
                if result:
                    return result

        time.sleep(2)

    checked = ", ".join(str(p) for p in sorted(seen_files)) or "없음"
    raise TimeoutError(
        f"{timeout_seconds}초 안에 최종 추천 결과를 찾지 못했습니다. "
        f"delivery_id={delivery_id}, 확인한 세션={checked}"
    )


def main() -> int:
    parser = argparse.ArgumentParser(description="expense-receipt 웹훅으로 영수증 계정 추천을 테스트합니다.")
    parser.add_argument("image", help="영수증 이미지 파일 경로/이름 또는 이미지 URL")
    parser.add_argument("--url", default=DEFAULT_WEBHOOK_URL, help=f"웹훅 URL 기본값: {DEFAULT_WEBHOOK_URL}")
    parser.add_argument("--timeout", type=int, default=DEFAULT_TIMEOUT_SECONDS, help="결과 대기 시간(초)")
    args = parser.parse_args()

    try:
        image_path = resolve_image_path(args.image)
        started_at = time.time()

        print(f"이미지: {image_path}")
        print(f"웹훅 호출: {args.url}")

        accepted = call_webhook(image_path, args.url)
        delivery_id = str(accepted.get("delivery_id", ""))
        if not delivery_id:
            raise RuntimeError(f"웹훅 응답에 delivery_id가 없습니다: {accepted}")

        print(f"웹훅 접수: HTTP {accepted.get('http_status')} / delivery_id={delivery_id}")
        print("결과 대기 중...")

        result = wait_for_result(delivery_id, image_path, started_at, args.timeout)
        elapsed = time.time() - started_at

        print("\n=== 추천 결과 ===")
        print(f"추천 계정: {result.get('recommended_account', '알 수 없음')}")
        print(f"추천 이유: {result.get('reason', '알 수 없음')}")
        print(f"걸린 시간: {elapsed:.2f}초")

        print("\n=== 전체 JSON ===")
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return 0

    except Exception as exc:
        elapsed = time.time() - locals().get("started_at", time.time())
        print(f"오류: {exc}", file=sys.stderr)
        print(f"걸린 시간: {elapsed:.2f}초", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
