import os
import time
import json
from pathlib import Path

import requests

ENV_PATH = Path(r"E:\ax\PRJs\GhostHand\examples\HeyGen\.env")
BASE_URL = "https://api.heygen.com"


def load_env(path: Path):
    text = path.read_text(encoding="utf-8-sig", errors="ignore")
    for line in text.splitlines():
        s = line.strip()
        if not s or s.startswith("#") or "=" not in s:
            continue
        k, v = s.split("=", 1)
        os.environ[k.strip()] = v.strip().strip('"').strip("'")


def get_headers():
    api_key = os.getenv("HEYGEN_API_KEY", "")
    if not api_key:
        raise RuntimeError("HEYGEN_API_KEY not found in .env")
    return {
        "X-Api-Key": api_key,
        "Content-Type": "application/json",
        "Accept": "application/json",
    }


def create_avatar_video(avatar_id: str, voice_id: str, input_text: str):
    url = f"{BASE_URL}/v2/video/generate"
    payload = {
        "video_inputs": [
            {
                "character": {
                    "type": "avatar",
                    "avatar_id": avatar_id,
                    "avatar_style": "normal"
                },
                "voice": {
                    "type": "text",
                    "voice_id": voice_id,
                    "input_text": input_text
                },
                "background": {
                    "type": "color",
                    "value": "#f6f6f6"
                }
            }
        ],
        "dimension": {
            "width": 1280,
            "height": 720
        }
    }

    response = requests.post(url, headers=get_headers(), json=payload, timeout=60)
    print("[create] status:", response.status_code)
    print(response.text)
    response.raise_for_status()
    return response.json()


def get_video_status(video_id: str):
    url = f"{BASE_URL}/v1/video_status.get?video_id={video_id}"
    response = requests.get(url, headers=get_headers(), timeout=60)
    print("[status] status:", response.status_code)
    print(response.text)
    response.raise_for_status()
    return response.json()


def poll_until_complete(video_id: str, interval_sec: int = 10, max_wait_sec: int = 600):
    waited = 0
    while waited < max_wait_sec:
        data = get_video_status(video_id)
        status = data.get("data", {}).get("status") or data.get("status")
        print(f"Current status: {status}")

        if status == "completed":
            return data
        if status == "failed":
            raise RuntimeError(f"Video generation failed: {data}")

        time.sleep(interval_sec)
        waited += interval_sec

    raise TimeoutError("Timed out while waiting for video generation to complete.")


def download_video(video_url: str, output_path: Path):
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with requests.get(video_url, stream=True, timeout=120) as response:
        response.raise_for_status()
        with open(output_path, "wb") as f:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
    print(f"downloaded: {output_path}")


def save_result_files(video_id: str, final_result: dict, output_dir: Path):
    output_dir.mkdir(parents=True, exist_ok=True)

    json_path = output_dir / f"{video_id}.json"
    txt_path = output_dir / f"{video_id}.txt"

    json_path.write_text(json.dumps(final_result, ensure_ascii=False, indent=2), encoding="utf-8")

    data = final_result.get("data", {})
    txt_content = (
        f"video_id={video_id}\n"
        f"status={data.get('status')}\n"
        f"duration={data.get('duration')}\n"
        f"video_url={data.get('video_url')}\n"
        f"thumbnail_url={data.get('thumbnail_url')}\n"
        f"gif_url={data.get('gif_url')}\n"
    )
    txt_path.write_text(txt_content, encoding="utf-8")

    print(f"saved json: {json_path}")
    print(f"saved txt: {txt_path}")


if __name__ == "__main__":
    load_env(ENV_PATH)

    avatar_id = os.getenv("HEYGEN_AVATAR_ID", "").strip()
    voice_id = os.getenv("HEYGEN_VOICE_ID", "").strip()
    input_text = os.getenv("HEYGEN_INPUT_TEXT", "").strip()

    if not avatar_id:
        raise RuntimeError("HEYGEN_AVATAR_ID not found in .env")
    if not voice_id:
        raise RuntimeError("HEYGEN_VOICE_ID not found in .env")
    if not input_text:
        raise RuntimeError("HEYGEN_INPUT_TEXT not found in .env")

    result = create_avatar_video(avatar_id, voice_id, input_text)

    video_id = (
        result.get("data", {}).get("video_id")
        or result.get("video_id")
    )
    print("video_id:", video_id)

    if video_id:
        final_result = poll_until_complete(video_id)
        print("final result:")
        print(final_result)

        output_dir = Path(r"E:\ax\PRJs\GhostHand\examples\HeyGen\output")
        save_result_files(video_id, final_result, output_dir)

        video_url = final_result.get("data", {}).get("video_url")
        if video_url:
            output_file = output_dir / f"{video_id}.mp4"
            download_video(video_url, output_file)
        else:
            print("video_url not found in final result.")
    else:
        print("video_id not found in response. Check response body above.")
