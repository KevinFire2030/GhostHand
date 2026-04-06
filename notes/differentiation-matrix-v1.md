# Differentiation Matrix v1

## English

## Purpose
This document strengthens the public-prior-art comparison for GhostHand by presenting a more explicit differentiation matrix.

The purpose is to show where GhostHand overlaps with public AI-based Android control disclosures, and where it may still retain meaningful technical distinction.

---

## Comparison targets

### Public GitHub-visible references
- DroidMind
- mobile-use
- DroidClaw
- MobiClaw

### KIPRIS-adjacent references considered in earlier review
- 복수의 지능형 에이전트를 관리하는 전자 장치 및 그의 동작 방법
- 원격 응용 프로그래밍 디버깅시스템 및 그 제어방법
- 앱 설치에 따른 통신 방식의 제어를 수행하기 위한 서버

---

## Comparison criteria

Legend:
- **Yes** = clearly appears present
- **Partial** = partly present or likely present
- **Unclear** = not enough evidence from current review
- **No** = not meaningfully present

| Criteria | GhostHand | DroidMind | mobile-use | DroidClaw | MobiClaw | Multi-agent device mgmt patent | Remote debugging patent | App-install control patent |
|---|---|---|---|---|---|---|---|---|
| Natural language command input | Yes | Yes | Yes | Yes | Yes | Partial | No | No |
| Android device control | Yes | Yes | Yes | Yes | Yes | Partial | Partial | Partial |
| ADB-based operation | Yes | Yes | Yes | Yes | Yes | No | No | No |
| Wireless ADB relevance | Yes | Partial | Partial | Partial | Yes | No | No | No |
| Local on-phone execution environment | Yes | Partial | Unclear | Unclear | No | No | No | No |
| Same-device execution | Yes | Unclear | Unclear | Unclear | No | No | No | No |
| Same-device self-control | Yes | Unclear | Unclear | Unclear | No | No | No | No |
| Build-install-launch-control loop | Yes | Partial | Partial | Partial | Partial | No | No | Partial |
| Verification of execution result | Yes | Yes | Partial | Yes | Yes | Partial | Partial | Partial |
| Fallback / retry path selection | Yes | Partial | Partial | Yes | Partial | No | No | No |
| Sensitive action confirmation boundary | Yes | Unclear | Unclear | Unclear | Unclear | No | No | No |
| Chat-based command interface | Yes | Partial | Partial | Partial | Partial | No | No | No |

---

## Main observations

### 1. Broad overlap exists
GhostHand clearly overlaps with public references in broad areas such as:
- AI-driven Android control
- natural language interaction
- ADB-based control
- agentic UI or phone automation

This means broad claim language is weak.

### 2. Narrower distinction may still exist
GhostHand appears potentially more distinctive when the focus shifts to:
- same-device execution
- same-device self-control
- local on-phone runtime environment
- integrated build-install-launch-control loop
- sensitive-action confirmation boundary

### 3. Public GitHub references are the strongest practical comparison set
Among the visible public references, DroidMind, mobile-use, DroidClaw, and MobiClaw appear more practically relevant than many of the broader KIPRIS patent results.

### 4. KIPRIS references still matter at the abstract concept level
The KIPRIS references remain relevant where they touch:
- intelligent agent management
- debugging systems
- installation-related control logic
but they do not yet appear to map directly to the narrower GhostHand structure.

---

## Likely defensible differentiation points

### A. Same-device self-control
GhostHand should emphasize that the AI agent runs inside the same physical mobile device that it controls.

### B. Local execution environment on the phone
GhostHand should emphasize that the execution runtime itself is local to the mobile device.

### C. Same-device debugging-bridge execution
GhostHand should emphasize use of a debugging bridge for same-device execution rather than merely external-device control.

### D. Integrated mobile build-install-launch-control workflow
GhostHand should emphasize that the same mobile device can build, install, launch, and control applications in one loop.

### E. Structured sensitive-action safety boundary
GhostHand should emphasize that external-impact actions are split into preparation and final execution with confirmation.

---

## Current strategic conclusion

The matrix suggests that GhostHand should not be positioned as a general mobile AI automation invention.

Instead, it should be positioned as:

> a same-device, on-device, self-control architecture for Android combining a local runtime, wireless debugging bridge, result verification, fallback handling, and integrated device operation workflow.

---

## Korean

## 목적
이 문서는 GhostHand와 공개기술 간 비교를 더 명시적으로 보여주기 위한 차별 매트릭스 문서다.

목적은 GhostHand가 공개된 AI 기반 안드로이드 제어 기술들과 어디서 겹치고,
어디서 차별될 수 있는지 시각적으로 정리하는 것이다.

---

## 비교 대상

### GitHub 공개 사례
- DroidMind
- mobile-use
- DroidClaw
- MobiClaw

### 앞서 검토한 KIPRIS 계열 문헌
- 복수의 지능형 에이전트를 관리하는 전자 장치 및 그의 동작 방법
- 원격 응용 프로그래밍 디버깅시스템 및 그 제어방법
- 앱 설치에 따른 통신 방식의 제어를 수행하기 위한 서버

---

## 비교 기준

표기 기준:
- **Yes** = 명확히 존재함
- **Partial** = 일부 존재하거나 가능성이 큼
- **Unclear** = 현재 검토 정보만으로 불명확
- **No** = 의미 있게 보이지 않음

| 비교 기준 | GhostHand | DroidMind | mobile-use | DroidClaw | MobiClaw | 복수 에이전트 관리 특허 | 원격 디버깅 특허 | 앱 설치 제어 특허 |
|---|---|---|---|---|---|---|---|---|
| 자연어 명령 입력 | Yes | Yes | Yes | Yes | Yes | Partial | No | No |
| 안드로이드 단말 제어 | Yes | Yes | Yes | Yes | Yes | Partial | Partial | Partial |
| ADB 기반 동작 | Yes | Yes | Yes | Yes | Yes | No | No | No |
| 무선 ADB 관련성 | Yes | Partial | Partial | Partial | Yes | No | No | No |
| 단말 내부 로컬 실행 환경 | Yes | Partial | Unclear | Unclear | No | No | No | No |
| 동일 단말 내부 실행 | Yes | Unclear | Unclear | Unclear | No | No | No | No |
| 동일 단말 자기제어 | Yes | Unclear | Unclear | Unclear | No | No | No | No |
| 빌드-설치-실행-제어 루프 | Yes | Partial | Partial | Partial | Partial | No | No | Partial |
| 실행 결과 검증 | Yes | Yes | Partial | Yes | Yes | Partial | Partial | Partial |
| fallback / retry 경로 | Yes | Partial | Partial | Yes | Partial | No | No | No |
| 민감 작업 확인 경계 | Yes | Unclear | Unclear | Unclear | Unclear | No | No | No |
| 채팅 기반 명령 인터페이스 | Yes | Partial | Partial | Partial | Partial | No | No | No |

---

## 주요 관찰점

### 1. 넓은 영역에서는 겹침이 많다
GhostHand는 아래 넓은 영역에서는 공개기술과 분명 겹친다.
- AI 기반 안드로이드 제어
- 자연어 인터페이스
- ADB 기반 제어
- 에이전트형 UI/폰 자동화

즉 넓은 청구항 표현은 약하다.

### 2. 좁은 차별 포인트는 여전히 남아 있다
GhostHand는 아래 축으로 좁혀 갈 때 상대적으로 차별성이 보인다.
- 동일 단말 내부 실행
- 동일 단말 자기제어
- 단말 내부 로컬 실행 환경
- 빌드-설치-실행-제어 통합 루프
- 민감 작업 사용자 확인 경계

### 3. GitHub 공개 사례가 가장 강한 실무 비교 대상이다
현재 보이는 공개 사례 중에서는 DroidMind, mobile-use, DroidClaw, MobiClaw가 실제 비교 대상으로 가장 중요하다.

### 4. KIPRIS 문헌은 추상적 수준의 겹침을 보여준다
KIPRIS 문헌은 다음 요소에서 여전히 의미가 있다.
- 지능형 에이전트 관리
- 디버깅 시스템
- 설치 관련 제어 로직
하지만 GhostHand의 좁은 구조와 직접 일치하는지는 아직 낮아 보인다.

---

## 방어 가능한 차별 포인트

### A. 동일 단말 자기제어
GhostHand는 AI 에이전트가 제어 대상과 같은 물리적 모바일 단말 내부에서 실행된다는 점을 강조해야 한다.

### B. 단말 내부 로컬 실행 환경
GhostHand는 실행 런타임 자체가 단말 내부에 존재한다는 점을 강조해야 한다.

### C. 동일 단말용 디버깅 브리지 실행
GhostHand는 단순한 외부 단말 제어가 아니라 same-device 실행을 위한 디버깅 브리지 활용 구조를 강조해야 한다.

### D. 모바일 빌드-설치-실행-제어 통합 워크플로
GhostHand는 같은 단말에서 앱을 빌드하고, 설치하고, 실행하고, 다시 제어하는 루프를 강조해야 한다.

### E. 민감 작업 안전 경계
GhostHand는 외부 영향을 주는 동작을 준비 단계와 최종 실행 단계로 나누고, 확인 경계를 두는 구조를 강조해야 한다.

---

## 현재 전략적 결론

GhostHand는 일반적인 모바일 AI 자동화 발명으로 포지셔닝하면 약하다.

대신 다음처럼 포지셔닝해야 한다.

> 로컬 실행 환경, 무선 디버깅 브리지, 결과 검증, fallback 처리, 통합 단말 운용 워크플로를 결합한 안드로이드용 same-device on-device self-control architecture
