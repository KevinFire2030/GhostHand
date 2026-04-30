# [Demo3][UT] 2026-04-30 기본 UT 실행 차단 - ADB 단말/에뮬레이터 미연결

## 요약
- 실행 요청 시각: 2026-04-30 12:58 (Asia/Seoul)
- 상태: BLOCKED
- 사유: ADB 연결 가능한 단말이 없어 Demo3 기본 UT 자동 실행을 시작하지 못함

## 재현/확인 절차
1. Termux/OpenClaw 환경에서 `adb devices -l` 실행
2. 연결 단말 없음 확인
3. 저장된 직전 주소 `adb connect 10.247.92.78:41679` 재시도
4. `Connection refused` 확인

## 실제 확인 결과
- `adb devices -l`: no connected devices
- `adb connect 10.247.92.78:41679`: `Connection refused`

## 영향 범위
- TC-01 ~ TC-05 모두 미실행
- 오늘자 per-TC 실측 산출물(`screen.mp4`, `logcat.txt`, `screenshots/*`) 미생성
- 기능별 PASS/FAIL 판정 보류

## 1차 분류
- 유형: DEVICE_ENV
- 담당 조직: 시험 환경/검증 운영
- 담당자: 홍길동

## 참고 경로
- `examples/Demo3/UT/runs/2026-04-30/result.md`
- `examples/Demo3/UT/runs/2026-04-30/run-blocked.md`
- `examples/Demo3/UT/runs/2026-04-30/adb-devices.txt`
- `examples/Demo3/UT/runs/2026-04-30/adb-connect.txt`
