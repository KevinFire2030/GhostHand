# TC-01 전화 걸기 - 홈으로 이동

- Result: **FAIL**
- Primary classification: 
- Owner org: 시험 환경/검증 운영
- Owner: 홍길동

## What happened
- Planned scenario execution was not started because List of devices attached returned no connected device.
- As a result, UI actions, screen recording, screenshots, and device logcat capture were all blocked.

## First-pass log analysis
- Symptom: No ADB target detected during preflight.
- Evidence:  contained no device rows.
- Likely cause: USB connection disconnected, ADB authorization missing, device powered off/locked, or emulator not running.
- Classification reason: This is an execution-environment blocker, not an app/function regression.

## Expected remediation
1. Connect and authorize the target device/emulator.
2. Re-run Demo3 UT after List of devices attached shows one healthy target.

## Intended scenario
1. 전화 앱 실행
2. 번호 입력 화면 진입
3. 전화 걸기 시도
4. 결과 확인 후 홈 이동
