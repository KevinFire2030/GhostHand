import os
import json
import time
from pathlib import Path

import requests
import streamlit as st

BASE_DIR = Path(r"E:\ax\PRJs\GhostHand\examples\HeyGen")
ENV_PATH = BASE_DIR / ".env"
OUTPUT_DIR = BASE_DIR / "output"
BASE_URL = "https://api.heygen.com"


def load_env(path: Path):
    env = {}
    if not path.exists():
        return env
    text = path.read_text(encoding="utf-8-sig", errors="ignore")
    for line in text.splitlines():
        s = line.strip()
        if not s or s.startswith("#") or "=" not in s:
            continue
        k, v = s.split("=", 1)
        env[k.strip()] = v.strip().strip('"').strip("'")
    return env


def save_env(path: Path, values: dict):
    lines = [
        f"HEYGEN_API_KEY={values.get('HEYGEN_API_KEY', '')}",
        f"HEYGEN_AVATAR_ID={values.get('HEYGEN_AVATAR_ID', '')}",
        f"HEYGEN_VOICE_ID={values.get('HEYGEN_VOICE_ID', '')}",
        f"HEYGEN_INPUT_TEXT={values.get('HEYGEN_INPUT_TEXT', '')}",
    ]
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def get_headers(api_key: str):
    return {
        "X-Api-Key": api_key,
        "Content-Type": "application/json",
        "Accept": "application/json",
    }


def fetch_avatars(api_key: str):
    url = f"{BASE_URL}/v2/avatars"
    response = requests.get(url, headers=get_headers(api_key), timeout=60)
    response.raise_for_status()
    data = response.json()
    return data.get("data", {}).get("avatars", [])


def fetch_voices(api_key: str):
    url = f"{BASE_URL}/v2/voices"
    response = requests.get(url, headers=get_headers(api_key), timeout=60)
    response.raise_for_status()
    data = response.json()
    return data.get("data", {}).get("voices", [])


def create_video(api_key: str, avatar_id: str, voice_id: str, input_text: str):
    url = f"{BASE_URL}/v2/video/generate"
    payload = {
        "video_inputs": [
            {
                "character": {
                    "type": "avatar",
                    "avatar_id": avatar_id,
                    "avatar_style": "normal",
                },
                "voice": {
                    "type": "text",
                    "voice_id": voice_id,
                    "input_text": input_text,
                },
                "background": {
                    "type": "color",
                    "value": "#f6f6f6",
                },
            }
        ],
        "dimension": {
            "width": 1280,
            "height": 720,
        },
    }
    response = requests.post(url, headers=get_headers(api_key), json=payload, timeout=60)
    response.raise_for_status()
    return response.json()


def get_video_status(api_key: str, video_id: str):
    url = f"{BASE_URL}/v1/video_status.get?video_id={video_id}"
    response = requests.get(url, headers=get_headers(api_key), timeout=60)
    response.raise_for_status()
    return response.json()


def download_file(url: str, output_path: Path):
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with requests.get(url, stream=True, timeout=120) as response:
        response.raise_for_status()
        with open(output_path, "wb") as f:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)


def save_result(video_id: str, final_result: dict):
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    json_path = OUTPUT_DIR / f"{video_id}.json"
    txt_path = OUTPUT_DIR / f"{video_id}.txt"
    mp4_path = OUTPUT_DIR / f"{video_id}.mp4"

    json_path.write_text(json.dumps(final_result, ensure_ascii=False, indent=2), encoding="utf-8")

    data = final_result.get("data", {})
    txt_path.write_text(
        "\n".join([
            f"video_id={video_id}",
            f"status={data.get('status')}",
            f"duration={data.get('duration')}",
            f"video_url={data.get('video_url')}",
            f"thumbnail_url={data.get('thumbnail_url')}",
            f"gif_url={data.get('gif_url')}",
        ]) + "\n",
        encoding="utf-8",
    )

    video_url = data.get("video_url")
    if video_url:
        download_file(video_url, mp4_path)

    return json_path, txt_path, mp4_path if mp4_path.exists() else None


st.set_page_config(page_title="HeyGen WebUI", layout="wide")
st.title("HeyGen AI 아바타 영상 생성 WebUI")

env_values = load_env(ENV_PATH)

left, middle, right = st.columns([1.2, 1, 1])

with left:
    st.subheader("설정 (.env)")
    api_key = st.text_input("API Key", value=env_values.get("HEYGEN_API_KEY", ""), type="password")

    avatar_list = []
    voice_list = []
    avatar_options = {}
    voice_options = {}

    if api_key:
        try:
            avatar_list = fetch_avatars(api_key)
            voice_list = fetch_voices(api_key)
            avatar_options = {
                f"{a.get('avatar_name', a.get('avatar_id'))} | {a.get('avatar_id')}": a.get('avatar_id')
                for a in avatar_list
            }
            voice_options = {
                f"{v.get('name', v.get('voice_id'))} | {v.get('language')} | {v.get('voice_id')}": v.get('voice_id')
                for v in voice_list
            }
        except Exception as e:
            st.error(f"avatar/voice 목록 조회 실패: {e}")

    st.markdown("### 입력")

    avatar_default = env_values.get("HEYGEN_AVATAR_ID", "")
    voice_default = env_values.get("HEYGEN_VOICE_ID", "")
    input_text_default = env_values.get("HEYGEN_INPUT_TEXT", "")

    avatar_labels = list(avatar_options.keys())
    voice_labels = list(voice_options.keys())

    avatar_index = 0
    if avatar_default and avatar_options:
        matches = [i for i, label in enumerate(avatar_labels) if avatar_options[label] == avatar_default]
        if matches:
            avatar_index = matches[0]

    voice_index = 0
    if voice_default and voice_options:
        matches = [i for i, label in enumerate(voice_labels) if voice_options[label] == voice_default]
        if matches:
            voice_index = matches[0]

    selected_avatar_label = st.selectbox("avatar_id 선택", avatar_labels if avatar_labels else [avatar_default or ""], index=avatar_index if avatar_labels else 0)
    selected_voice_label = st.selectbox("voice_id 선택", voice_labels if voice_labels else [voice_default or ""], index=voice_index if voice_labels else 0)

    selected_avatar_id = avatar_options.get(selected_avatar_label, avatar_default)
    selected_voice_id = voice_options.get(selected_voice_label, voice_default)

    manual_avatar_id = st.text_input("avatar_id", value=selected_avatar_id)
    manual_voice_id = st.text_input("voice_id", value=selected_voice_id)
    input_text = st.text_area("input_text", value=input_text_default, height=200)

    if st.button(".env 저장"):
        save_env(ENV_PATH, {
            "HEYGEN_API_KEY": api_key,
            "HEYGEN_AVATAR_ID": manual_avatar_id,
            "HEYGEN_VOICE_ID": manual_voice_id,
            "HEYGEN_INPUT_TEXT": input_text,
        })
        st.success(".env 저장 완료")

with middle:
    st.subheader("처리")
    process_box = st.empty()
    log_box = st.empty()

with right:
    st.subheader("출력")
    output_box = st.empty()
    download_box = st.empty()

if st.button("영상 생성 시작", type="primary"):
    logs = []

    def add_log(message):
        logs.append(message)
        log_box.code("\n".join(logs))

    try:
        process_box.info("생성 요청 중...")
        add_log("생성 요청 시작")

        result = create_video(api_key, manual_avatar_id, manual_voice_id, input_text)
        video_id = result.get("data", {}).get("video_id") or result.get("video_id")
        add_log(f"video_id 생성: {video_id}")

        process_box.warning("영상 생성중...")
        status = None
        final_result = None

        for _ in range(60):
            final_result = get_video_status(api_key, video_id)
            status = final_result.get("data", {}).get("status") or final_result.get("status")
            add_log(f"현재 상태: {status}")
            if status == "completed":
                break
            if status == "failed":
                raise RuntimeError(str(final_result))
            time.sleep(5)

        if status != "completed":
            raise TimeoutError("제한 시간 내 생성이 완료되지 않았습니다.")

        process_box.success("생성 완료")
        add_log("생성 완료")

        json_path, txt_path, mp4_path = save_result(video_id, final_result)
        process_box.success("다운로드 완료")
        add_log(f"json 저장: {json_path}")
        add_log(f"txt 저장: {txt_path}")
        if mp4_path:
            add_log(f"mp4 저장: {mp4_path}")

        data = final_result.get("data", {})
        output_box.json({
            "video_id": video_id,
            "status": data.get("status"),
            "duration": data.get("duration"),
            "video_url": data.get("video_url"),
            "thumbnail_url": data.get("thumbnail_url"),
        })

        if mp4_path and mp4_path.exists():
            output_box.markdown("### 생성 영상 미리보기")
            output_box.video(str(mp4_path))

            with open(mp4_path, "rb") as f:
                download_box.download_button(
                    label="mp4 다운로드",
                    data=f.read(),
                    file_name=mp4_path.name,
                    mime="video/mp4",
                )

    except Exception as e:
        process_box.error(f"오류 발생: {e}")
        add_log(f"오류: {e}")
