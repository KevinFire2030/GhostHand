# Claim Overlap Check v2

## Summary
This document records a 4th-pass KIPRIS search focused on the narrower distinguishing points of GhostHand.

Unlike broader searches around general mobile control, this pass was designed to probe whether GhostHand's more specific structure — especially same-device self-control, local runtime execution, debugging-bridge usage, and integrated build/install/control loops — is already strongly covered by visible KIPRIS results.

---

## Search queries used
- `자기제어 + 단말`
- `동일 단말 + 제어`
- `디버깅 + 단말 제어`
- `앱 설치 + 단말 제어`

---

## High-level conclusion

### English
The 4th-pass KIPRIS search did not reveal a clearly matching document that appears to directly disclose the full narrower GhostHand structure.

Instead, the results mostly fell into adjacent but different categories, such as:
- general electronic device control
- hardware or terminal structural configurations
- remote debugging systems
- app installation–related communication control

This suggests that as the GhostHand claim direction becomes narrower and more centered on same-device self-control, directly matching KIPRIS documents become less obvious.

### 한국어
4차 좁은 검색 결과에서는 GhostHand의 더 좁아진 구조를 직접적으로 그대로 드러내는 문헌은 아직 확인되지 않았다.

대신 검색 결과는 주로 다음과 같은 인접 영역으로 분산되었다.
- 일반적인 전자기기 제어
- 하드웨어/단말 구조 관련 기술
- 원격 디버깅 시스템
- 앱 설치에 따른 통신 제어

즉 GhostHand 청구항 방향이 좁아질수록, KIPRIS에서 직접 겹치는 문헌은 오히려 덜 명확해지는 경향이 보인다.

---

## Query-by-query notes

### 1. 자기제어 + 단말

#### English
The results leaned toward general electronic-device control and integrated control systems rather than an AI agent inside the same phone controlling that phone.

**Preliminary overlap risk:** Low

#### 한국어
이 검색은 GhostHand가 의도한 same-device self-control보다는 일반적인 전자기기 제어 또는 통합 제어 장치 쪽 결과로 기울었다.

**예비 중복 위험:** 낮음

---

### 2. 동일 단말 + 제어

#### English
The term “same device” did not map well to the GhostHand meaning in KIPRIS results. Returned documents often used “same” in a hardware or physical-layout sense rather than in the sense of an agent controlling the same mobile terminal in which it runs.

**Preliminary overlap risk:** Low

#### 한국어
`동일 단말`이라는 표현은 GhostHand가 말하는 same-device 의미로 잘 매칭되지 않았다. 검색 결과는 주로 하드웨어 구조나 물리적 배치 측면의 “동일”로 해석되는 문헌이 많았다.

**예비 중복 위험:** 낮음

---

### 3. 디버깅 + 단말 제어

#### English
This query produced more relevant technical adjacency, especially around debugging systems. One notable result was a remote application programming debugging system and control method.

This is relevant because GhostHand also includes runtime and debugging-related behavior, but the currently observed document still appears different from GhostHand in that it focuses on remote or development-side debugging systems rather than same-device AI self-control.

**Preliminary overlap risk:** Low to Medium

#### 한국어
이 검색은 비교적 더 기술적으로 인접한 결과를 보여주었다. 특히 원격 응용 프로그래밍 디버깅시스템 및 그 제어방법과 같은 문헌이 잡혔다.

이는 GhostHand 역시 런타임/디버깅 관련 요소를 포함한다는 점에서 의미는 있지만, 현재 확인된 문헌은 same-device AI 자기제어보다는 원격 또는 개발자 측 디버깅 시스템에 더 가까워 보인다.

**예비 중복 위험:** 낮음~중간

---

### 4. 앱 설치 + 단말 제어

#### English
The results mostly described server-side or platform-side control triggered by app installation state, or installation control across connected devices.

This is not identical to the GhostHand concept of a same-device integrated build-install-launch-control loop.

**Preliminary overlap risk:** Low

#### 한국어
이 검색은 앱 설치 상태에 따른 서버/플랫폼 제어, 또는 연결된 다른 장치와의 설치 제어 흐름에 가까운 결과가 많았다.

이는 GhostHand가 의도하는 동일 단말 내 빌드·설치·실행·제어 통합 루프와는 다르다.

**예비 중복 위험:** 낮음

---

## Practical interpretation

### English
The broader claim space remains risky because public disclosures and adjacent patent documents already exist in areas such as:
- AI-based Android control
- natural language device control
- ADB-related device control

However, the narrower GhostHand direction still appears more defensible when centered on:
- same-device self-control
- local on-phone runtime execution
- wireless debugging bridge for the same device
- verified execution with fallback
- integrated build-install-launch-control loop

### 한국어
넓은 청구항 공간은 여전히 위험하다. 왜냐하면 다음 영역에는 이미 공개기술이나 인접 특허 문헌이 존재하기 때문이다.
- AI 기반 안드로이드 제어
- 자연어 기반 단말 제어
- ADB 관련 단말 제어

그러나 GhostHand의 더 좁은 방향은 다음 포인트를 중심으로 할 때 상대적으로 방어력이 있어 보인다.
- 동일 단말 자기제어
- 단말 내부 로컬 실행 환경
- 동일 단말용 무선 디버깅 브리지
- 검증 및 fallback
- 빌드·설치·실행·제어 통합 루프

---

## Current recommendation

### English
The next step should be to rewrite the claim direction once more, focusing even more tightly on same-device self-control and integrated on-phone execution. The current KIPRIS results suggest that this narrower path is more promising than the broader AI-plus-ADB framing.

### 한국어
다음 단계에서는 same-device self-control과 단말 내부 통합 실행 구조를 더 강하게 반영하도록 청구항 방향을 한 번 더 다듬는 것이 좋다. 현재 KIPRIS 결과는 넓은 AI+ADB 표현보다 이 좁은 방향이 더 유망함을 시사한다.
