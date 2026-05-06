# 3-10. PoC7. 브라우징 자동화 (N-ERP - myFinance)

## Hands-on Demo 목표

이번 핸즈온 데모에서는 N-ERP myFinance 경비처리 자동화 워크플로를 먼저 만들고, 이를 Codex 스킬로 패키징한 뒤, 다른 사람에게 zip으로 배포하고, 공유받은 사람이 `.env`를 설정해서 실제 영수증 PDF 경비처리에 사용하는 전체 흐름을 따라 합니다.

전체 흐름은 아래 4단계입니다.

1. 자동화 워크플로 만들기
2. 스킬로 만들기
3. 배포하기
4. 배포 받은 스킬 사용하기

## 시나리오

N-ERP → myFinance → 신용카드 경비처리 흐름을 브라우저 자동화로 처리한다고 가정합니다.

사용자는 영수증 PDF, 카드 승인일자, 카드 끝자리, 조회구분을 프롬프트로 입력합니다. Codex는 공유받은 myFinance 경비처리 스킬을 사용해서 N-ERP myFinance에 접속하고, 신용카드 경비 내역을 선택한 뒤, 영수증을 첨부하고 상신합니다.

## 자동화 대상 업무

### 설정

`.env` 파일에 사용자별 로그인 정보와 기본값을 설정합니다.

```env
MYFINANCE_ADFS_USER=your.ad.id
MYFINANCE_ADFS_PASSWORD=your-password
MYFINANCE_CARD_SUFFIX=1891
MYFINANCE_JOB=FCA
MYFINANCE_OPINION=AI 구독료 정산
CHROME_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe
```

주의: `.env`에는 개인 로그인 정보가 들어가므로 zip 배포 파일에 포함하지 않습니다. 대신 `.env.example`만 포함하고, 공유받은 사람이 직접 `.env`를 만듭니다.

### 입력

사용자가 Codex에 아래 정보를 입력합니다.

- 영수증 PDF 경로
- 카드 승인일자 또는 결제일
- 조회구분
- 카드 끝자리

예시:

```text
$PoC3 myFinance Expense Submit 사용해서 C:\Users\user\Downloads\Receipt-2714-6769.pdf 영수증을 myFinance 경비처리해줘.
결제일은 2026-04-25, 조회구분은 해외 사용분, 카드 끝자리는 1891이야.
```

## 1. 자동화 워크플로 만들기

이 부분은 실제 브라우저 자동화 워크플로를 만드는 핵심 프롬프트입니다. 아래 예시를 그대로 복사해서 Codex에 붙여 넣으면, N-ERP myFinance 경비처리 자동화 흐름을 설계하거나 구현하도록 요청할 수 있습니다.

```text
브라우저 자동화 스크립트를 만들어줘.

시나리오:
- N-ERP myFinance에 접속해서 신용카드 경비를 처리한다.
- N-ERP 접속 URL은 https://nerps-mf.sec.samsung.net/ 이다.
- .env에 저장된 MYFINANCE_ADFS_USER / MYFINANCE_ADFS_PASSWORD로 AD SSO 로그인한다.
- 사용자가 입력한 영수증 PDF 파일을 처리 대상으로 사용한다.
- 사용자가 카드 승인일자/결제일을 직접 입력하면 그 날짜를 우선 사용한다.
- 사용자가 날짜를 입력하지 않으면 영수증 PDF에서 Date paid 또는 지급 일자를 파싱한다.

입력:
- 영수증 PDF 경로
- 카드 승인일자 또는 결제일
- 조회구분
- 카드 끝자리
- 직무
- 상신 의견

예시 입력:
- 영수증 PDF: C:\Users\user\Downloads\Receipt-2714-6769.pdf
- 카드 승인일자: 2026-04-25
- 조회구분: 해외 사용분
- 카드 끝자리: 1891
- 직무: FCA
- 상신 의견: AI 구독료 정산

처리 순서:
1. .env 파일을 읽어서 MYFINANCE_ADFS_USER / MYFINANCE_ADFS_PASSWORD / MYFINANCE_CARD_SUFFIX / MYFINANCE_JOB / MYFINANCE_OPINION / CHROME_PATH 값을 로드한다.
2. 브라우저를 실행하고 N-ERP myFinance에 접속한다.
3. AD SSO 로그인 화면이 나오면 .env의 계정으로 로그인한다.
4. myFinance Home 화면으로 이동한다.
5. 왼쪽 메뉴에서 신용카드 경비 화면으로 진입한다.
6. Activities 목록에서 지급수수료-기타를 선택한다.
7. 상단 신청 일자를 오늘 날짜로 설정한다.
8. 신용카드 번호에서 카드 끝자리가 1891인 삼성카드를 선택한다.
9. 카드 승인 일자에 사용자가 입력한 날짜를 입력한다.
10. 조회구분은 해외 사용분으로 선택한다.
11. 카드 승인 내역 팝업을 열고, 카드 승인일자가 입력 날짜와 정확히 일치하는 승인 내역 1건만 선택한다.
12. 신용카드 승인 정보 팝업에서 확인 버튼을 클릭한다.
13. 직무를 FCA로 선택한다.
14. 저장 버튼을 클릭하고 저장 완료 메시지를 확인한다.
15. 파일 첨부를 열고 영수증 PDF를 첨부한다.
16. 첨부 완료를 확인한다.
17. 상신 버튼을 클릭한다.
18. 의견에 AI 구독료 정산을 입력한다.
19. 확인 버튼을 클릭한다.
20. 정상 상신 메시지와 삼성전표번호를 확인한다.

중요한 안전 조건:
- 카드 승인일자는 입력한 날짜와 정확히 일치해야 한다.
- 입력한 날짜가 2026-04-25이면 2026-04-25 승인 내역만 처리한다.
- 2026-04-17 같은 다른 날짜 승인 내역이 이미 화면에 로드되어 있으면 저장하거나 상신하지 말고 중단한다.
- 이미 화면에 로드된 승인 내역을 성공으로 간주하지 않는다.
- 반드시 카드 승인 내역 팝업에서 현재 조건으로 조회한 결과를 새로 선택한다.
- 저장 직전에도 승인일자가 입력 날짜와 일치하는지 다시 검증한다.
- 상단 신청 일자가 과거 날짜로 들어가면 과거 승인 내역이 자동 로드될 수 있으므로, 승인 조회 전에 신청 일자를 오늘 날짜로 설정한다.

예외 처리:
- 로그인 실패 시 어떤 필드에서 실패했는지 알려준다.
- 승인 내역이 없으면 저장하지 않고 중단한다.
- 승인 내역이 여러 건이면 날짜, 카드 끝자리, 금액, 승인번호를 기준으로 사용자가 확인할 수 있게 출력한다.
- 파일 첨부 실패 시 상신하지 않고 중단한다.
- 상신 성공 메시지를 감지하면 삼성전표번호를 출력한다.

출력:
- 처리한 영수증 파일명
- 신청 일자
- 카드 승인일자
- 카드 끝자리
- 승인번호
- 금액
- 첨부 여부
- 상신 성공 여부
- 삼성전표번호

조건:
- Playwright 기반 브라우저 자동화로 작성한다.
- 초보자도 이해할 수 있게 주요 단계에는 주석을 추가한다.
- 계정/비밀번호는 코드에 직접 쓰지 말고 .env에서 읽는다.
- .env.example 파일도 함께 만들어준다.
- README.md에 설치 방법, .env 설정 방법, 실행 명령, Codex에서 사용할 예시 프롬프트를 포함한다.
```

간단 버전으로 요청하고 싶으면 아래 프롬프트를 사용합니다.

```text
현재 작업 폴더의 영수증 PDF를 읽어서 날짜를 파싱하고, 그 날짜를 기준으로 N-ERP myFinance에서 신용카드 경비를 상신하는 브라우저 자동화 흐름을 설계해줘.

조건:
- 입력, 처리, 출력 기준으로 정리해줘.
- .env의 MYFINANCE_ADFS_USER / MYFINANCE_ADFS_PASSWORD로 로그인하게 해줘.
- 신용카드 경비 > 지급수수료-기타를 선택하게 해줘.
- 카드 끝자리는 1891인 삼성카드를 선택하게 해줘.
- 조회구분은 해외 사용분으로 선택하게 해줘.
- 상단 신청 일자는 오늘 날짜로 설정하게 해줘.
- 카드 승인일자는 사용자가 입력한 날짜와 정확히 일치하는 건만 처리하게 해줘.
- 다른 날짜 승인 내역이 이미 로드되어 있으면 저장하지 말고 중단하게 해줘.
- 저장 후 영수증 PDF 파일 첨부와 상신까지 포함해줘.
- 설정값은 .env로 분리하고, 실행 방법과 주의사항은 README로 정리해줘.
```

### 중요한 예외 처리

myFinance 화면은 이전 신청일자나 임시 저장 데이터 때문에 과거 승인 내역이 자동으로 로드될 수 있습니다. 예를 들어 상단 신청 일자가 `2026.04.29`로 들어가면 `2026.04.17` 승인 내역이 자동 로드되는 문제가 있었습니다.

따라서 스킬에는 아래 안전 로직을 넣습니다.

- 상단 신청 일자를 오늘 날짜로 먼저 설정합니다.
- 사용자가 입력한 승인일자와 다른 승인 내역이 이미 로드되어 있으면 중단합니다.
- 이미 화면에 로드된 승인 내역을 성공으로 간주하지 않습니다.
- 카드 승인 팝업에서 새로 선택한 정확한 1건만 허용합니다.
- 저장 직전에도 승인일자가 정확한지 다시 확인합니다.

## 2. 스킬로 만들기

먼저 현재 자동화 워크플로를 재사용 가능한 Codex 스킬로 만듭니다.

### 예시 프롬프트

아래 프롬프트를 Codex에 그대로 붙여 넣습니다.

```text
myFinance 경비 처리 워크플로를 다른 사람에게 배포할 수 있게 Codex 스킬로 만들어줘.

요구사항:
- 스킬 이름은 poc3-myfinance-expense-submit 으로 만들어줘.
- N-ERP myFinance 신용카드 경비처리 브라우저 자동화를 실행할 수 있어야 해.
- 영수증 PDF 경로, 결제일/카드 승인일자, 조회구분, 카드 끝자리를 입력으로 받을 수 있게 해줘.
- .env.example 파일에 사용자 로그인 정보와 기본 설정 항목을 넣어줘.
- 실제 .env 파일은 배포본에 포함하지 말아줘.
- README.md 또는 SKILL.md에 설치 방법, .env 설정 방법, 실행 방법, 실사용 프롬프트 예시를 자세히 적어줘.
- node, Playwright 등 필요한 의존성이 있으면 scripts/package.json에 정리해줘.
- 승인일자는 입력한 날짜와 정확히 일치하는 건만 처리하게 해줘.
- 상단 신청 일자는 오늘 날짜로 설정하게 해줘.
- 다른 날짜 승인 내역이 이미 로드되어 있으면 저장/상신하지 말고 중단하게 해줘.
```

### 스킬에 포함할 파일 예시

```text
poc3-myfinance-expense-submit/
  SKILL.md
  README.md
  agents/
    openai.yaml
  references/
    workflow.md
  scripts/
    automate-myfinance.js
    run-myfinance-expense.ps1
    package.json
    package-lock.json
    .env.example
```

### `.env.example` 예시

```env
MYFINANCE_ADFS_USER=
MYFINANCE_ADFS_PASSWORD=
MYFINANCE_CARD_SUFFIX=1891
MYFINANCE_JOB=FCA
MYFINANCE_OPINION=AI 구독료 정산
CHROME_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe
```

## 3. 배포하기

스킬이 동작하는 것을 확인한 뒤, 다른 사람이 받을 수 있는 zip 파일로 묶습니다.

### 배포 zip에 포함할 것

- `SKILL.md`
- `README.md`
- `references/workflow.md`
- 실행 스크립트
- `package.json`, `package-lock.json`
- `node_modules`
- 필요하면 `runtime/node.exe`
- `.env.example`

### 배포 zip에서 제외할 것

- `.env`
- 로그인 정보
- 브라우저 프로필
- 실행 스크린샷
- 영수증 PDF
- 로그 파일
- 임시 저장 데이터

### 예시 프롬프트

```text
방금 만든 poc3-myfinance-expense-submit 스킬을 배포할 수 있게 zip 파일로 만들어줘.

조건:
- node 등 실행에 필요한 의존성 파일도 포함해줘.
- node_modules를 포함해줘.
- 가능하면 runtime/node.exe도 포함해줘.
- .env는 절대 포함하지 말고 .env.example만 포함해줘.
- 브라우저 프로필, 스크린샷, 로그, 영수증 PDF 같은 개인/실행 데이터는 제외해줘.
- README.md에 설치 방법, .env 설정 방법, 실행 명령, Codex에서 사용할 예시 프롬프트를 넣어줘.
- zip 생성 후 포함/제외 항목을 검증해줘.
```

### 배포 결과 예시

```text
poc3-myfinance-expense-submit-skill-with-deps.zip
```

zip 파일 안에는 아래처럼 들어갑니다.

```text
poc3-myfinance-expense-submit/
  SKILL.md
  README-DISTRIBUTION.md
  agents/
  references/
  runtime/
    node.exe
  scripts/
    automate-myfinance.js
    run-myfinance-expense.ps1
    run-myfinance-expense-bundled.ps1
    package.json
    package-lock.json
    .env.example
    node_modules/
```

## 4. 배포 받은 스킬 사용하기

공유받은 사람은 zip 파일을 받아서 Codex 스킬 폴더에 압축을 풉니다.

### 설치 위치

Windows 기준:

```powershell
$HOME\.codex\skills\poc3-myfinance-expense-submit
```

예시:

```powershell
Expand-Archive `
  -LiteralPath "C:\Users\user\Downloads\poc3-myfinance-expense-submit-skill-with-deps.zip" `
  -DestinationPath "$HOME\.codex\skills" `
  -Force
```

### `.env` 설정

압축을 푼 뒤 `.env.example`을 복사해서 `.env`를 만듭니다.

```powershell
Copy-Item `
  "$HOME\.codex\skills\poc3-myfinance-expense-submit\scripts\.env.example" `
  "$HOME\.codex\skills\poc3-myfinance-expense-submit\scripts\.env"

notepad "$HOME\.codex\skills\poc3-myfinance-expense-submit\scripts\.env"
```

`.env`에 본인 정보를 입력합니다.

```env
MYFINANCE_ADFS_USER=your.ad.id
MYFINANCE_ADFS_PASSWORD=your-password
MYFINANCE_CARD_SUFFIX=1891
MYFINANCE_JOB=FCA
MYFINANCE_OPINION=AI 구독료 정산
CHROME_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe
```

## 5. 실사용 프롬프트 예시

### 기본 실행

```text
$PoC3 myFinance Expense Submit 사용해서 C:\Users\user\Downloads\Receipt-2714-6769.pdf 영수증을 myFinance 경비처리해줘.
결제일은 2026-04-25, 조회구분은 해외 사용분, 카드 끝자리는 1891이야.
```

### 승인일자를 명확히 지정

```text
$poc3-myfinance-expense-submit 사용해서 C:\Users\user\Downloads\Receipt-2714-6769.pdf 영수증을 myFinance 경비처리해줘.
카드 승인 일자는 2026-04-25이고, 조회 구분은 해외 사용분이야.
카드는 끝자리 1891인 삼성카드를 사용해줘.
```

### 상신 전 검증을 요청

```text
$PoC3 myFinance Expense Submit 사용해서 C:\Users\user\Downloads\Receipt-2714-6769.pdf 영수증을 처리할 준비가 됐는지 먼저 확인해줘.
결제일은 2026-04-25, 조회구분은 해외 사용분, 카드 끝자리는 1891이야.
상신은 아직 하지 말고 dry-run으로 영수증 파싱과 설정만 확인해줘.
```

### 특정 조건을 강조

```text
$PoC3 myFinance Expense Submit 사용해서 C:\Users\user\Downloads\Receipt-2714-6769.pdf 영수증을 myFinance 경비처리해줘.
결제일은 2026-04-25이고, 2026-04-25 승인 내역만 처리해야 해.
화면에 다른 날짜 승인 내역이 이미 로드되어 있으면 저장하지 말고 중단해줘.
조회구분은 해외 사용분, 카드 끝자리는 1891이야.
```

### 상신 취소 후 다시 처리

```text
방금 상신 취소했어. 다시 해보자.

$PoC3 myFinance Expense Submit 사용해서 C:\Users\user\Downloads\Receipt-2714-6769.pdf 영수증을 myFinance 경비처리해줘.
결제일은 2026-04-25, 조회구분은 해외 사용분, 카드 끝자리는 1891이야.
```

## 6. 직접 실행 명령 예시

Codex 프롬프트 대신 PowerShell에서 직접 실행할 수도 있습니다.

### 일반 실행

```powershell
powershell -ExecutionPolicy Bypass `
  -File "$HOME\.codex\skills\poc3-myfinance-expense-submit\scripts\run-myfinance-expense.ps1" `
  -Receipt "C:\Users\user\Downloads\Receipt-2714-6769.pdf" `
  -PaidDate "2026-04-25" `
  -CardSuffix "1891"
```

### 번들 Node 사용

배포 zip에 `runtime/node.exe`가 포함되어 있으면 아래 스크립트를 사용할 수 있습니다.

```powershell
powershell -ExecutionPolicy Bypass `
  -File "$HOME\.codex\skills\poc3-myfinance-expense-submit\scripts\run-myfinance-expense-bundled.ps1" `
  -Receipt "C:\Users\user\Downloads\Receipt-2714-6769.pdf" `
  -PaidDate "2026-04-25" `
  -CardSuffix "1891"
```

### Dry-run

상신하지 않고 영수증 파싱과 기본 설정만 확인합니다.

```powershell
powershell -ExecutionPolicy Bypass `
  -File "$HOME\.codex\skills\poc3-myfinance-expense-submit\scripts\run-myfinance-expense-bundled.ps1" `
  -DryRun `
  -Receipt "C:\Users\user\Downloads\Receipt-2714-6769.pdf" `
  -PaidDate "2026-04-25" `
  -CardSuffix "1891"
```

## 7. 결과 확인

정상 처리되면 Codex 또는 터미널 로그에서 아래 정보를 확인합니다.

```text
SUBMIT_SUCCESS 정상 상신되었습니다.
SUBMIT_DOCUMENT_NO DR0120260430BA001260
```

확인할 항목:

- 삼성전표번호
- 신청 일자
- 카드 승인일자
- 승인번호
- 카드 끝자리
- 첨부 파일명
- 상신 성공 메시지

## 8. 초보자를 위한 체크리스트

- zip 압축을 `$HOME\.codex\skills` 아래에 풀었는가?
- 스킬 폴더명이 `poc3-myfinance-expense-submit`인가?
- `.env.example`을 복사해서 `.env`를 만들었는가?
- `.env`에 AD 계정과 비밀번호를 입력했는가?
- `CHROME_PATH`가 실제 Chrome 경로와 맞는가?
- 영수증 PDF 경로가 정확한가?
- 카드 승인일자를 `YYYY-MM-DD` 형식으로 입력했는가?
- 조회구분이 `해외 사용분`인지 확인했는가?
- 카드 끝자리가 실제 카드와 일치하는가?

## 9. 데모 진행 순서

핸즈온에서는 아래 순서대로 진행하면 됩니다.

1. myFinance 자동화 시나리오 설명
2. 자동화 워크플로 생성 프롬프트 실행
3. 생성된 자동화 흐름과 예외 처리 확인
4. 자동화 워크플로를 Codex 스킬로 만드는 프롬프트 실행
5. 생성된 스킬 구조 확인
6. `.env.example` 확인
7. 자동화 스크립트 dry-run 확인
8. 스킬을 zip으로 배포
9. zip 내부에 의존성과 `.env.example`이 있는지 확인
10. `.env`와 개인 실행 데이터가 제외됐는지 확인
11. 공유받은 사용자 관점에서 zip 설치
12. `.env` 설정
13. 예시 프롬프트로 실제 경비처리 실행
14. 상신 성공 메시지와 삼성전표번호 확인

## 10. 데모용 한 줄 요약

이 데모는 "브라우저 자동화 워크플로를 만들고, 이를 Codex 스킬로 패키징하고, 의존성까지 포함해 zip으로 공유한 뒤, 공유받은 사용자가 `.env`만 설정해서 자연어 프롬프트로 N-ERP myFinance 경비처리를 실행하는 과정"입니다.
