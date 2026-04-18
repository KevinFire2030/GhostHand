# UT-002 문자 보내기 - 홈으로 이동 결과

- 결과: **FAIL**
- 담당자: 홍길동
- 문제 유형: DEVICE_ENV / TEST_SCRIPT

## 실행 요약
- 메시지 앱 실행 및 작성 화면 진입 자동화를 시도함
- 산출물 저장 완료
  - `screen.mp4`
  - `logcat.txt`
  - `screenshots/UT-002_sms.png`

## FAIL 사유
- 문자 발송 가능 여부는 이동통신 서비스 상태 영향을 받음
- 자동 입력 과정에서 `adb shell input text`가 단말 측 예외를 발생시켜 메시지 본문 입력 자동화가 중단됨
- 따라서 문자 전송 성공까지 검증하지 못함

## 1차 로그 분석 결과
- 자동화 실패 로그:
  - `java.lang.NullPointerException` in `com.android.server.input.InputShellCommand.runText`
- 환경 참고:
  - 전화 서비스 상태도 `OUT_OF_SERVICE`로 확인되어 SMS 발송 성공 조건이 충분하지 않음
- 해석:
  - 시험 환경 이슈와 입력 자동화 이슈가 함께 존재함

## 재현 경로
1. 메시지 앱 실행
2. 새 메시지 작성 시도
3. 수신자/본문 입력 자동화 수행
4. 입력 단계에서 시스템 입력 예외 발생
5. 전송 성공까지 검증하지 못함

## 비고
- 데모용 FAIL 케이스로 활용 가능
- 후속 보완: 좌표 탭 기반 입력 또는 접근성/UIAutomator 기반 입력 필요
