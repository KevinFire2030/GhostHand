import os
import requests
from pathlib import Path

ENV_PATH = Path(r"E:\ax\PRJs\GhostHand\examples\HeyGen\.env")


def load_env(path: Path):
    for line in path.read_text(encoding="utf-8", errors="ignore").splitlines():
        s = line.strip()
        if not s or s.startswith('#') or '=' not in s:
            continue
        k, v = s.split('=', 1)
        os.environ[k.strip()] = v.strip().strip('"').strip("'")


def main():
    load_env(ENV_PATH)
    api_key = os.getenv('HEYGEN_API_KEY', '')
    if not api_key:
        print('FAIL: HEYGEN_API_KEY not found')
        return

    headers = {
        'X-Api-Key': api_key,
        'Accept': 'application/json'
    }

    # lightweight auth test against HeyGen docs-referenced API host may vary by version
    urls = [
        'https://api.heygen.com/v2/avatars',
        'https://api.heygen.com/v1/avatar.list'
    ]

    for url in urls:
        try:
            r = requests.get(url, headers=headers, timeout=30)
            print(f'URL: {url}')
            print(f'STATUS: {r.status_code}')
            print(r.text[:500])
            print('-' * 60)
            if r.status_code in (200, 401, 403, 404):
                break
        except Exception as e:
            print(f'URL: {url}')
            print(f'ERROR: {e}')
            print('-' * 60)


if __name__ == '__main__':
    main()
