# HeyGen WebUI

Streamlit 기반으로 HeyGen AI 아바타 영상을 생성하는 간단한 웹 UI 예제입니다.

## 1. 기능
- `.env` 값 불러오기 및 저장
- HeyGen avatar / voice 목록 조회
- avatar_id / voice_id / input_text 선택 및 수정
- 영상 생성 진행 상태 표시
- 생성 결과 요약 출력
- mp4 다운로드

## 2. 폴더 구조
```text
WebUI/
├─ app.py
├─ PRD.md
├─ README.md
└─ requirements.txt
```

## 3. 사전 준비
상위 HeyGen 폴더의 `.env` 파일에 아래 값이 있어야 합니다.

```env
HEYGEN_API_KEY=your_api_key
HEYGEN_AVATAR_ID=your_avatar_id
HEYGEN_VOICE_ID=your_voice_id
HEYGEN_INPUT_TEXT=안녕하세요. 테스트 문장입니다.
```

## 4. 설치
```powershell
cd "E:\ax\PRJs\GhostHand\examples\HeyGen\WebUI"
pip install -r requirements.txt
```

## 5. 실행
```powershell
streamlit run "E:\ax\PRJs\GhostHand\examples\HeyGen\WebUI\app.py"
```

## 6. 화면 구성
- 왼쪽: 설정(.env), avatar/voice 선택, input_text 입력
- 중간: 생성 상태 및 처리 로그
- 오른쪽: 생성 결과 요약 및 mp4 다운로드

## 7. 출력 파일
영상 생성 완료 후 상위 `HeyGen/output` 폴더에 아래 파일이 저장됩니다.

- `<video_id>.mp4`
- `<video_id>.json`
- `<video_id>.txt`

## 8. 주의사항
- `.env`는 민감 정보가 있으므로 Git에 올리지 않아야 합니다.
- HeyGen API 사용량에 따라 크레딧이 차감됩니다.
- avatar / voice 목록 조회와 영상 생성은 HeyGen API 연결 상태에 따라 실패할 수 있습니다.
