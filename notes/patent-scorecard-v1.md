# Patent Scorecard v1

## English

## Purpose
This document provides a practical scoring view of GhostHand's current patent viability.

It is **not** a legal determination and should not be treated as a substitute for patent counsel.
Instead, it is a working evaluation tool for strategy, prioritization, and discussion.

Scoring scale:
- **0–2** very weak
- **3–4** weak
- **5–6** moderate
- **7–8** strong
- **9–10** very strong

---

## Score summary

| Category | Score (10) | Comment |
|---|---:|---|
| Novelty (narrow claim framing) | 6 | Broad framing is weak, but narrower same-device framing may retain novelty room |
| Inventive step / non-obviousness | 5 | Public disclosures make broad claims weak; narrower architectural combination may still help |
| Technical concreteness | 8 | GhostHand has a concrete architecture and reproducible execution flow |
| Prototype / proof of concept | 9 | Same-device ADB control, APK build/install/run, and command execution have been demonstrated |
| Documentation quality | 9 | README, prior-art notes, overlap checks, claim drafts, and strategy notes are already well organized |
| Patent strategy readiness | 7 | The project is becoming patent-ready, but claims still need refinement and narrowing |
| Public disclosure risk | 3 | Public GitHub-visible similar technologies already exist, and GhostHand itself has public material |
| Claim defensibility if broad | 2 | Broad “AI controls Android via ADB” claims appear weak |
| Claim defensibility if narrow | 6 | Same-device self-control plus local runtime plus verification/fallback is more defensible |
| Corporate / employee invention risk | 4 | Employment-related ownership and job-invention questions may materially affect filing strategy |

---

## Overall practical interpretation

### Simple average view
Rough practical score: **5.9 / 10**

### Strategic interpretation
GhostHand does **not** currently look like a dead-end idea. However, it also does **not** look like an easy broad patent.

The project appears strongest when:
- claims are narrowed,
- the same-device self-control architecture is emphasized,
- public-disclosure risks are actively managed,
- and ownership / job-invention issues are clarified before filing.

---

## Category-by-category explanation

### 1. Novelty — 6/10
Broad novelty is weak because public GitHub-visible systems already exist in the AI + Android + ADB space.

But narrower novelty may still remain where GhostHand is framed around:
- same-device self-control,
- local runtime on the phone,
- integrated build-install-launch-control loop,
- verification/fallback,
- sensitive action confirmation boundary.

### 2. Inventive step — 5/10
There is clear overlap with public disclosures in the broad field.
The strongest argument is not the individual parts, but the specific combination and operational structure.

### 3. Technical concreteness — 8/10
GhostHand is not merely conceptual. It has a real implementation direction and repeatable components.

### 4. Prototype / proof of concept — 9/10
This is one of GhostHand's strongest points.
A same-device ADB loop, Android app build/install/run flow, and practical command execution have already been demonstrated.

### 5. Documentation quality — 9/10
The project is unusually well documented for this stage.
This helps patent analysis, internal review, and future collaboration.

### 6. Patent strategy readiness — 7/10
The project is already at the stage where it can be discussed with a patent professional, but claim refinement is still needed.

### 7. Public disclosure risk — 3/10
This is currently one of the biggest weaknesses.
Publicly visible GitHub references already exist, and GhostHand itself has public materials that may narrow filing flexibility.

### 8. Broad-claim defensibility — 2/10
Broad claims such as:
- AI controls Android
- natural language mobile automation
- ADB-based mobile control
appear weak.

### 9. Narrow-claim defensibility — 6/10
The narrowed v2/v3 direction appears meaningfully stronger, especially around same-device self-control.

### 10. Corporate / employee invention risk — 4/10
This is not a technical weakness but a filing-strategy risk.
If the invention is tied to employment scope or company projects, ownership and filing path may become more complex.

---

## Practical conclusion

### Estimated practical outlook
A realistic current outlook is roughly:
- **broad filing path:** weak
- **narrow, carefully framed filing path:** moderately viable

If forced into a rough percentage-style intuition, GhostHand currently feels closer to:

> **about 35%–55% viable, depending on claim narrowing, disclosure management, and ownership clarity**

This should be understood as a strategic estimate, not a legal probability.

---

## Recommended next actions

1. Keep narrowing claim language
2. Strengthen the same-device self-control story
3. Continue prior-art review around debugging, self-control, and mobile runtime execution
4. Review public disclosure exposure
5. Clarify whether the invention may be treated as an employee/job-related invention before filing
6. Prepare a cleaner attorney-facing packet if filing becomes serious

---

## 한국어

## 목적
이 문서는 GhostHand의 현재 특허 승산을 실무적으로 점수화해 본 메모다.

이는 **법률적 확정 판단이 아니며**, 변리사 자문을 대체하지 않는다.
대신 전략 수립, 우선순위 판단, 내부 논의용 도구로 보는 것이 맞다.

점수 기준:
- **0–2** 매우 약함
- **3–4** 약함
- **5–6** 보통
- **7–8** 강함
- **9–10** 매우 강함

---

## 점수 요약

| 항목 | 점수(10) | 코멘트 |
|---|---:|---|
| 신규성(좁은 청구항 기준) | 6 | 넓게 보면 약하지만, same-device 중심으로 좁히면 여지가 있음 |
| 진보성 | 5 | 공개기술이 많아 넓게는 약하고, 구조 조합으로 방어해야 함 |
| 기술 구체성 | 8 | 아키텍처와 실행 흐름이 상당히 구체적임 |
| 프로토타입/실증성 | 9 | same-device ADB 제어, APK 빌드/설치/실행 등을 이미 입증함 |
| 문서화 수준 | 9 | README, 선행기술 조사, 청구항 초안, 메모 등이 잘 정리돼 있음 |
| 특허 전략 준비도 | 7 | 이미 논의 가능한 단계이지만 청구항 refinement는 더 필요함 |
| 공개 리스크 | 3 | 공개 GitHub 사례가 있고 GhostHand 자체 공개물도 있어 리스크가 큼 |
| 넓은 청구항 방어력 | 2 | AI+ADB 일반론은 매우 약함 |
| 좁은 청구항 방어력 | 6 | same-device self-control 쪽으로 가면 상대적으로 나아짐 |
| 직무발명/회사 귀속 리스크 | 4 | 고용/직무 관련성 여부가 출원 전략에 큰 영향을 줄 수 있음 |

---

## 전체 해석

### 단순 평균 관점
대략적인 실무 점수: **5.9 / 10**

### 전략적 해석
GhostHand는 **가망 없는 아이디어는 아니다.**
하지만 **넓게 출원하면 쉬운 특허도 아니다.**

프로젝트가 강해지는 조건은 다음과 같다.
- 청구항을 좁힐 것
- same-device self-control 구조를 강조할 것
- 공개 리스크를 관리할 것
- 직무발명/권리 귀속 문제를 먼저 정리할 것

---

## 항목별 설명

### 1. 신규성 — 6/10
넓게 보면 공개 GitHub 사례가 이미 존재하므로 신규성이 약해질 수 있다.
하지만 다음과 같은 좁은 방향에서는 여지가 남아 있다.
- 동일 단말 자기제어
- 단말 내부 로컬 실행 환경
- 빌드-설치-실행-제어 통합 루프
- 검증/fallback
- 민감 작업 확인 경계

### 2. 진보성 — 5/10
넓은 영역에서는 공개기술과 겹침이 크다.
따라서 개별 요소보다, 그 조합과 운용 구조를 강조해야 한다.

### 3. 기술 구체성 — 8/10
GhostHand는 단순 아이디어가 아니라 구현 가능한 구조와 실제 동작 흐름을 갖고 있다.

### 4. 프로토타입/실증성 — 9/10
이건 GhostHand의 큰 강점이다.
same-device ADB 루프, 안드로이드 앱 빌드/설치/실행, 실제 명령 수행까지 입증되어 있다.

### 5. 문서화 수준 — 9/10
현 단계 프로젝트치고는 문서화가 상당히 잘 되어 있다.
이건 특허 검토, 내부 검토, 협업 측면에서 매우 유리하다.

### 6. 특허 전략 준비도 — 7/10
이미 변리사와 논의 가능한 수준으로 접근하고 있지만, 청구항은 더 좁게 다듬을 필요가 있다.

### 7. 공개 리스크 — 3/10
현재 가장 약한 부분 중 하나다.
유사 공개기술이 이미 있고, GhostHand 자체도 공개 문서가 있기 때문에 출원 자유도가 줄어들 수 있다.

### 8. 넓은 청구항 방어력 — 2/10
다음과 같은 넓은 표현은 매우 약하다.
- AI가 안드로이드를 제어한다
- 자연어 기반 모바일 자동화
- ADB 기반 모바일 제어

### 9. 좁은 청구항 방어력 — 6/10
v2/v3처럼 same-device self-control 중심으로 좁힌 방향은 훨씬 낫다.

### 10. 직무발명/회사 귀속 리스크 — 4/10
이건 기술 문제라기보다 출원 전략 리스크다.
고용 범위나 회사 과제와 연결되면 권리 귀속이 복잡해질 수 있다.

---

## 실무 결론

### 현재 체감 전망
대략 이런 느낌으로 볼 수 있다.
- **넓게 출원:** 약함
- **좁게 잘 정리해서 출원:** 중간 정도 승산 있음

퍼센트 감각으로 억지로 표현하면,
현재 GhostHand는 대략:

> **35% ~ 55% 정도 승산이 있는 편**

이라고 보는 것이 가장 현실적이다.
다만 이 수치는 법률적 확률이 아니라 전략적 체감치다.

---

## 추천 다음 단계

1. 청구항을 계속 좁히기
2. same-device self-control 스토리를 더 강화하기
3. 디버깅, 자기제어, 모바일 런타임 실행 축으로 선행기술 검토 계속하기
4. 공개 리스크 점검하기
5. 출원 전 직무발명/회사 귀속 여부 먼저 확인하기
6. 필요하면 변리사 제출용 문서를 더 정리하기
