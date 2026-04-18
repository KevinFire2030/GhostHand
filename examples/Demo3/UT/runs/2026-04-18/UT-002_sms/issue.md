# 문자 보내기 실패

## 재현 경로
1. 메시지 앱 실행
2. 새 메시지 작성 시도
3. 수신자/본문 입력 자동화 수행
4. 입력 단계에서 오류 발생
5. 전송 완료 검증 실패

## FAIL 사유
- `adb shell input text` 수행 중 단말 시스템 입력 예외 발생
- 추가로 단말 통신 상태가 정상 발송 조건을 만족하지 않을 가능성이 높음

## 1차 로그 분석 결과
- `java.lang.NullPointerException` in `InputShellCommand.runText`
- 전화 서비스 상태 참고: `OUT_OF_SERVICE`

## 담당자
- 홍길동

## 첨부파일
- `examples/Demo3/UT/runs/2026-04-18/UT-002_sms/screen.mp4`
- `examples/Demo3/UT/runs/2026-04-18/UT-002_sms/logcat.txt`
- `examples/Demo3/UT/runs/2026-04-18/UT-002_sms/screenshots/UT-002_sms.png`

## GitHub Issue
- https://github.com/KevinFire2030/GhostHand/issues/11
