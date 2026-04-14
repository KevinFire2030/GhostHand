import os
import json
from pathlib import Path

import requests

ENV_PATH = Path(r"E:\ax\PRJs\GhostHand\examples\HeyGen\.env")


def load_env(path: Path):
    text = path.read_text(encoding="utf-8-sig", errors="ignore")
    for line in text.splitlines():
        s = line.strip()
        if not s or s.startswith("#") or "=" not in s:
            continue
        k, v = s.split("=", 1)
        os.environ[k.strip()] = v.strip().strip('"').strip("'")


def main():
    load_env(ENV_PATH)
    api_key = os.getenv("HEYGEN_API_KEY", "")
    if not api_key:
        print("FAIL: HEYGEN_API_KEY not found")
        return

    headers = {
        "X-Api-Key": api_key,
        "Accept": "application/json",
    }

    url = "https://api.heygen.com/v2/voices"
    response = requests.get(url, headers=headers, timeout=60)
    print("status:", response.status_code)
    response.raise_for_status()

    data = response.json()
    output_path = Path(r"E:\ax\PRJs\GhostHand\examples\HeyGen\voices_output.json")
    output_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"saved: {output_path}")


if __name__ == "__main__":
    main()
