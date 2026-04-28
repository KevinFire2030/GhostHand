# GitHub - Android/Termux에 OpenClaw 설치

조사 기준일: 2026-04-28

Android 또는 Termux 환경에서 OpenClaw 설치를 직접 다루는 GitHub 프로젝트를 별점과 목적 적합도 기준으로 정리했다.

## Top 3

| 순위 | 저장소 | Stars | Forks | 특징 |
| --- | --- | ---: | ---: | --- |
| 1 | [mithun50/openclaw-termux](https://github.com/mithun50/openclaw-termux) | 1,417 | 230 | Android용 OpenClaw Gateway 실행을 목표로 하며, 독립 Flutter 앱, 내장 터미널, 웹 대시보드, 원탭 셋업, Termux CLI 패키지를 제공한다. |
| 2 | [AidanPark/openclaw-android](https://github.com/AidanPark/openclaw-android) | 1,413 | 176 | proot/Ubuntu 없이 Android에서 OpenClaw를 직접 실행하는 단일 명령 설치 방식을 내세운다. |
| 3 | [androidmalware/OpenClaw_Termux](https://github.com/androidmalware/OpenClaw_Termux) | 271 | 52 | Termux에서 `proot-distro`로 Ubuntu를 설치하고 OpenClaw Gateway를 실행하는 스크립트형 프로젝트다. WhatsApp, Telegram, Discord 연동 사례가 포함되어 있다. |

## 후보에서 제외한 프로젝트

- [rohanarun/phoneclaw](https://github.com/rohanarun/phoneclaw): 별점은 높지만 OpenClaw 설치 스크립트보다 Android 자동화와 폰 제어 쪽 성격이 강하다.
- [friuns2/codexUI](https://github.com/friuns2/codexUI): Termux 지원은 있지만 OpenClaw 설치 프로젝트가 아니라 Codex UI 실행 프로젝트다.

## 실행 전 확인 사항

- Termux는 Google Play 버전보다 F-Droid 버전을 권장하는 프로젝트가 많다.
- 설치 스크립트는 실행 전에 반드시 내용을 확인한다.
- OpenClaw는 파일, 네트워크, 셸 명령, 외부 메시징 채널을 다룰 수 있으므로 권한 범위와 API 키 저장 방식을 점검한다.
- Android 기기에서 장시간 실행할 경우 배터리 최적화 예외, 저장 공간, RAM 여유를 확인한다.
