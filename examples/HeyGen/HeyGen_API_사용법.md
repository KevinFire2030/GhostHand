# HeyGen API 사용법

## 1. 개요
HeyGen API는 아바타 기반 영상 생성, 음성 기반 영상 생성, 비디오 번역, 립싱크, 스트리밍 아바타 등의 기능을 제공하는 영상 생성 API입니다.

현재 기준으로는 **v3가 메인 플랫폼**이며, 신규 기능과 개선은 주로 v3 기준으로 제공됩니다. 다만 일부 기능(예: Studio API, Template API)은 문서상 v2 기반 설명이 여전히 남아 있을 수 있습니다.

- 공식 개발자 문서: https://developers.heygen.com
- 레거시 문서: https://docs.heygen.com

---

## 2. 인증 방식
HeyGen Direct API는 보통 **API Key** 방식으로 인증합니다.

- HeyGen 대시보드에서 API Key 발급
- 요청 시 헤더에 API Key 전달

예시 헤더:
```http
X-Api-Key: YOUR_HEYGEN_API_KEY
Content-Type: application/json
```

문서 기준 안내:
- MCP는 OAuth 기반
- Skills / Direct API는 `X-Api-Key` 헤더 기반

---

## 3. 주요 활용 시나리오
HeyGen API로 할 수 있는 대표 작업은 아래와 같습니다.

1. **아바타 영상 생성**
   - 아바타와 음성을 선택해 발표/설명/홍보 영상을 생성
2. **오디오 기반 영상 생성**
   - 미리 준비한 음성 파일을 사용해 영상 생성
3. **비디오 번역**
   - 기존 영상을 다국어로 번역 및 더빙
4. **립싱크**
   - 새 오디오에 맞게 입 모양 동기화
5. **스트리밍 아바타**
   - 실시간 상호작용형 아바타 세션 구성

---

## 4. 기본 사용 흐름 (아바타 영상 생성)
문서 기준 가장 기본적인 흐름은 다음과 같습니다.

### Step 1. 아바타 목록 조회
사용 가능한 아바타 목록을 조회해서 `avatar_id`를 확인합니다.

### Step 2. 음성 목록 조회
사용 가능한 음성 목록을 조회해서 `voice_id`를 확인합니다.

### Step 3. 영상 생성 요청
선택한 `avatar_id`, `voice_id`, 스크립트를 포함해 영상 생성 API를 호출합니다.

### Step 4. 상태 조회
응답으로 받은 `video_id`를 사용해 생성 상태를 조회합니다.

### Step 5. 결과 다운로드
상태가 `completed`가 되면 반환된 URL로 mp4 파일을 다운로드합니다.

---

## 5. 대표 상태값
영상 생성 상태는 보통 아래처럼 관리됩니다.

- `pending`: 대기 중
- `waiting`: 렌더 대기 상태
- `processing`: 렌더링 중
- `completed`: 완료
- `failed`: 실패

참고:
- 완료 후 내려오는 비디오 URL은 **일정 기간(문서상 7일)** 후 만료될 수 있습니다.

---

## 6. 예시 요청 흐름
아래는 개념 이해용 예시입니다.

### 6-1. 아바타/음성 조회
```bash
curl -X GET "https://api.heygen.com/..." \
  -H "X-Api-Key: YOUR_HEYGEN_API_KEY"
```

### 6-2. 영상 생성 요청
```bash
curl -X POST "https://api.heygen.com/..." \
  -H "X-Api-Key: YOUR_HEYGEN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "avatar_id": "YOUR_AVATAR_ID",
    "voice_id": "YOUR_VOICE_ID",
    "input_text": "안녕하세요. HeyGen API 사용 예시입니다."
  }'
```

### 6-3. 상태 조회
```bash
curl -X GET "https://api.heygen.com/.../VIDEO_ID" \
  -H "X-Api-Key: YOUR_HEYGEN_API_KEY"
```

### 6-4. 완료 후 다운로드
```bash
curl "VIDEO_DOWNLOAD_URL" --output output.mp4
```

> 주의: 실제 엔드포인트 경로는 HeyGen 문서 버전(v2/v3)에 따라 다를 수 있으므로, 구현 시 반드시 공식 문서의 최신 endpoint를 확인해야 합니다.

---

## 7. 구현 시 주의사항

### 7-1. v2 / v3 혼용 주의
- HeyGen은 현재 v3 중심으로 운영됨
- 하지만 일부 가이드는 v2 endpoint 예시를 포함함
- 실제 개발 시에는 **기능별로 어느 버전 endpoint를 써야 하는지 먼저 확인**해야 함

### 7-2. API Key 보안
- API Key는 코드에 하드코딩하지 말고 `.env`로 관리 권장
- 예:
```env
HEYGEN_API_KEY=your_api_key_here
```

### 7-3. 입력 제한
문서 기준으로 아바타 영상 생성 시 텍스트 입력 길이 제한이 있을 수 있습니다.
예시 문서에는 5000자 미만 제한 안내가 있습니다.

### 7-4. 해상도 제한
플랜에 따라 생성 가능한 최대 해상도가 다를 수 있습니다. 문서 예시에는 무료 API 플랜 기준 720p 제한 안내가 있습니다.

### 7-5. 비용 구조
HeyGen은 기능별 과금 구조가 다릅니다.
예를 들어:
- Video Agent
- Photo Avatar
- Digital Twin
- Translation
- Lipsync
- Voices
등이 각각 초당 과금 또는 별도 정책을 가질 수 있습니다.

실사용 전에는 반드시 대시보드/API 가격 정책을 확인해야 합니다.

---

## 8. Python 예시 코드
아래는 개념 확인용 최소 예시입니다.

```python
import os
import requests

API_KEY = os.getenv("HEYGEN_API_KEY")
HEADERS = {
    "X-Api-Key": API_KEY,
    "Content-Type": "application/json",
}

payload = {
    "avatar_id": "YOUR_AVATAR_ID",
    "voice_id": "YOUR_VOICE_ID",
    "input_text": "안녕하세요. HeyGen API 테스트입니다."
}

url = "https://api.heygen.com/YOUR_ENDPOINT"
response = requests.post(url, headers=HEADERS, json=payload, timeout=60)
print(response.status_code)
print(response.text)
```

> 위 코드는 구조 설명용이며, 실제 endpoint는 HeyGen 공식 문서의 최신 값을 넣어야 합니다.

---

## 9. 추천 작업 순서
HeyGen API를 처음 붙일 때는 아래 순서를 권장합니다.

1. HeyGen 계정 생성
2. API Key 발급
3. 공식 문서에서 현재 사용할 기능의 최신 endpoint 확인
4. Postman 또는 curl로 단건 호출 테스트
5. Python/Node.js 코드로 래핑
6. 생성 결과 다운로드 및 품질 검증
7. 프로젝트 자동화 파이프라인에 연결

---

## 10. 우리 프로젝트 관점 메모
현재 폴더 구조상 `HeyGen`은 음성/스크립트/예제 파일을 두고, 이후 다음 작업으로 확장하기 좋습니다.

예시 확장:
- `voice/` : mp3 음성 파일 보관
- `scripts/` : 발표 스크립트 보관
- `examples/` : API 호출 예제 코드
- `.env.example` : API 키 예시
- `make_video.py` : 음성/스크립트 기반 영상 생성 스크립트

---

## 11. 참고 링크
- Developers: https://developers.heygen.com
- Legacy Docs: https://docs.heygen.com/docs/quick-start
- Create Video Guide: https://docs.heygen.com/docs/create-video
- Streaming Avatar SDK: https://docs.heygen.com/docs/streaming-avatar-sdk-reference

---

## 12. 한 줄 요약
HeyGen API는 **아바타, 음성, 번역, 립싱크 기반 영상 생성 자동화 API**이며, 기본적으로는 **API Key 인증 → 아바타/음성 선택 → 영상 생성 → 상태 조회 → 결과 다운로드** 흐름으로 사용합니다.
