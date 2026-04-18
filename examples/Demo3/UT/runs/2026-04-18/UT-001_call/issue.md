# 전화 걸기 실패

## 재현 경로
1. 전화 앱 실행
2. 번호 입력
3. 발신 시도
4. 통화 연결 실패 확인

## FAIL 사유
- 단말이 음성 통화 서비스 등록 상태가 아니어서 발신 테스트를 정상 완료할 수 없음

## 1차 로그 분석 결과
- `mVoiceRegState=1(OUT_OF_SERVICE)`
- `IsVoiceCallAvailable=false`
- `registrationState=NOT_REG_SEARCHING`

## 담당자
- 홍길동

## 첨부파일
- `examples/Demo3/UT/runs/2026-04-18/UT-001_call/screen.mp4`
- `examples/Demo3/UT/runs/2026-04-18/UT-001_call/logcat.txt`
- `examples/Demo3/UT/runs/2026-04-18/UT-001_call/screenshots/UT-001_call.png`
