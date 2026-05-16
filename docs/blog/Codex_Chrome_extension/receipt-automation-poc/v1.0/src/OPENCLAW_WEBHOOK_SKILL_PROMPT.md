# OpenClaw Webhook Agent Prompt Draft

Electron 앱의 웹훅 endpoint가 호출되면 아래 의도로 처리합니다.

## 입력

JSON body:

- `type`: `receipt_account_recommendation`
- `fileName`: 이미지 파일명
- `mimeType`: 이미지 MIME 타입
- `imageBase64`: 영수증 이미지 base64
- `accounts`: 추천 가능한 정산 계정 목록
- `instruction`: 사용자 지시문

## 처리

1. `imageBase64`를 이미지로 해석합니다.
2. 영수증의 가맹점명, 품목, 금액, 업종 단서를 추출합니다.
3. `accounts` 중 가장 유사한 정산 계정 하나를 고릅니다.
4. 짧은 한국어 이유와 confidence를 반환합니다.

## 응답 형식

```json
{
  "account": "회의비",
  "reason": "스타벅스 결제 영수증으로 업무 미팅/회의성 지출 가능성이 높아 회의비로 추천합니다.",
  "confidence": 0.86
}
```

## 계정 판단 예시

- 카페/음식점 + 미팅/업무 맥락 가능성: `회의비`
- 광고, 인쇄물, 이벤트, 고객 증정품: `판촉비`
- 택시, 기차, 버스, 주차, 고속도로: `국내교통비`
- 사무용품, 장비, 비품: `물품구매`
- 직원 식대/복지성 구매: `복리후생비`
- 소액 잡자재/소모성 구매: `소모품비`
