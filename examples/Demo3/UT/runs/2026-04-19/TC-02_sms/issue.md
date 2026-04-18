# Issue draft for TC-02

## Suggested title
[Demo3][UT][TC-02] Validation blocked - no ADB device connected

## Summary
Demo3 basic UT validation could not execute because no Android device/emulator was detected by ADB during preflight.

## Impacted test case
- TC-02 - 문자 보내기 - 홈으로 이동

## Reproduction / execution path
1. Start Demo3 basic UT validation workflow.
2. Run List of devices attached before scenario execution.
3. Observe that no device is listed.
4. Attempt to start scenario execution.
5. Execution is blocked before app launch / capture begins.

## Fail reason
- Environment blocker: no ADB-connected device available.

## First-pass analysis
- Classification: DEVICE_ENV
- Owner org: 시험 환경/검증 운영
- Owner: 홍길동
- Evidence file: 

## Artifact path
- 

## GitHub issue
- Shared blocker issue: https://github.com/KevinFire2030/GhostHand/issues/13
