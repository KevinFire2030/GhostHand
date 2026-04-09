# GhostHand

**AI-powered invisible hand on your phone**

**GhostHand** is an experimental on-device AI control system for Android.

It explores a simple but powerful idea:

> an AI agent running *inside* an Android phone can control that *same phone* through a local execution environment and a wireless ADB bridge.

Instead of relying on a separate PC or remote server, GhostHand aims to turn the phone itself into a self-operating environment for execution, automation, prototyping, and device control.

---

## What is GhostHand?

GhostHand combines:

- **Termux** as the local Linux-like execution environment
- **OpenClaw** as the AI agent runtime
- **Wireless ADB** as the bridge into Android system control
- **Natural language commands** as the user interface

In practice, this means a user can say things like:

- "Open the clock app"
- "Launch Chrome and open Naver"
- "Turn on the flashlight"
- "Build and install this APK"
- "Open the dialer with this phone number"

…and GhostHand can translate those requests into real device actions.

---

## Core Idea

Most device automation systems assume one of these models:

- a **PC controls a phone**
- a **cloud agent controls an external device**
- a **macro tool automates UI interactions**

GhostHand explores a different model:

- the **AI agent runs on the phone itself**
- the **phone becomes both controller and target**
- the **same device can execute code, build apps, install them, and control its own Android layer**

This makes GhostHand more than a simple automation script. It is closer to an **on-device AI control layer** for Android.

---

## Architecture

A simplified GhostHand flow looks like this:

```text
User -> Chat / Natural Language Command
      -> OpenClaw Agent in Termux
      -> Command Planning / Interpretation
      -> Wireless ADB Self-Connection
      -> Android App / System / UI Control
      -> Result Checking / Retry / Feedback
```

### Main Components

#### 1. User Command Layer
The user gives natural language instructions through chat or another lightweight interface.

#### 2. Agent Runtime
OpenClaw interprets the request, decides what should happen, and chooses the control strategy.

#### 3. Execution Layer
Termux provides the local shell/runtime environment where scripts, commands, and build tools run.

#### 4. Device Control Bridge
Wireless ADB allows GhostHand to control the Android layer of the same device.

#### 5. Verification Layer
GhostHand can inspect UI state, package state, or command output to verify whether an action succeeded.

---

## What GhostHand Can Do

Current proof-of-concept capabilities include:

- Launch Android apps
- Open websites in Chrome
- Open settings and system panels
- Toggle quick settings items such as flashlight
- Open call screens and SMS compose screens
- Open messaging apps and specific chat targets when possible
- Build Android APKs directly from Termux
- Install and launch APKs on the same device
- Support small app prototyping workflows entirely on-device

---

## Real-World Prototype Tasks Already Tested

GhostHand has already been used to test flows such as:

- opening Clock, Chrome, Gallery, Camera, YouTube, and Play Store
- searching content in Chrome and YouTube
- installing and launching a calculator app
- creating a simple Hello Android app in Termux
- building APKs directly on-device
- installing and running the built app
- creating and testing a minimal calculator app
- toggling flashlight from quick settings
- opening dialer and SMS compose flows
- opening Telegram chat targets through deep links

This means GhostHand is not just a concept note — it already has a working proof-of-concept base.

---

## Why It Is Interesting

GhostHand sits at the intersection of:

- on-device AI agents
- Android system control
- self-hosted mobile automation
- local app development and deployment
- natural language interfaces

Its most interesting property is this:

> the device is no longer just the thing being controlled — it also becomes the thing doing the controlling.

That opens the door to a new kind of personal mobile agent.

---

## Current Status

**Status:** early prototype / proof of concept

GhostHand is still experimental.
It is currently focused on:

- validating the architecture
- improving reliability of same-device control
- documenting practical workflows
- building repeatable on-device automation patterns

---

## Roadmap

Planned directions include:

- better command routing and fallback strategies
- reusable Android control modules
- more robust app-specific automations
- same-device AI orchestration workflows
- packaging GhostHand into a cleaner reproducible toolkit
- documenting patentable / research-worthy technical claims

---

## Design Principles

GhostHand is guided by a few core principles:

- **On-device first** — avoid unnecessary external dependencies
- **Natural language interface** — let the user speak plainly
- **Real execution, not simulation** — perform actual device actions
- **Verification matters** — check results when possible
- **Practical over flashy** — useful automation beats gimmicks

---

## Limitations

GhostHand is powerful, but not magic.

Current limitations include:

- some actions depend on device/vendor behavior
- some apps do not expose stable deep links or intent APIs
- external messaging actions require careful human confirmation
- Korean text input via ADB can be unreliable in some contexts
- wireless ADB sessions may need reconnection
- some Android build tools need special Termux-specific workarounds

---

## Android Build Note

One major GhostHand milestone was proving that Android APKs can be built directly in Termux on-device.

A key workaround was forcing Gradle to use the **Termux-installed `aapt2`** binary instead of the default Linux AAPT2 binary downloaded by Android Gradle Plugin.

This enabled successful APK builds for simple Android apps entirely on the phone.

---

## Vision

GhostHand is an exploration of what happens when a smartphone gains a local AI "ghost hand" that can:

- understand intent
- act on the device
- verify outcomes
- build tools for itself
- and gradually become a practical personal operator layer

---

## Korean Summary (짧은 설명)

GhostHand는 **안드로이드 폰 안의 AI 에이전트가, 같은 폰을 다시 제어하는 실험적 프로젝트**입니다.

핵심 구성은 다음과 같습니다:

- Termux: 로컬 실행 환경
- OpenClaw: AI 에이전트 런타임
- 무선 ADB: 안드로이드 제어 브리지
- 자연어 명령: 사용자 인터페이스

즉, 사용자가 채팅으로 명령하면 GhostHand가 이를 해석해서
앱 실행, 설정 열기, 손전등 제어, APK 빌드/설치 같은 실제 동작으로 연결하는 구조입니다.

---

## License

MIT
