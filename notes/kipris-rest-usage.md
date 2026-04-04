# KIPRIS Plus REST Usage for GhostHand

기준 페이지:
https://plus.kipris.or.kr/portal/popup/service/DBII_000000000000001/view.do

---

## 1) Why This Matters for GhostHand

GhostHand의 특허/선행기술 조사 흐름에서는 **KIPRIS Plus REST API**를 이용해
특허·실용 공개·등록공보 데이터를 자동으로 조회할 수 있다.

이 문서는 GhostHand 프로젝트 관점에서 KIPRIS REST API를 활용하는 방법을 정리한 것이다.

활용 목적 예시:
- 선행기술 조사 자동화
- 특허 후보 키워드 검색
- 출원번호/공개번호/등록번호 기반 상세 조회
- 서지정보, 청구항, IPC/CPC, 패밀리 정보 수집
- PDF/전문 데이터 확보
- 내부 리포트 생성용 데이터 정규화

---

## 2) This Service Provides

해당 페이지 기준으로 특허·실용 공개·등록공보 API는 다음 기능군을 제공한다.

### 일반검색
- 단어(폐기예정)
- 번호(폐기예정)

### 항목별검색
- 전체검색
- 자유검색
- 출원번호
- CPC
- 발명의명칭
- 초록
- 청구범위
- IPC

### 서지정보
- 서지상세 / 요약
- IPC / CPC
- 출원인 / 발명자
- 패밀리
- 청구항
- 우선권

### 도면 / 전문
- 공개전문 PDF
- 공고전문 PDF
- 대표도면
- 전문파일정보

### 부가기능
- 변동정보
- IPC 코드 조회
- 속보서비스

즉 GhostHand에서 이 API를 쓰면 단순 검색을 넘어서,
**검색 → 상세확인 → 전문조회 → 리포트화**까지 한 흐름으로 연결할 수 있다.

---

## 3) GhostHand Use Case

GhostHand에서는 KIPRIS REST를 다음 목적에 맞춰 사용할 수 있다.

### A. Prior Art Search
GhostHand 관련 키워드로 선행기술 후보를 찾는다.

예시 키워드:
- 온디바이스 AI 단말 제어
- 동일 단말 자기 제어
- 무선 ADB 기반 단말 제어
- 자연어 기반 안드로이드 제어
- mobile self-control agent
- same-device AI control android

### B. Patent Monitoring
특정 기술 분야 또는 경쟁 기술 영역의 공개/등록 동향을 추적한다.

### C. Structured Research Pipeline
검색 결과를 내부 스키마로 정리하여 GhostHand 문서(`notes/prior-art-review.md` 등)에 반영한다.

---

## 4) REST Call Preparation

### (1) API key
KIPRIS Plus에서 발급받은 API 키를 환경변수로 저장한다.

```env
KIPRIS_API_KEY=발급받은키
```

GhostHand에서는 예를 들어 다음 위치를 사용할 수 있다.

```text
~/PRJs/GhostHand/.env
```

### (2) Call pattern
KIPRIS Plus는 API마다 다음이 다를 수 있다.

- 요청 URL
- 필수 파라미터
- 응답 형식(XML / JSON)
- 검색용 / 상세조회용 구분

따라서 **각 API 상세 화면의 REST 요청 URL과 파라미터 문서를 기준**으로 호출해야 한다.

---

## 5) Recommended Workflow for GhostHand

GhostHand에서 권장하는 실무 흐름은 다음과 같다.

1. **검색 API**로 후보 문헌 목록 확보
   - 자유검색 / 발명의명칭 / 출원번호 검색 등
2. 결과에서 식별자 추출
   - 출원번호
   - 공개번호
   - 등록번호
3. **서지정보 API**로 상세 데이터 확장
4. 필요 시 **PDF / 전문 API**로 원문 확보
5. 내부 리포트용 형식으로 정규화
6. `notes/prior-art-review.md` 또는 별도 문서에 요약 반영

이 방식이면 GhostHand의 특허 검토 흐름을 점차 자동화할 수 있다.

---

## 6) Python Request Template

아래는 GhostHand에서 사용할 수 있는 공통 호출 패턴 예시다.
실제 `base_url`, 파라미터명은 선택한 API 상세 문서 값으로 교체해야 한다.

```python
import os
import requests
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("KIPRIS_API_KEY")

base_url = "<각 API 상세의 REST URL>"
params = {
    "serviceKey": API_KEY,
    # "pageNo": 1,
    # "numOfRows": 10,
    # "q": "GhostHand",
    # "applicationNumber": "...",
    # "_type": "json",
}

resp = requests.get(base_url, params=params, timeout=30)
resp.raise_for_status()
print(resp.text[:1000])
```

---

## 7) Common Issues / Warnings

### 1. API key encoding issue
인코딩/디코딩 키를 혼용하면 인증 오류가 날 수 있다.

### 2. Monthly request limit
무료 플랜 기준 호출량 제한이 있을 수 있으므로 조사 시 요청량을 관리해야 한다.

### 3. Deprecated APIs
“단어/번호(폐기예정)” 대신 가능한 경우 **항목별검색 API**를 우선 사용한다.

### 4. XML vs JSON confusion
응답 형식은 API마다 다를 수 있으므로 상세 문서를 반드시 확인한다.

### 5. Schema normalization needed
GhostHand 내부 문서에 쓰기 위해서는 응답을 그대로 쓰기보다,
내부 필드 체계로 정리하는 것이 좋다.

---

## 8) Quick Start Checklist

- [ ] `KIPRIS_API_KEY`를 `.env`에 저장
- [ ] KIPRIS Plus 상세 화면에서 사용할 API 하나 선택
- [ ] REST URL과 필수 파라미터 복사
- [ ] Python 또는 Postman으로 1건 테스트
- [ ] 응답 구조 확인
- [ ] GhostHand용 정규화 스키마 설계
- [ ] `notes/prior-art-review.md`에 조사 결과 반영

---

## 9) Suggested GhostHand File Layout

GhostHand 프로젝트 안에서는 아래 구성을 권장한다.

```text
GhostHand/
├── notes/
│   ├── kipris-rest-usage.md
│   ├── prior-art-review.md
│   ├── prior-art-keywords.md
│   ├── prior-art-references.md
│   ├── patent-notes.md
│   └── invention-summary.md
├── scripts/
│   └── research/
│       └── kipris/
│           ├── test_kipris.py
│           └── samples/
└── .env
```

---

## 10) Example: getAdvancedSearch

예시 오퍼레이션:
- Operation: `getAdvancedSearch`
- URL: `http://plus.kipris.or.kr/kipo-api/kipi/patUtiModInfoSearchSevice/getAdvancedSearch`

GhostHand에서는 이 오퍼레이션을 선행기술 후보 검색의 시작점으로 사용할 수 있다.

예시 검색 대상:
- 발명의명칭에 특정 키워드 포함
- 초록에 특정 개념 포함
- 정렬 조건 지정
- 샘플 응답 저장

### Example execution idea

```bash
python test_kipris.py --invention-title 센서 --astrt-cont 발명 --rows 20 --save
```

또는:

```bash
python test_kipris.py --invention-title 센서 --astrt-cont 발명 --sort-spec PD --desc-sort true --save
```

응답은 기본적으로 XML일 수 있으며,
GhostHand에서는 이를 `samples/` 아래 저장한 뒤 후속 정규화 단계로 넘길 수 있다.

---

## 11) How GhostHand Should Use This Going Forward

GhostHand에서는 KIPRIS REST를 단순 호출 문서로만 두지 않고,
아래 흐름의 일부로 활용하는 것이 좋다.

1. 키워드 세트 정의
2. KIPRIS 검색 API 호출
3. 결과 식별자 수집
4. 상세 API 호출
5. PDF/전문 확보
6. 조사 결과 요약
7. 특허성 검토 문서와 연결

즉 이 문서는 GhostHand의 **특허/선행기술 조사 자동화 워크플로**의 출발점이다.

---

## 12) Next Step

다음으로 만들면 좋은 문서/도구:

- `notes/prior-art-review.md`
- `notes/prior-art-keywords.md`
- `notes/prior-art-references.md`
- `scripts/research/kipris/test_kipris.py`
- `scripts/research/kipris/samples/`

이렇게 하면 GhostHand 안에서 선행기술 조사 체계가 점점 갖춰진다.
