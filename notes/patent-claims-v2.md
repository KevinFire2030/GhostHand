# Patent Claims v2 for GhostHand

## English

## Purpose
This document rewrites the GhostHand claim direction in a narrower and stronger form after considering public GitHub-visible disclosures related to AI-based Android control via ADB or wireless ADB.

The goal is to avoid overly broad framing such as:
- AI controls Android
- natural language mobile automation
- ADB-based phone control

and instead focus on the narrower core that may still remain distinctive.

---

## Core claim direction

GhostHand should be framed around the following combination:

1. an AI agent running inside the same mobile device it controls
2. a local execution environment on that device
3. a wireless debugging bridge used for same-device control
4. verification of execution result using device/UI/command state
5. fallback path selection when an initial control path fails
6. optionally, an integrated build-install-launch-control loop
7. optionally, a sensitive-action confirmation boundary

---

## Draft independent claim 1 (method)

A method performed by a mobile device, the method comprising:

- executing an AI agent in a local execution environment of the mobile device;
- receiving a natural language instruction from a user;
- determining, based on the instruction, a control action to be applied to the same mobile device;
- performing the control action through at least one of a wireless debugging interface and a local execution path;
- verifying a result of the control action using at least one of device state, user-interface state, and command output; and
- when the control action fails or is not verified, selecting an alternative control path and re-attempting execution.

---

## Draft independent claim 2 (device)

A same-device control system for a mobile device, comprising:

- a command input module configured to receive a natural language instruction;
- an interpretation module configured to determine an intended device action from the instruction;
- a planning module configured to select a control path for the same mobile device;
- a local execution module configured to execute commands within a local runtime environment of the mobile device;
- a wireless debugging control module configured to transmit control commands to the same mobile device through a wireless debugging interface;
- a verification module configured to verify whether a requested device action succeeded; and
- a fallback module configured to select an alternative control path when a first control path fails.

---

## Draft dependent claim ideas

### Claim 3
The method of claim 1, wherein the control action includes at least one of:
- launching an application,
- opening a URL in a target application,
- opening a system settings page,
- toggling a quick settings function,
- opening a dialer screen,
- opening a message composition screen.

### Claim 4
The method of claim 1, wherein the verification uses at least one of:
- a foreground application state,
- a package state,
- a user-interface dump,
- an execution output.

### Claim 5
The method of claim 1, wherein the alternative control path is selected from at least two of:
- package-based app launch,
- intent-based invocation,
- user-interface exploration,
- coordinate-based control.

### Claim 6
The method of claim 1, wherein the mobile device further performs application build, installation, launch, and subsequent device control in an integrated same-device loop.

### Claim 7
The method of claim 1, wherein a sensitive action is divided into a preparation stage and a final execution stage.

### Claim 8
The method of claim 7, wherein the final execution stage is performed only after a user confirmation is received.

### Claim 9
The method of claim 1, wherein the natural language instruction is received through a chat-based interface.

### Claim 10
The system of claim 2, wherein the local runtime environment comprises a terminal-based execution environment operating on the same mobile device.

---

## Why this is stronger than the broader version

This narrower version tries to move away from crowded claim space and emphasize:

- same-device self-control
- on-device local runtime execution
- control via wireless debugging bridge for the same phone
- closed-loop verification
- fallback and retry
- integrated build-install-launch-control workflow
- sensitive action boundary

This is more defensible than a generic claim about AI controlling Android devices.

---

## Practical note

Even this narrower claim direction may still require further prior-art review, especially against:
- AI-driven Android automation tools
- ADB-based control frameworks
- mobile UI agent systems
- browser/IDE-based phone control tools

However, this direction is more specific and more aligned with GhostHand's most distinctive structure.

---

## 한국어

## 목적
이 문서는 GitHub 등에 공개된 AI 기반 안드로이드 제어 공개기술을 고려한 후,
GhostHand의 청구항 방향을 더 좁고 강한 형태로 다시 정리한 것이다.

즉 아래처럼 너무 넓은 표현을 피하려는 목적이다.
- AI가 안드로이드를 제어한다
- 자연어 기반 모바일 자동화
- ADB 기반 휴대폰 제어

대신 GhostHand의 상대적으로 차별적인 핵심을 중심으로 재정리한다.

---

## 핵심 청구항 방향

GhostHand는 아래 조합 중심으로 잡아야 한다.

1. 제어 대상과 동일한 모바일 단말 내부에서 실행되는 AI 에이전트
2. 단말 내부 로컬 실행 환경
3. 동일 단말 제어에 이용되는 무선 디버깅 브리지
4. 단말 상태 / UI 상태 / 명령 출력값에 기반한 실행 결과 검증
5. 초기 제어 경로 실패 시 fallback 경로 선택
6. 선택적으로 앱 빌드·설치·실행·제어 통합 루프
7. 선택적으로 민감 작업 사용자 확인 경계

---

## 독립항 초안 1 (방법)

모바일 단말에 의해 수행되는 방법에 있어서,

- 상기 모바일 단말의 로컬 실행 환경에서 인공지능 에이전트를 실행하는 단계;
- 사용자로부터 자연어 명령을 수신하는 단계;
- 상기 자연어 명령에 기초하여 동일 모바일 단말에 적용될 제어 동작을 결정하는 단계;
- 무선 디버깅 인터페이스 및 로컬 실행 경로 중 적어도 하나를 통해 상기 제어 동작을 수행하는 단계;
- 단말 상태, 사용자 인터페이스 상태 및 명령 출력값 중 적어도 하나를 이용하여 상기 제어 동작의 결과를 검증하는 단계; 및
- 상기 제어 동작이 실패하거나 검증되지 않는 경우 대체 제어 경로를 선택하여 재시도하는 단계를 포함하는,
동일 모바일 단말 자기제어 방법.

---

## 독립항 초안 2 (장치)

동일 모바일 단말 제어 시스템에 있어서,

- 자연어 명령을 수신하는 명령 입력 모듈;
- 상기 명령으로부터 단말 동작 의도를 판별하는 해석 모듈;
- 동일 모바일 단말에 대한 제어 경로를 선택하는 계획 모듈;
- 상기 모바일 단말의 로컬 실행 환경 내에서 명령을 실행하는 로컬 실행 모듈;
- 무선 디버깅 인터페이스를 통해 동일 모바일 단말로 제어 명령을 전달하는 무선 디버깅 제어 모듈;
- 요청된 단말 동작의 성공 여부를 검증하는 검증 모듈; 및
- 제1 제어 경로가 실패한 경우 대체 제어 경로를 선택하는 fallback 모듈
을 포함하는, 동일 모바일 단말 자기제어 시스템.

---

## 종속항 아이디어

### 청구항 3
청구항 1에 있어서, 상기 제어 동작은
- 애플리케이션 실행,
- 대상 애플리케이션에서의 URL 열기,
- 시스템 설정 화면 열기,
- 빠른설정 기능 토글,
- 전화 화면 호출,
- 문자 작성 화면 호출
중 적어도 하나를 포함하는 방법.

### 청구항 4
청구항 1에 있어서, 상기 검증은
- 포그라운드 애플리케이션 상태,
- 패키지 상태,
- UI 덤프,
- 실행 출력값
중 적어도 하나를 이용하는 방법.

### 청구항 5
청구항 1에 있어서, 상기 대체 제어 경로는
- 패키지 기반 앱 실행,
- 인텐트 호출,
- UI 탐색,
- 좌표 기반 제어
중 적어도 둘 이상으로부터 선택되는 방법.

### 청구항 6
청구항 1에 있어서, 상기 모바일 단말은 애플리케이션 빌드, 설치, 실행 및 후속 단말 제어를 동일 단말 내 통합 루프로 수행하는 방법.

### 청구항 7
청구항 1에 있어서, 민감 작업은 준비 단계와 최종 실행 단계로 구분되는 방법.

### 청구항 8
청구항 7에 있어서, 상기 최종 실행 단계는 사용자 확인 후 수행되는 방법.

### 청구항 9
청구항 1에 있어서, 상기 자연어 명령은 채팅 기반 인터페이스를 통해 수신되는 방법.

### 청구항 10
청구항 2에 있어서, 상기 로컬 실행 환경은 동일 모바일 단말에서 동작하는 터미널 기반 실행 환경을 포함하는 시스템.

---

## 왜 기존보다 강한가

이 버전은 공개기술이 많은 넓은 영역을 피하고, 아래 차별 포인트를 더 강조한다.

- 동일 단말 자기제어
- 단말 내부 로컬 실행 환경
- 동일 단말에 대한 무선 디버깅 브리지 제어
- 폐루프 검증 구조
- fallback / retry
- 빌드·설치·실행·제어 통합 루프
- 민감 작업 확인 경계

즉 단순히 “AI가 안드로이드 단말을 제어한다”는 주장보다 방어력이 높다.

---

## 실무 메모

이 좁아진 방향도 여전히 아래와의 비교 검토는 필요하다.
- AI 기반 안드로이드 자동화 도구
- ADB 제어 프레임워크
- 모바일 UI 에이전트 시스템
- 브라우저/IDE 기반 폰 제어 도구

다만 현재 기준으로는 이 방향이 GhostHand의 실제 차별성을 더 잘 반영한다.
