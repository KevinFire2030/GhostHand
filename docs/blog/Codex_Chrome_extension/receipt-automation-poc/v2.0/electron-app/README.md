# Receipt Auto Account Electron Demo

영수증 이미지를 선택하면 기존 `v2.0/src/webhook_test.py`를 실행해서 Hermes `expense-receipt` 웹훅을 호출하고, 추천 계정/추천 이유를 화면 카드로 보여주는 Electron PoC 앱입니다.

## 실행 방법

### WSL에서 실행

```bash
cd /mnt/e/ax/PRJs/GhostHand/docs/blog/Codex_Chrome_extension/receipt-automation-poc/v2.0/electron-app
npm install
npm start
```

### Windows PowerShell에서 실행

```powershell
cd E:\ax\PRJs\GhostHand\docs\blog\Codex_Chrome_extension\receipt-automation-poc\v2.0\electron-app
npm install
npm start
```

Windows에서 실행하면 Electron main process가 내부적으로 `wsl.exe`를 호출해서 WSL의 `python3 src/webhook_test.py ...`를 실행합니다.

## 사전 조건

- Hermes Gateway가 WSL에서 실행 중이어야 합니다.
- `expense-receipt` 웹훅 route가 생성되어 있어야 합니다.
- WSL에 `python3`가 있어야 합니다.
- Windows에서 실행할 경우 `wsl.exe`가 사용 가능해야 합니다.

Gateway 확인:

```bash
hermes gateway status
```

꺼져 있으면 다른 WSL 터미널에서 실행:

```bash
hermes gateway run
```

## 데모 흐름

1. 샘플 영수증 버튼을 누르거나 이미지 파일을 선택합니다.
2. 이미지 미리보기를 확인합니다.
3. `웹훅 호출하고 분석하기` 버튼을 누릅니다.
4. 앱이 `webhook_test.py`를 실행합니다.
5. 추천 계정, 추천 이유, 가맹점, 금액, 걸린 시간이 화면에 표시됩니다.

## 개발/검증

```bash
npm test
npm run check
```
