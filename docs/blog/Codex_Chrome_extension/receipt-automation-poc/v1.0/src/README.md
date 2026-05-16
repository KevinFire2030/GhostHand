# Receipt Automation PoC

Electron 기반 영수증 자동 정산 계정 추천 PoC입니다.

## 핵심 흐름

1. 사용자가 영수증 이미지를 선택합니다.
2. Electron 앱이 이미지를 base64로 변환해 OpenClaw 웹훅 endpoint로 API 호출합니다.
3. OpenClaw 에이전트/스킬이 영수증을 분석합니다.
4. 앱이 추천 정산 계정과 이유를 출력합니다.

## 실행

```bash
npm install
npm start
```

## 웹훅 연결

앱 상단의 `OpenClaw Webhook Endpoint`에 실제 웹훅 URL을 입력합니다.
비워두면 PoC 데모용 로컬 mock 결과를 반환합니다.

요청 JSON 예시:

```json
{
  "type": "receipt_account_recommendation",
  "fileName": "credit_card_receipt_sample.png",
  "mimeType": "image/png",
  "imageBase64": "...",
  "accounts": ["회의비", "판촉비", "국내교통비", "물품구매"],
  "instruction": "영수증 이미지를 분석해서 가장 유사한 경비 정산 계정을 하나 추천하고, 이유를 한국어로 짧게 설명해줘."
}
```

응답 JSON 권장 형식:

```json
{
  "account": "회의비",
  "reason": "스타벅스 결제 내역으로 업무 미팅/회의 목적 가능성이 높습니다.",
  "confidence": 0.86
}
```

## 윈도우 설치 파일 생성

```bash
npm run dist
```

생성 예시:

```text
dist/receipt-automation-poc-setup.1.0.0.exe
```

`electron-builder`의 NSIS one-click installer를 사용하므로 사용자는 exe를 클릭해 설치/실행할 수 있습니다.
