# 기본 UT 검증 스킬

## 목적

온디바이스 AI Agent 기반으로 기본 UT 검증을 자동 수행하기 위한 워크플로우를 정리한다.

이 스킬의 목표는 아래 흐름을 자동화하는 것이다.

1. 시험 시나리오 생성
2. 단말 기본 기능 검증 실행
3. 캡처/녹화/로그 저장
4. PASS/FAIL 판정
5. FAIL 항목 1차 로그 분석
6. 담당자 지정
7. GitHub Issues 등록
8. 메신저 결과 통보

---

## 적용 대상

다음과 같은 기본 단말 기능 검증 시나리오에 적용한다.

- 전화 걸기 - 홈으로 이동
- 문자 보내기 - 홈으로 이동
- 크롬 앱 실행 - 네이버 이동 - 수원 날씨 검색 - 홈으로 이동
- 유튜브 앱 실행 - 오픈클로 검색 - 재생 - 홈으로 이동
- 시계 앱 실행 - 07:00 알람 설정 - 알람 해제 - 홈으로 이동

---

## 입력

- 사용자 메시지 기반 시험 실행 요청
- UT 검증 시나리오 파일
- 담당자 매핑 파일 (`담당자.md`)
- 연결된 ADB 단말

---

## 폴더 구조

기본 저장 경로 예시는 아래와 같다.

```text
examples/Demo3/
  UT/
    UT 검증 시나리오.md
    담당자.md
    runs/
      YYYY-MM-DD/
        UT-001_call/
          screen.mp4
          logcat.txt
          meta.json
          result.md
          screenshots/
          issue.md
```

---

## 실행 절차

### 1. 시험 준비
- `UT 검증 시나리오.md` 생성 또는 확인
- `담당자.md` 확인
- 실행 날짜 기준 `runs/YYYY-MM-DD/` 폴더 생성
- ADB 연결 상태 확인

### 2. 로그 초기화
- 시험 시작 전 로그 초기화 또는 시작 시각 기록
- 단말 환경 정보 저장
  - `device-props.txt`
  - `telephony_registry.txt`
  - `airplane_mode.txt`

### 3. TC별 검증 실행
각 테스트 케이스마다 아래 수행:

- 화면 녹화 시작
- `logcat` 저장 시작
- 앱 실행 및 시나리오 수행
- 실행 결과 스크린샷 저장
- 녹화 종료
- 로그 저장 종료
- 홈 화면 복귀

### 4. 결과 저장
TC별로 아래 산출물 저장:

- `screen.mp4`
- `logcat.txt`
- `meta.json`
- `screenshots/*.png`
- `result.md`
- FAIL 시 `issue.md`

### 5. PASS / FAIL 판정
판정 기준:
- 기대 동작이 정상 수행되면 PASS
- 환경 문제, 앱 오류, 자동화 실패, 기능 실패는 FAIL

### 6. FAIL 항목 1차 분석
FAIL일 경우 아래를 수행:
- 로그 기반 1차 분석
- 문제 유형 분류
  - CRASH
  - ANR
  - NETWORK
  - PERMISSION
  - DEVICE_ENV
  - TEST_SCRIPT
  - UNKNOWN
- 담당자 매핑표 기준으로 담당자 지정
- `result.md`에 상세 사유 기록
- `issue.md` 생성

### 7. GitHub Issues 등록
FAIL 항목은 GitHub Issues에 등록한다.

Issue 내용 포함 항목:
- 제목
- 재현 경로
- FAIL 사유
- 1차 로그 분석 결과
- 담당자
- 첨부파일 경로/링크

### 8. 결과 요약 및 알림
- 전체 실행 결과 요약 파일 생성
- PASS / FAIL 개수 집계
- FAIL 등록 여부 포함
- 메신저(예: 텔레그램)로 최종 결과 통보

---

## 1차 로그 분석 기준

### 환경 문제 예시
- `mVoiceRegState=1(OUT_OF_SERVICE)`
- `IsVoiceCallAvailable=false`
- SIM 미삽입 / 통신 불가

### 자동화 문제 예시
- `adb shell input text` 예외
- `selector mismatch`
- `uiautomator timeout`

### 앱/시스템 문제 예시
- `FATAL EXCEPTION`
- `ANR in`
- `Permission Denial`
- `SocketTimeoutException`

---

## 담당자 지정 방식

`담당자.md`의 매핑표를 기준으로 지정한다.

예:
- 전화/문자 통신 불가 → `DEVICE_ENV`
- 입력 자동화 오류 → `TEST_SCRIPT`
- 카메라 관련 오류 → `CAMERA`
- 앱 비정상 종료 → `CRASH`

복합 원인일 경우 주 원인 기준으로 1차 담당자를 지정한다.

---

## 데모 실행 결과 반영 예시

이번 Demo3 기준 실제 결과:
- PASS: 2
- FAIL: 3

FAIL 예시:
- 전화 걸기 실패
  - 원인: `OUT_OF_SERVICE`
  - 분류: `DEVICE_ENV`
- 문자 보내기 실패
  - 원인: 통신 불가 + 입력 자동화 예외
  - 분류: `DEVICE_ENV / TEST_SCRIPT`
- 시계 알람 설정 실패
  - 원인: 자동화 수준 부족
  - 분류: `TEST_SCRIPT`

PASS 예시:
- Chrome 검색
- YouTube 검색/재생

---

## 장점

이 스킬을 적용하면 아래 장점이 있다.

- 시나리오 생성부터 결과 정리까지 흐름 표준화
- 영상/로그/스크린샷 증거 자동 축적
- FAIL 시 1차 로그 분석 자동화
- 담당자 지정 보조 가능
- GitHub Issues 등록 자동화 가능
- 메신저 결과 공유 자동화 가능

---

## 한 줄 정리

기본 UT 검증 스킬은 **단말 기본 기능 검증을 실행하고, 결과를 증거와 함께 정리하며, FAIL 항목을 분석·담당자 지정·이슈 등록·메신저 통보까지 연결하는 자동화 워크플로우**이다.
