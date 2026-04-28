# Openclaw-Termux-NoRoot

작성 기준일: 2026-04-28

- GitHub: <https://github.com/techjarves/Openclaw-Termux-NoRoot>
- README: <https://github.com/techjarves/Openclaw-Termux-NoRoot/blob/main/README.md>
- YouTube 소개 영상: [How to Install OpenClaw on Android Without Root (Full Phone Control)](https://youtu.be/QePlp8CJ-qA?si=u2SkokSIss7Z4MY_)
- 영상 채널: Tech Jarves

## 프로젝트 요약

`Openclaw-Termux-NoRoot`는 Android 기기를 루팅하지 않고 Termux, Shizuku, OpenClaw, Gemini AI, Telegram Bot을 조합해 원격 제어용 AI 에이전트처럼 사용하는 설치 가이드/스크립트 프로젝트다.

핵심 목표는 Telegram으로 자연어 명령을 보내면 Gemini가 명령을 해석하고, OpenClaw와 Shizuku를 통해 Android 기기에서 Wi-Fi, Bluetooth, 앱 실행, 스크린샷, 볼륨, 전화, SMS 같은 작업을 수행하게 하는 것이다.

## 주요 구성

| 구성 요소 | 역할 |
| --- | --- |
| Termux | Android에서 셸과 설치 스크립트를 실행하는 환경 |
| Shizuku | 루트 없이 ADB 수준 권한을 제공 |
| OpenClaw Android | AI gateway / 기기 제어 기반 |
| Telegram Bot | 외부에서 명령을 보내는 채널 |
| Gemini API | 자연어 명령 해석 |

## README 기준 요구 사항

- Android 11 이상
- F-Droid 버전 Termux
- Shizuku
- Telegram Bot Token
- Gemini API Key

README는 Termux의 Play Store 버전이 아니라 F-Droid 버전을 사용하라고 안내한다.

## 설치 흐름

1. Android 개발자 옵션을 활성화한다.
2. 무선 디버깅을 켠다.
3. F-Droid에서 Termux를 설치한다.
4. Shizuku를 설치하고 무선 디버깅으로 페어링한다.
5. Shizuku가 실행 중인 상태로 terminal app용 파일을 export한다.
6. 내부 저장소 최상위에 `Shizuku` 폴더를 만들고 export 파일을 저장한다.
7. Termux에서 설치 스크립트를 실행한다.
8. `openclaw onboard`로 초기 설정을 진행한다.
9. `openclaw auth add google --key "YOUR_GEMINI_KEY_HERE"`로 Gemini API 키를 등록한다.
10. `openclaw gateway`로 gateway를 실행한다.
11. Telegram Bot으로 명령을 보낸다.

## README의 설치 명령

```bash
curl -sL https://raw.githubusercontent.com/jarvesusaram99/Openclaw-Termux-NoRoot/main/auto_setup.sh | bash
```

주의: README가 안내하는 raw URL은 `techjarves/Openclaw-Termux-NoRoot`가 아니라 `jarvesusaram99/Openclaw-Termux-NoRoot`를 가리킨다. 실행 전에 실제 스크립트 저장소와 내용을 확인해야 한다.

## 지원 명령 예시

README에 정리된 명령은 다음 범주를 포함한다.

- 배터리 상태 확인
- Wi-Fi 켜기/끄기
- Bluetooth 켜기/끄기
- 밝기 조절
- 볼륨 조절 및 음소거
- 화면 잠금
- 스크린샷 촬영
- 앱 실행 및 강제 종료
- 설치 앱 목록 조회
- URL 열기
- YouTube 검색
- 전화 걸기
- SMS 작성
- WhatsApp 메시지 전송
- 기기 모델 및 Android 버전 조회

## 문제 해결 포인트

| 문제 | README의 해결 방향 |
| --- | --- |
| `rish: command not found` | `bash ~/storage/shared/Shizuku/copy.sh`를 다시 실행 |
| Shizuku 응답 없음 | Shizuku 앱에서 Running 상태 확인 후 Termux에서 `shizuku` 실행 |
| 네트워크 오류 | `export NODE_OPTIONS=--dns-result-order=ipv4first` 설정 |
| `rish_shizuku.dex` 없음 | Shizuku에서 terminal app용 파일을 다시 export하고 `Shizuku` 폴더에 저장 |

## 보안 및 운영 주의 사항

- 설치 스크립트는 `curl | bash` 방식이므로 실행 전 원문을 반드시 검토한다.
- Telegram Bot Token과 Gemini API Key가 Termux 환경에 저장되므로 기기 접근 권한을 통제한다.
- Shizuku는 루트 없이도 강한 기기 제어 권한을 제공하므로 페어링된 환경과 실행 상태를 주기적으로 확인한다.
- 전화, SMS, WhatsApp 같은 명령은 오동작 시 실제 비용이나 개인정보 노출로 이어질 수 있다.
- 장시간 gateway를 켜둘 경우 배터리 최적화 예외, 네트워크 안정성, 발열, 저장 공간을 확인한다.

## 유튜브 소개 영상

README는 전체 설정 튜토리얼 영상으로 다음 YouTube 링크를 제공한다.

- <https://youtu.be/QePlp8CJ-qA?si=u2SkokSIss7Z4MY_>

영상 제목은 `How to Install OpenClaw on Android Without Root (Full Phone Control)`이며, 채널은 `Tech Jarves`다.
