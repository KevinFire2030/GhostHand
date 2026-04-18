# TC-03 크롬 앱 실행 - 네이버 이동 - 수원 날씨 검색 - 홈으로 이동

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
1. Chrome 실행
2. 네이버 이동
3. 수원 날씨 검색
4. 결과 확인
5. 홈 이동
