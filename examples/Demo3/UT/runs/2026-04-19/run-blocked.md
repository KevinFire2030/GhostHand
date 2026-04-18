# Run Blocked Evidence

- Timestamp: 2026-04-19T00:02:00+09:00
- Repo: `KevinFire2030/GhostHand`
- Requested workflow: Demo3 기본 UT 검증
- Blocking condition:
  - `adb devices -l` returned no connected devices.
  - `adb connect 10.247.92.78:41679` failed with `Connection refused`.

Because no target device was reachable, the automation did not create per-test recordings/logcats/screenshots for 2026-04-19.

Reference last completed run: `examples/Demo3/UT/runs/2026-04-18/`
