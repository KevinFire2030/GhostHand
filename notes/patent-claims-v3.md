# Patent Claims v3 for GhostHand

## English

## Purpose
This version rewrites the GhostHand claim direction more narrowly than v2, based on:
- public GitHub-visible AI+ADB Android control disclosures
- KIPRIS overlap checks
- the need to reduce overlap with broad mobile automation claims

The objective is to push the claim language toward the most defensible GhostHand-specific structure.

---

## Narrowed claim focus

The v3 direction should focus on the following combined technical points:

1. the AI agent is executed inside the same mobile device that is being controlled
2. the same mobile device includes a local execution environment
3. control is performed through a wireless debugging bridge and/or local execution path for that same device
4. the result of the control action is verified using device/UI/command state
5. when verification fails, an alternative control path is selected
6. the same device may perform build, install, launch, and subsequent control in an integrated workflow
7. sensitive external-impact actions are separated into preparation and final execution with confirmation

---

## Draft independent claim 1 (method)

A method performed by a mobile device, the method comprising:

- executing an AI agent within a local execution environment of the mobile device;
- receiving, at the mobile device, a natural language instruction;
- determining, by the AI agent, a control action to be performed on the same mobile device;
- causing execution of the control action through at least one of:
  - a wireless debugging interface directed to the same mobile device, and
  - a local execution path of the same mobile device;
- verifying whether the control action succeeded using at least one of:
  - device state,
  - user-interface state, and
  - command output; and
- when the control action is not verified as successful, selecting an alternative control path and re-attempting execution on the same mobile device.

---

## Draft independent claim 2 (system)

A same-device control system implemented on a mobile device, comprising:

- a natural language command input module;
- an interpretation module configured to derive a device-control intent from a received command;
- a planning module configured to generate a control plan for the same mobile device;
- a local execution module configured to execute commands in a local execution environment of the mobile device;
- a wireless debugging control module configured to send control commands through a wireless debugging interface for the same mobile device;
- a verification module configured to determine whether a requested control action succeeded; and
- a fallback module configured to select an alternative control path when a first control attempt fails.

---

## Draft dependent claims

### Claim 3
The method of claim 1, wherein the control action comprises at least one of:
- launching an application,
- opening a URL in a target application,
- opening a system settings page,
- toggling a quick settings function,
- opening a dialer interface,
- opening a message composition interface.

### Claim 4
The method of claim 1, wherein verification is performed using at least one of:
- a foreground application state,
- a package status,
- a UI dump,
- a shell execution result.

### Claim 5
The method of claim 1, wherein the alternative control path is selected from at least two of:
- package-based launch,
- intent-based invocation,
- UI exploration,
- coordinate-based control.

### Claim 6
The method of claim 1, wherein the same mobile device further performs:
- building an application package,
- installing the application package,
- launching the installed application, and
- performing post-launch device control,
in one integrated same-device workflow.

### Claim 7
The method of claim 1, wherein a sensitive action is divided into:
- a preparation stage, and
- a final execution stage.

### Claim 8
The method of claim 7, wherein the final execution stage is performed after receiving user confirmation.

### Claim 9
The method of claim 1, wherein the natural language instruction is received through a chat interface operating on or connected to the mobile device.

### Claim 10
The system of claim 2, wherein the local execution environment includes a terminal-based userland runtime operating on the same mobile device.

---

## Why v3 is narrower than v2

v3 is narrower because it more strongly locks the invention to:
- same-device execution
- same-device self-control
- local runtime + wireless debugging combination
- verification and fallback loop
- integrated build/install/launch/control workflow
- sensitive action confirmation boundary

This is intended to reduce overlap with broader public disclosures about AI-based Android automation.

---

## Practical interpretation

This claim direction should be understood as targeting a specific mobile self-operation architecture rather than general AI-assisted phone control.

The strongest defensible phrase is not:
- "AI controls Android"

but rather:

> an on-device same-device self-control architecture for Android combining local execution, wireless debugging, verification, fallback, and integrated device operation.

---

## 한국어

## 목적
이 버전은 다음 요소를 반영하여 GhostHand 청구항 방향을 v2보다 더 좁게 다시 쓴 것이다.
- GitHub 등에 공개된 AI+ADB 안드로이드 제어 공개기술
- KIPRIS 중복 점검 결과
- 넓은 모바일 자동화 청구항과의 겹침 가능성 축소 필요성

즉 GhostHand만의 가장 방어력 있는 구조에 더 가깝게 청구항을 몰아가는 것이 목적이다.

---

## 좁혀진 청구항 중심축

v3는 아래 기술 조합을 중심으로 해야 한다.

1. 제어 대상과 동일한 모바일 단말 내부에서 실행되는 AI 에이전트
2. 동일 모바일 단말 내부 로컬 실행 환경
3. 동일 단말을 위한 무선 디버깅 브리지 및/또는 로컬 실행 경로
4. 단말 상태 / UI 상태 / 명령 출력에 기반한 결과 검증
5. 검증 실패 시 대체 경로 선택
6. 동일 단말 내 빌드·설치·실행·후속 제어 통합 워크플로
7. 외부 영향이 있는 민감 작업에 대한 준비/최종 실행 분리 및 확인 경계

---

## 독립항 초안 1 (방법)

모바일 단말에 의해 수행되는 방법에 있어서,

- 상기 모바일 단말의 로컬 실행 환경 내에서 인공지능 에이전트를 실행하는 단계;
- 상기 모바일 단말에서 자연어 명령을 수신하는 단계;
- 상기 자연어 명령에 기초하여 동일 모바일 단말에 대해 수행할 제어 동작을 결정하는 단계;
- 다음 중 적어도 하나를 통해 상기 제어 동작을 수행하게 하는 단계:
  - 동일 모바일 단말을 대상으로 하는 무선 디버깅 인터페이스,
  - 동일 모바일 단말의 로컬 실행 경로;
- 다음 중 적어도 하나를 이용하여 상기 제어 동작의 성공 여부를 검증하는 단계:
  - 단말 상태,
  - 사용자 인터페이스 상태,
  - 명령 출력값; 및
- 상기 제어 동작이 성공으로 검증되지 않는 경우, 대체 제어 경로를 선택하여 동일 모바일 단말에 대해 재시도하는 단계를 포함하는,
동일 모바일 단말 자기제어 방법.

---

## 독립항 초안 2 (시스템)

모바일 단말에 구현되는 동일 단말 제어 시스템에 있어서,

- 자연어 명령 입력 모듈;
- 수신된 명령으로부터 단말 제어 의도를 도출하는 해석 모듈;
- 동일 모바일 단말에 대한 제어 계획을 생성하는 계획 모듈;
- 상기 모바일 단말의 로컬 실행 환경에서 명령을 실행하는 로컬 실행 모듈;
- 동일 모바일 단말을 위한 무선 디버깅 인터페이스를 통해 제어 명령을 전달하는 무선 디버깅 제어 모듈;
- 요청된 제어 동작의 성공 여부를 판단하는 검증 모듈; 및
- 제1 제어 시도가 실패한 경우 대체 제어 경로를 선택하는 fallback 모듈
을 포함하는, 동일 모바일 단말 자기제어 시스템.

---

## 종속항 초안

### 청구항 3
청구항 1에 있어서, 상기 제어 동작은 다음 중 적어도 하나를 포함하는 방법.
- 애플리케이션 실행
- 대상 애플리케이션에서 URL 열기
- 시스템 설정 페이지 열기
- 빠른설정 기능 토글
- 전화 인터페이스 호출
- 문자 작성 인터페이스 호출

### 청구항 4
청구항 1에 있어서, 상기 검증은 다음 중 적어도 하나를 이용해 수행되는 방법.
- 포그라운드 애플리케이션 상태
- 패키지 상태
- UI 덤프
- 쉘 실행 결과

### 청구항 5
청구항 1에 있어서, 상기 대체 제어 경로는 다음 중 적어도 둘 이상으로부터 선택되는 방법.
- 패키지 기반 실행
- 인텐트 기반 호출
- UI 탐색
- 좌표 기반 제어

### 청구항 6
청구항 1에 있어서, 동일 모바일 단말은 다음을 하나의 통합 same-device 워크플로로 수행하는 방법.
- 애플리케이션 패키지 빌드
- 애플리케이션 패키지 설치
- 설치된 애플리케이션 실행
- 실행 이후 단말 제어

### 청구항 7
청구항 1에 있어서, 민감 작업은 다음으로 구분되는 방법.
- 준비 단계
- 최종 실행 단계

### 청구항 8
청구항 7에 있어서, 상기 최종 실행 단계는 사용자 확인 후 수행되는 방법.

### 청구항 9
청구항 1에 있어서, 상기 자연어 명령은 모바일 단말 상에서 동작하거나 연결된 채팅 인터페이스를 통해 수신되는 방법.

### 청구항 10
청구항 2에 있어서, 상기 로컬 실행 환경은 동일 모바일 단말에서 동작하는 터미널 기반 userland 런타임을 포함하는 시스템.

---

## 왜 v3가 v2보다 더 좁은가

v3는 아래 요소를 더 강하게 묶는다.
- 동일 단말 실행
- 동일 단말 자기제어
- 로컬 런타임 + 무선 디버깅 결합
- 검증 및 fallback 루프
- 빌드/설치/실행/제어 통합 워크플로
- 민감 작업 확인 경계

즉 공개기술이 많은 넓은 AI 안드로이드 자동화 범위와의 겹침을 줄이기 위한 구조다.

---

## 실무적 해석

이 청구항 방향은 일반적인 AI 기반 폰 제어가 아니라,
보다 구체적인 모바일 자기운영 구조를 겨냥하는 것으로 이해해야 한다.

가장 방어력 있는 핵심 표현은 다음과 같다.

> 로컬 실행, 무선 디버깅, 검증, fallback, 통합 단말 운용을 결합한 안드로이드용 온디바이스 same-device self-control architecture
