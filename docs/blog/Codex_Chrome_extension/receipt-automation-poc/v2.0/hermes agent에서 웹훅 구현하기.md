# Hermes Agent에서 웹훅 구현하기

이 문서는 Hermes Agent로 **경비정산 웹훅**을 만드는 방법을 아주 쉽게 설명합니다.

목표는 다음과 같습니다.

> 웹훅 엔드포인트로 영수증 이미지 URL을 보내면, Hermes Agent가 `vision_analyze` 도구로 이미지를 읽고, 경비정산 추천 계정을 알려준다.

초등학생도 이해할 수 있도록 쉬운 비유와 함께 설명합니다.

---

## 1. 웹훅이 뭐예요?

웹훅은 쉽게 말하면 **인터넷 초인종**입니다.

누군가 초인종을 누르면 집 안 사람이 “누가 왔지?” 하고 확인하듯이, 어떤 프로그램이 웹훅 주소로 데이터를 보내면 Hermes Agent가 “무슨 일이 왔지?” 하고 일을 시작합니다.

예를 들어 이런 상황입니다.

```text
영수증 업로드 앱
   ↓
웹훅 주소로 영수증 정보 전송
   ↓
Hermes Agent가 받음
   ↓
영수증 이미지 분석
   ↓
추천 계정 반환
```

즉, 웹훅은 **다른 프로그램이 Hermes Agent에게 일을 시키는 입구**입니다.

---

## 2. 우리가 만들고 싶은 경비정산 웹훅

우리가 원하는 기능은 다음과 같습니다.

```text
POST /webhooks/expense-receipt
```

이 주소로 영수증 이미지 URL을 보내면:

1. Hermes Agent가 요청을 받습니다.
2. 이미지 URL을 확인합니다.
3. `vision_analyze` 도구로 영수증 이미지를 읽습니다.
4. 가맹점, 품목, 금액을 뽑습니다.
5. `계정_샘플.md`에 있는 계정 중 하나를 추천합니다.
6. 추천 이유를 함께 알려줍니다.

---

## 3. 전체 구조 한눈에 보기

```text
[외부 앱 / 웹앱 / curl]
        ↓
[Hermes Webhook Gateway]
        ↓
[Hermes Agent]
        ↓
[vision_analyze 도구]
        ↓
[비전 LLM이 영수증 이미지 분석]
        ↓
[추천 계정 결과 생성]
```

조금 더 경비정산 PoC 관점으로 쓰면 다음과 같습니다.

```text
영수증 이미지 URL
        ↓
웹훅 호출
        ↓
Hermes Agent 실행
        ↓
vision_analyze로 이미지 읽기
        ↓
회의비 / 국내교통비 / 접대비 / 판촉비 등 계정 추천
        ↓
JSON 또는 메시지로 결과 전달
```

---

## 4. 가능 여부

가능합니다.

Hermes Agent에는 기본적으로 **Webhook 기능**이 있습니다.

Hermes Agent CLI에는 다음 명령들이 있습니다.

```bash
hermes webhook list
hermes webhook subscribe <name>
hermes webhook remove <name>
hermes webhook test <name>
```

이 기능을 사용하면 외부에서 HTTP POST 요청을 보냈을 때 Hermes Agent가 자동으로 실행됩니다.

---

## 5. 현재 이 머신의 상태

현재 이 머신에서 확인했을 때 웹훅 플랫폼은 아직 꺼져 있었습니다.

확인 명령:

```bash
hermes webhook list
```

현재 상태:

```text
Webhook platform is not enabled.
```

즉, 먼저 웹훅 기능을 켜야 합니다.

---

## 6. 먼저 알아야 할 용어

### Hermes Agent

명령을 받고, 도구를 사용해서 일을 처리하는 AI 에이전트입니다.

이번 PoC에서는 Hermes Agent가 영수증 이미지를 보고 추천 계정을 정합니다.

### Gateway

Hermes Agent가 Telegram, Discord, Webhook 같은 외부 세계와 연결되는 통로입니다.

웹훅을 쓰려면 Hermes Gateway가 실행 중이어야 합니다.

### Webhook

외부 프로그램이 Hermes Agent에게 일을 요청하는 HTTP 주소입니다.

예:

```text
http://localhost:8644/webhooks/expense-receipt
```

### Subscription

“이 웹훅 주소로 요청이 오면 어떤 일을 할지” 저장해 둔 규칙입니다.

예:

```text
expense-receipt 웹훅으로 요청이 오면,
image_url을 읽고 영수증 계정을 추천해라.
```

### HMAC Secret

웹훅을 아무나 호출하지 못하게 막는 비밀번호 같은 것입니다.

운영 환경에서는 반드시 사용해야 합니다.

---

## 7. 구현 방식 2가지

경비정산 웹훅은 크게 두 가지 방식으로 만들 수 있습니다.

## 방식 A. Hermes 기본 Webhook Subscription 사용

가장 빠르게 PoC를 만들 수 있는 방법입니다.

특징:

- Hermes에 이미 있는 웹훅 기능을 사용합니다.
- JSON payload를 받습니다.
- 이미지 파일 자체보다는 `image_url`을 보내는 방식이 쉽습니다.
- Hermes Agent가 자연어 프롬프트를 실행합니다.
- Agent가 필요하면 `vision_analyze` 도구를 호출합니다.

이 방식은 빠른 데모에 좋습니다.

## 방식 B. 전용 API 서버를 따로 만들기

더 서비스답게 만들고 싶을 때 쓰는 방법입니다.

특징:

- FastAPI나 Flask 같은 Python 서버를 직접 만듭니다.
- `multipart/form-data`로 이미지 파일 자체를 업로드받을 수 있습니다.
- 업로드된 이미지를 서버에 저장합니다.
- 저장된 로컬 이미지 경로를 `vision_analyze`에 넘깁니다.
- 결과를 JSON으로 바로 응답합니다.

이 방식은 실제 제품 API에 더 가깝습니다.

처음 PoC는 **방식 A**로 시작하고, 나중에 필요하면 **방식 B**로 확장하는 것을 추천합니다.

---

# PART A. Hermes 기본 Webhook Subscription으로 만들기

## 8. 1단계: 웹훅 기능 켜기

웹훅 기능을 켜는 방법은 3가지가 있습니다.

---

## 방법 1. 설정 마법사 사용

가장 쉬운 방법입니다.

```bash
hermes gateway setup
```

실행 후 Webhook 플랫폼을 켜고, 포트와 secret을 설정합니다.

예시 설정:

```text
Webhook enabled: true
Host: 0.0.0.0
Port: 8644
Secret: 아주-긴-랜덤-문자열
```

---

## 방법 2. `config.yaml` 직접 수정

Hermes 설정 파일은 보통 여기에 있습니다.

```text
~/.hermes/config.yaml
```

아래 내용을 추가합니다.

```yaml
platforms:
  webhook:
    enabled: true
    extra:
      host: "0.0.0.0"
      port: 8644
      secret: "generate-a-strong-secret-here"
```

주의:

- `secret`은 꼭 강력한 문자열로 바꿔야 합니다.
- 예: `receipt-poc-webhook-secret-2026-long-random-text`
- 실제 운영에서는 Git에 올리면 안 됩니다.

---

## 방법 3. `.env` 파일에 환경변수로 설정

Hermes 환경변수 파일은 보통 여기에 있습니다.

```text
~/.hermes/.env
```

아래 내용을 추가합니다.

```bash
WEBHOOK_ENABLED=true
WEBHOOK_PORT=8644
WEBHOOK_SECRET=generate-a-strong-secret-here
```

---

## 9. 2단계: Hermes Gateway 실행하기

설정 후 Gateway를 실행합니다.

```bash
hermes gateway run
```

WSL 환경에서는 터미널을 닫으면 gateway도 꺼질 수 있습니다.

오래 켜두려면 `tmux`를 쓰면 좋습니다.

```bash
tmux new -s hermes-gateway
hermes gateway run
```

터미널을 분리하려면:

```text
Ctrl + B 누르고, D 누르기
```

다시 들어가려면:

```bash
tmux attach -t hermes-gateway
```

---

## 10. 3단계: Gateway가 살아있는지 확인하기

다른 터미널에서 확인합니다.

```bash
curl http://localhost:8644/health
```

정상이라면 이런 응답이 나옵니다.

```json
{"status":"ok"}
```

만약 연결이 안 되면 다음을 확인합니다.

```bash
ps aux | grep hermes
```

로그 확인:

```bash
grep webhook ~/.hermes/logs/gateway.log | tail -20
```

---

## 11. 4단계: 경비정산 웹훅 Subscription 만들기

이제 `expense-receipt`라는 웹훅을 만듭니다.

아래 명령은 이미지 URL을 받아서 영수증 계정을 추천하도록 Hermes Agent에게 지시합니다.

```bash
hermes webhook subscribe expense-receipt \
  --description "영수증 이미지 URL을 받아 경비정산 추천 계정을 반환하는 PoC 웹훅" \
  --prompt "다음 영수증 이미지 URL을 vision_analyze 도구로 분석해줘.

이미지 URL:
{image_url}

반드시 아래 계정 중 하나만 추천해:
- 회의비
- 국내교통비
- 해외교통비
- 접대비
- 판촉비
- 소모품비
- 통신비
- 교육훈련비
- 출장숙박비
- 소프트웨어구독료

해야 할 일:
1. 영수증 이미지에서 가맹점명을 읽어줘.
2. 주요 품목을 읽어줘.
3. 총 결제금액을 읽어줘.
4. 위 계정 목록 중 가장 적절한 추천 계정을 하나 골라줘.
5. 왜 그 계정인지 초등학생도 이해할 수 있게 설명해줘.

출력은 반드시 아래 JSON 형식으로만 작성해:
{
  \"merchant\": \"가맹점명\",
  \"items\": [\"품목1\", \"품목2\"],
  \"amount\": \"총 결제금액\",
  \"recommended_account\": \"추천 계정\",
  \"reason\": \"추천 사유\"
}" \
  --deliver log
```

설명:

- `expense-receipt`: 웹훅 이름입니다.
- `--description`: 웹훅 설명입니다.
- `--prompt`: 웹훅이 호출되었을 때 Hermes Agent에게 줄 지시문입니다.
- `{image_url}`: POST 요청의 JSON payload에서 `image_url` 값을 가져오는 자리입니다.
- `--deliver log`: 결과를 로그에 남기는 방식입니다.

참고:

- Telegram으로 결과를 받고 싶으면 `--deliver telegram`을 사용할 수 있습니다.
- 특정 채팅방으로 보내려면 chat id 설정이 필요합니다.

---

## 12. 5단계: 웹훅 목록 확인하기

```bash
hermes webhook list
```

정상적으로 만들어졌다면 `expense-receipt`가 보여야 합니다.

---

## 13. 6단계: 테스트 payload로 호출하기

먼저 인터넷에서 접근 가능한 이미지 URL이 있다고 가정합니다.

예:

```text
https://example.com/receipt.png
```

테스트 호출:

```bash
curl -X POST http://localhost:8644/webhooks/expense-receipt \
  -H "Content-Type: application/json" \
  -d '{
    "image_url": "https://example.com/receipt.png"
  }'
```

Hermes Agent는 이 JSON에서 `image_url`을 꺼내서 프롬프트의 `{image_url}` 자리에 넣습니다.

그 다음 `vision_analyze` 도구로 이미지를 읽고 결과를 만듭니다.

---

## 14. 로컬 파일 이미지는 바로 보낼 수 있나요?

외부 웹훅 호출에서는 보통 로컬 파일 경로를 보내면 안 됩니다.

예를 들어 외부 서비스가 아래 경로를 보내도 외부 서비스 입장에서는 이 파일에 접근할 수 없습니다.

```text
/mnt/e/ax/PRJs/GhostHand/.../receipt_01.png
```

하지만 웹훅을 같은 머신에서 테스트하는 경우에는 로컬 파일 경로도 PoC로 사용할 수 있습니다.

예:

```bash
curl -X POST http://localhost:8644/webhooks/expense-receipt \
  -H "Content-Type: application/json" \
  -d '{
    "image_url": "/mnt/e/ax/PRJs/GhostHand/docs/blog/Codex_Chrome_extension/receipt-automation-poc/v2.0/sample/receipt_01_cafe_meeting.png"
  }'
```

단, 실제 서비스처럼 외부에서 호출하려면 다음 중 하나가 필요합니다.

- 이미지를 S3, Cloudflare R2, Supabase Storage 같은 곳에 올리고 URL을 전달
- 별도 API 서버가 이미지를 업로드받아 로컬에 저장
- ngrok/cloudflared 같은 터널로 로컬 서버를 외부에서 접근 가능하게 만들기

---

## 15. 웹훅 보안: 아무나 호출하면 안 됩니다

웹훅 주소가 공개되면 아무나 요청을 보낼 수 있습니다.

그래서 보안이 중요합니다.

Hermes Webhook은 HMAC secret을 지원합니다.

쉽게 말하면:

> 웹훅 요청에 “비밀 도장”을 찍어서 진짜 요청인지 확인하는 방식입니다.

운영에서는 반드시 secret을 설정하고, 외부 서비스가 올바른 signature를 보내도록 해야 합니다.

---

## 16. HMAC 서명은 어떻게 만들까요?

HMAC 서명은 payload와 secret을 이용해 만듭니다.

예시 Python 코드:

```python
import hmac
import hashlib

secret = b"your-webhook-secret"
payload = b'{"image_url":"https://example.com/receipt.png"}'

signature = hmac.new(secret, payload, hashlib.sha256).hexdigest()
print("sha256=" + signature)
```

그 다음 HTTP 요청 헤더에 넣습니다.

```bash
curl -X POST http://localhost:8644/webhooks/expense-receipt \
  -H "Content-Type: application/json" \
  -H "X-Hub-Signature-256: sha256=여기에_서명값" \
  -d '{"image_url":"https://example.com/receipt.png"}'
```

정확한 헤더 방식은 사용하는 서비스에 따라 다를 수 있습니다.

- GitHub: `X-Hub-Signature-256`
- GitLab: `X-Gitlab-Token`
- 일반 커스텀 클라이언트: Hermes 설정에 맞춰 구현

---

## 17. 결과 예시

웹훅이 정상 동작하면 Hermes Agent가 이런 결과를 만들 수 있습니다.

```json
{
  "merchant": "스타벅스 강남역점",
  "items": [
    "카페 아메리카노 Tall 2개",
    "치즈 베이글 1개"
  ],
  "amount": "13,500원",
  "recommended_account": "회의비",
  "reason": "커피와 간단한 다과 구매 내역이므로 회의나 업무 미팅 때 사용한 비용으로 볼 수 있습니다."
}
```

---

## 18. 중요한 제한: 기본 Hermes Webhook은 이미지 파일 업로드보다 JSON에 적합

Hermes 기본 Webhook Subscription은 보통 JSON payload를 받는 데 적합합니다.

즉, 가장 쉬운 방식은 다음처럼 이미지 URL을 보내는 것입니다.

```json
{
  "image_url": "https://example.com/receipt.png"
}
```

반대로 이런 방식은 기본 Subscription만으로는 바로 다루기 어렵습니다.

```text
multipart/form-data로 receipt.png 파일 자체 업로드
```

파일 자체를 업로드받고 싶다면 아래 PART B 방식이 더 적합합니다.

---

# PART B. 전용 API 서버로 만들기

## 19. 왜 전용 API 서버가 필요할까요?

실제 서비스에서는 사용자가 영수증 이미지를 브라우저에서 직접 업로드할 가능성이 높습니다.

그때는 이런 요청을 받게 됩니다.

```text
POST /expense/receipt-recommendation
Content-Type: multipart/form-data
file=@receipt.png
```

이런 파일 업로드 API는 FastAPI 같은 서버로 직접 만드는 편이 좋습니다.

---

## 20. 전용 API 서버 구조

```text
사용자 브라우저
   ↓
FastAPI 서버
   ↓
이미지를 /tmp/receipts/ 에 저장
   ↓
Hermes vision_analyze 또는 Hermes Agent 호출
   ↓
추천 계정 JSON 반환
```

---

## 21. FastAPI 서버 예시 코드

아래는 개념 예시입니다.

파일명 예:

```text
server.py
```

```python
from fastapi import FastAPI, UploadFile, File
from pathlib import Path
import shutil
import subprocess
import json
import uuid

app = FastAPI()

UPLOAD_DIR = Path("/tmp/receipt-webhook")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ACCOUNT_LIST = [
    "회의비",
    "국내교통비",
    "해외교통비",
    "접대비",
    "판촉비",
    "소모품비",
    "통신비",
    "교육훈련비",
    "출장숙박비",
    "소프트웨어구독료",
]

@app.post("/expense/receipt-recommendation")
async def recommend_account(file: UploadFile = File(...)):
    # 1. 업로드된 이미지를 임시 폴더에 저장
    suffix = Path(file.filename).suffix or ".png"
    image_path = UPLOAD_DIR / f"{uuid.uuid4()}{suffix}"

    with image_path.open("wb") as f:
        shutil.copyfileobj(file.file, f)

    # 2. Hermes Agent에게 시킬 질문 만들기
    prompt = f"""
다음 영수증 이미지 파일을 vision_analyze 도구로 분석해줘.

이미지 경로:
{image_path}

추천 계정은 반드시 아래 목록 중 하나만 사용해:
{', '.join(ACCOUNT_LIST)}

출력은 JSON만 작성해:
{{
  "merchant": "가맹점명",
  "items": ["품목1", "품목2"],
  "amount": "총 결제금액",
  "recommended_account": "추천 계정",
  "reason": "추천 사유"
}}
"""

    # 3. Hermes CLI를 호출해서 결과 받기
    result = subprocess.run(
        ["hermes", "chat", "-q", prompt, "--toolsets", "vision,file"],
        capture_output=True,
        text=True,
        timeout=180,
    )

    # 4. 결과 반환
    return {
        "success": result.returncode == 0,
        "image_path": str(image_path),
        "raw_result": result.stdout,
        "error": result.stderr,
    }
```

설치:

```bash
pip install fastapi uvicorn python-multipart
```

실행:

```bash
uvicorn server:app --host 0.0.0.0 --port 9000
```

테스트:

```bash
curl -X POST http://localhost:9000/expense/receipt-recommendation \
  -F "file=@/mnt/e/ax/PRJs/GhostHand/docs/blog/Codex_Chrome_extension/receipt-automation-poc/v2.0/sample/receipt_01_cafe_meeting.png"
```

---

## 22. 전용 API 서버 방식의 장점

- 이미지 파일을 직접 업로드받을 수 있습니다.
- 외부 이미지 URL이 없어도 됩니다.
- 프론트엔드에서 바로 사용하기 쉽습니다.
- 응답을 JSON API 형태로 만들기 쉽습니다.
- 나중에 DB 저장, 사용자 인증, ERP 연동을 붙이기 쉽습니다.

## 23. 전용 API 서버 방식의 단점

- 서버 코드를 직접 관리해야 합니다.
- 보안 처리를 직접 더 신경 써야 합니다.
- Hermes 기본 웹훅보다 구현량이 많습니다.

---

# PART C. 추천 계정 기준 연결하기

## 24. 추천 계정은 `계정_샘플.md` 기준으로 제한하기

경비정산 PoC에서 가장 중요한 점은 AI가 마음대로 계정을 만들지 않게 하는 것입니다.

예를 들어 영수증에 `복리후생비` 힌트가 있어도, `계정_샘플.md`에 없다면 쓰면 안 됩니다.

현재 샘플 계정은 다음 10개입니다.

```text
회의비
국내교통비
해외교통비
접대비
판촉비
소모품비
통신비
교육훈련비
출장숙박비
소프트웨어구독료
```

프롬프트에는 꼭 이렇게 써야 합니다.

```text
추천 계정은 반드시 아래 목록 중 하나만 사용해.
목록에 없는 계정은 만들지 마.
```

---

## 25. 좋은 프롬프트 예시

```text
다음 영수증 이미지를 vision_analyze로 분석해줘.

이미지:
{image_url}

추천 계정은 반드시 아래 목록 중 하나만 사용해:
- 회의비
- 국내교통비
- 해외교통비
- 접대비
- 판촉비
- 소모품비
- 통신비
- 교육훈련비
- 출장숙박비
- 소프트웨어구독료

목록에 없는 계정은 절대 만들지 마.

결과는 JSON으로만 작성해:
{
  "merchant": "",
  "items": [],
  "amount": "",
  "recommended_account": "",
  "reason": ""
}
```

---

## 26. 애매한 영수증 처리 규칙

일부 영수증은 원래 계정과 샘플 계정이 정확히 맞지 않을 수 있습니다.

예:

```text
야근 식대 → 복리후생비가 자연스럽지만 샘플 계정에 없음
```

이럴 때는 가장 가까운 계정으로 매핑합니다.

예:

```text
야근 식대 → 회의비
```

사유에는 이렇게 적습니다.

```text
계정_샘플.md에 복리후생비가 없으므로, 내부 업무 모임 또는 야근 식사 성격에 가까운 회의비로 제안합니다.
```

또 다른 예:

```text
키보드, 마우스, USB-C 허브 → 비품구매가 자연스럽지만 샘플 계정에 없음
```

샘플 계정 중에서는 이렇게 매핑할 수 있습니다.

```text
업무용 주변기기 → 소모품비
```

---

# PART D. 실제 운영할 때 체크리스트

## 27. 웹훅을 외부에서 호출하려면?

로컬에서만 테스트할 때는 이 주소를 씁니다.

```text
http://localhost:8644/webhooks/expense-receipt
```

하지만 외부 서비스는 내 컴퓨터의 `localhost`에 접근할 수 없습니다.

외부에서 호출하려면 다음 중 하나가 필요합니다.

### 방법 1. 서버에 배포

예:

```text
https://my-company.com/webhooks/expense-receipt
```

### 방법 2. 터널 사용

개발 중에는 ngrok 또는 cloudflared를 사용할 수 있습니다.

예:

```bash
ngrok http 8644
```

또는:

```bash
cloudflared tunnel --url http://localhost:8644
```

그러면 외부 접근 가능한 URL이 생깁니다.

---

## 28. 운영 전 체크리스트

- [ ] Hermes Gateway가 실행 중인가?
- [ ] Webhook 플랫폼이 enabled 상태인가?
- [ ] `/health`가 정상 응답하는가?
- [ ] `expense-receipt` subscription이 만들어졌는가?
- [ ] 웹훅 secret이 충분히 강한가?
- [ ] 외부에서 접근 가능한 URL인가?
- [ ] 이미지 URL이 Hermes 서버에서 접근 가능한가?
- [ ] `vision_analyze` 도구가 활성화되어 있는가?
- [ ] 추천 계정을 `계정_샘플.md` 목록으로 제한했는가?
- [ ] 결과를 JSON으로 고정했는가?
- [ ] 실패 시 로그를 확인할 수 있는가?

---

## 29. 문제 해결 방법

### 문제 1. `Webhook platform is not enabled`가 나와요

웹훅 기능이 꺼져 있는 상태입니다.

해결:

```bash
hermes gateway setup
```

또는 `~/.hermes/config.yaml`에 웹훅 설정을 추가합니다.

---

### 문제 2. `curl http://localhost:8644/health`가 안 돼요

Gateway가 안 켜졌거나 포트가 다를 수 있습니다.

확인:

```bash
ps aux | grep hermes
```

로그:

```bash
grep webhook ~/.hermes/logs/gateway.log | tail -20
```

---

### 문제 3. 이미지 분석이 안 돼요

가능한 원인:

- 이미지 URL이 잘못됨
- 이미지 URL이 외부에서 접근 불가
- 파일이 실제 이미지가 아님
- 이미지가 너무 큼
- `vision_analyze` 도구가 비활성화됨
- 비전 모델 설정이 잘못됨

확인:

```bash
hermes tools list
```

비전 모델 설정 확인:

```bash
hermes config | grep -A5 vision
```

---

### 문제 4. 추천 계정이 목록에 없는 값으로 나와요

프롬프트가 약한 경우입니다.

해결:

프롬프트에 아래 문장을 더 강하게 넣습니다.

```text
추천 계정은 반드시 아래 목록 중 하나만 사용해.
목록에 없는 계정은 절대 만들지 마.
recommended_account 값은 목록의 문자열과 정확히 같아야 해.
```

---

### 문제 5. JSON이 깨져서 나와요

AI가 설명문을 섞어서 출력했을 가능성이 있습니다.

해결:

프롬프트에 아래 문장을 넣습니다.

```text
출력은 JSON 객체 하나만 작성해.
JSON 앞뒤에 설명 문장을 쓰지 마.
Markdown 코드블록도 쓰지 마.
```

---

## 30. 추천 개발 순서

처음부터 완벽한 서비스를 만들려고 하지 말고, 아래 순서로 진행하는 것을 추천합니다.

### 1단계. 로컬 이미지로 `vision_analyze` 테스트

이미 `계정 제안.md`를 만들 때 이 단계는 검증되었습니다.

### 2단계. Hermes Webhook 켜기

```bash
hermes gateway setup
hermes gateway run
curl http://localhost:8644/health
```

### 3단계. JSON 기반 웹훅 만들기

```json
{
  "image_url": "https://example.com/receipt.png"
}
```

### 4단계. 결과를 Telegram 또는 log로 받기

처음에는 `--deliver log`가 쉽습니다.

### 5단계. 외부 접근 URL 붙이기

ngrok 또는 cloudflared를 사용합니다.

### 6단계. 파일 업로드 API가 필요하면 FastAPI로 확장

이미지 URL 방식이 부족할 때 전용 API 서버를 만듭니다.

---

## 31. 최종 결론

Hermes Agent로 경비정산 웹훅을 구현할 수 있습니다.

가장 쉬운 시작 방법은 다음입니다.

```text
이미지 URL JSON 요청
   ↓
Hermes Webhook Subscription
   ↓
Hermes Agent
   ↓
vision_analyze
   ↓
추천 계정 JSON 결과
```

처음 PoC에서는 이 방식이 가장 빠릅니다.

나중에 사용자가 브라우저에서 영수증 이미지를 직접 업로드해야 한다면 FastAPI 같은 전용 API 서버를 추가하면 됩니다.

정리하면:

- 빠른 PoC: Hermes 기본 Webhook Subscription
- 실제 API 서비스: FastAPI + Hermes vision 호출
- 계정 추천 기준: 반드시 `계정_샘플.md` 목록으로 제한
- 보안: 운영에서는 HMAC secret 필수
- 외부 호출: 서버 배포 또는 ngrok/cloudflared 터널 필요
