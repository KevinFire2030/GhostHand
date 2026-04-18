# TC-02 결과

- 제목: 문자 보내기 - 홈으로 이동
- 판정: FAIL
- 분류: DEVICE_ENV
- 담당 조직: 시험 환경/검증 운영
- 담당자: 홍길동

## 실패 사유
테스트 시작 전 ADB 연결 상태를 확인한 결과, 연결된 단말/에뮬레이터가 없어 본 TC를 실행할 수 없었습니다.

## 1차 로그 분석
- `adb devices -l` 결과: 단말 목록 없음
- `adb get-state` 결과: `error: no devices/emulators found`
- 주 원인: 시험 환경 미구성 또는 ADB 연결 해제

## 증적
- `screen.mp4`: 미수집(환경 차단으로 생성 불가, 빈 placeholder 파일 생성)
- `logcat.txt`: 장치 미연결 사유 기록
- `screenshots/`: 미수집

## 재시도 조건
1. ADB 연결 가능한 단말 또는 에뮬레이터 준비
2. USB 디버깅 승인 확인
3. 연결 후 동일 시나리오 재실행
