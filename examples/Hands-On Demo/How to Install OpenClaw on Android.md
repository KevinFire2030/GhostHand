# How to Install OpenClaw on Android

작성 기준일: 2026-04-28

- GitHub: <https://github.com/techjarves/Openclaw-Termux-NoRoot>
- README: <https://github.com/techjarves/Openclaw-Termux-NoRoot/blob/main/README.md>
- YouTube 소개 영상: [How to Install OpenClaw on Android | Clawdbot/Moltbot Android](https://youtu.be/y0maYSlwkIM?si=Ko8ocPFHSqTT1z8G)
- 영상 채널: orailnoor

## 개요

`Openclaw-Termux-NoRoot`는 Android 기기에서 루트 없이 OpenClaw 기반 제어 환경을 구성하는 프로젝트다. Termux에서 설치 스크립트를 실행하고, Shizuku로 ADB 수준 권한을 연결한 뒤, Telegram Bot과 Gemini API를 사용해 자연어 명령으로 Android 기기를 제어하는 흐름을 제공한다.

README는 "Control any Android phone via Telegram using Gemini AI - no root required"를 핵심 설명으로 제시한다.

## 핵심 기능

- Telegram Bot을 통한 원격 명령 입력
- Gemini AI를 이용한 자연어 명령 해석
- Shizuku 기반의 루트 없는 Android 제어
- Wi-Fi, Bluetooth, 밝기, 볼륨, 앱 실행, 스크린샷 등 30개 이상의 명령
- 단일 설치 스크립트를 통한 초기 구성

## 필요 조건

| 항목 | 내용 |
| --- | --- |
| Android | Android 11 이상 |
| Termux | F-Droid 버전 권장, Play Store 버전 비권장 |
| Shizuku | F-Droid 또는 Play Store에서 설치 |
| Telegram Bot Token | Telegram의 BotFather에서 생성 |
| Gemini API Key | Google AI Studio에서 발급 |

## 설치 절차 요약

1. Android 설정에서 개발자 옵션을 활성화한다.
2. 개발자 옵션에서 무선 디버깅을 켠다.
3. F-Droid에서 Termux를 설치한다.
4. Shizuku를 설치하고 무선 디버깅으로 페어링한다.
5. Shizuku가 Running 상태가 되도록 시작한다.
6. Shizuku의 `Use Shizuku in terminal apps` 기능으로 파일을 export한다.
7. 내부 저장소 최상위에 `Shizuku` 폴더를 만들고 export 파일을 저장한다.
8. Termux에서 설치 스크립트를 실행한다.
9. OpenClaw 초기 설정과 Gemini 인증 정보를 등록한다.
10. `openclaw gateway`를 실행하고 Telegram Bot으로 명령을 테스트한다.

## README 설치 명령

```bash
curl -sL https://raw.githubusercontent.com/jarvesusaram99/Openclaw-Termux-NoRoot/main/auto_setup.sh | bash
```

주의: GitHub 저장소는 `techjarves/Openclaw-Termux-NoRoot`지만 README의 설치 명령은 `jarvesusaram99/Openclaw-Termux-NoRoot`의 raw 스크립트를 내려받는다. 실행 전에 스크립트 내용과 계정/저장소 관계를 확인해야 한다.

## 인증 설정

README는 설치 후 다음 명령 흐름을 안내한다.

```bash
openclaw onboard
openclaw auth add google --key "YOUR_GEMINI_KEY_HERE"
openclaw gateway
```

`openclaw onboard`에서 Telegram Bot 등 초기 설정을 진행하고, `openclaw auth add google`로 Gemini API Key를 등록한 뒤 gateway를 실행하는 구조다.

## 명령 예시

README의 예시 명령은 다음과 같다.

- `What's my battery?`
- `Open Chrome`
- `Search YouTube for lofi beats`
- `Turn off WiFi`

지원 명령 범위에는 배터리 확인, Wi-Fi/Bluetooth 제어, 밝기/볼륨 조절, 화면 잠금, 스크린샷, 앱 실행/종료, URL 열기, YouTube 검색, 전화, SMS, WhatsApp 메시지, 기기 정보 조회가 포함된다.

## 문제 해결 요약

| 문제 | 해결 방향 |
| --- | --- |
| `rish: command not found` | `bash ~/storage/shared/Shizuku/copy.sh` 재실행 |
| Shizuku 응답 없음 | Shizuku 앱에서 Running 상태 확인 후 Termux에서 `shizuku` 실행 |
| 네트워크 오류 | `export NODE_OPTIONS=--dns-result-order=ipv4first` 설정 |
| `rish_shizuku.dex` 없음 | Shizuku terminal app용 파일을 다시 export해 `Shizuku` 폴더에 저장 |

## YouTube 소개 영상

- URL: <https://youtu.be/y0maYSlwkIM?si=Ko8ocPFHSqTT1z8G>
- 제목: `How to Install OpenClaw on Android | Clawdbot/Moltbot Android`
- 채널: `orailnoor`

이 영상은 Android에서 OpenClaw/Clawdbot/Moltbot 계열 구성을 설치하는 과정을 소개하는 자료로 함께 참고할 수 있다.

## 보안 체크리스트

- `curl | bash` 실행 전 `auto_setup.sh` 원문을 확인한다.
- Telegram Bot Token과 Gemini API Key 저장 위치를 확인한다.
- Shizuku가 제공하는 권한 범위를 이해하고, 사용하지 않을 때는 실행 상태를 점검한다.
- SMS, 전화, WhatsApp 명령은 실제 기기 작업으로 이어질 수 있으므로 테스트 범위를 제한한다.
- 장시간 실행 시 배터리 최적화 예외, 발열, 네트워크 안정성을 확인한다.
