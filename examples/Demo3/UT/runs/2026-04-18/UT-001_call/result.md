# UT-001 전화 걸기 - 홈으로 이동 결과

- 결과: **FAIL**
- 담당자: 홍길동
- 문제 유형: DEVICE_ENV

## 실행 요약
- 전화 앱 실행 및 발신 시도 자동화를 수행함
- 산출물 저장 완료
  - `screen.mp4`
  - `logcat.txt`
  - `screenshots/UT-001_call.png`

## FAIL 사유
- 단말의 전화 서비스 상태가 정상 등록 상태가 아니어서 발신 성공 조건을 만족하지 못함
- 시험 환경상 통화 가능 상태가 아니므로 기본 FAIL 케이스로 분류함

## 1차 로그 분석 결과
- `telephony_registry.txt` 기준
  - `mVoiceRegState=1(OUT_OF_SERVICE)`
  - `IsVoiceCallAvailable=false`
  - `registrationState=NOT_REG_SEARCHING`
- 해석
  - 음성 통화 서비스가 등록되지 않은 상태이며, 시험 환경 또는 SIM/망 상태 이슈로 판단됨

## 재현 경로
1. 전화 앱 실행
2. 번호 입력 시도
3. 발신 시도
4. 통화 서비스 불가 상태로 정상 통화 연결 실패
5. 홈으로 복귀

## 비고
- 본 항목은 심카드 미삽입 또는 통신 불가 상태 데모용 FAIL 케이스로 활용 가능
