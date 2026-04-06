# Claim Overlap Check v1

## Summary
This note records a first KIPRIS-based overlap check against the narrower GhostHand patent claim direction (v2).

The goal is not to make a final legal conclusion, but to identify whether currently visible KIPRIS results show documents that appear to be structurally close to the rewritten claims.

---

## Search basis
The v2 claim direction was centered on:
- same-device self-control
- local on-device execution environment
- wireless debugging bridge
- verification of execution result
- fallback / retry
- integrated build-install-launch-control loop

To approximate overlap risk, the following KIPRIS search axes were used:
- `자연어 + 단말`
- `에이전트 + 단말`
- `앱 + 제어`

---

## Current result

### English
No document was found that appears, at this stage, to directly and fully overlap with the current GhostHand claim v2 structure.

However, a non-trivial overlap risk exists in the general area of:
- natural language command interpretation
- intelligent agent selection or management
- terminal/device control

This means the claim direction should continue to avoid broad language and keep emphasizing the more specific same-device and local execution structure.

### 한국어
현재까지의 KIPRIS 결과 기준으로는 GhostHand 청구항 v2 구조와 직접적이고 전면적으로 겹치는 문헌은 아직 확인되지 않았다.

다만 아래 축에서는 의미 있는 겹침 위험이 존재한다.
- 자연어 명령 해석
- 지능형 에이전트 선택 또는 관리
- 단말/기기 제어

따라서 청구항 방향은 넓은 표현을 피하고, 동일 단말 자기제어 및 단말 내부 로컬 실행 구조를 계속 강조해야 한다.

---

## Candidate 1

### English
**Title:** 복수의 지능형 에이전트를 관리하는 전자 장치 및 그의 동작 방법  
**Application Number:** 1020190095059  
**Open Number:** 1020210016815  
**Register Number:** 1029489250000  
**Applicant:** 삼성전자주식회사

**Observed overlap:**
- natural language / voice-based interpretation
- intelligent agent selection or management
- device control flow

**Observed difference:**
- appears centered on managing multiple intelligent agents and external-server-related routing
- does not appear, based on the current abstract, to focus on a same-device self-control architecture with local runtime and debugging-bridge execution

**Preliminary overlap risk:** Medium

### 한국어
**제목:** 복수의 지능형 에이전트를 관리하는 전자 장치 및 그의 동작 방법  
**출원번호:** 1020190095059  
**공개번호:** 1020210016815  
**등록번호:** 1029489250000  
**출원인:** 삼성전자주식회사

**겹치는 부분:**
- 자연어/음성 기반 해석
- 지능형 에이전트 선택 또는 관리
- 단말 제어 흐름

**차이점:**
- 복수 에이전트 관리 및 외부 서버 연동 성격이 강해 보임
- 동일 단말 내부 self-control, 로컬 실행 환경, 디버깅 브리지 실행 중심 구조는 현재 초록상 직접 확인되지 않음

**예비 중복 위험:** 중간

---

## Candidate 2

### English
**Title:** 마스킹 기반 자연어 생성 장치 및 그 장치의 구동방법  
**Application Number:** 1020250058961  
**Register Number:** 1029440160000  
**Applicant:** 주식회사 제논

**Observed overlap:**
- terminal-side use of LLM/VLM
- natural language processing context

**Observed difference:**
- appears focused on masked natural language generation rather than same-device device-control execution
- no direct indication of wireless debugging control or local same-device control loop

**Preliminary overlap risk:** Low to Medium

### 한국어
**제목:** 마스킹 기반 자연어 생성 장치 및 그 장치의 구동방법  
**출원번호:** 1020250058961  
**등록번호:** 1029440160000  
**출원인:** 주식회사 제논

**겹치는 부분:**
- 단말 측 LLM/VLM 활용
- 자연어 처리 구조

**차이점:**
- 자연어 생성/응답 처리 중심으로 보이며, 동일 단말 제어 실행 구조는 직접 보이지 않음
- 무선 디버깅 제어 또는 same-device 제어 루프는 현재 초록상 확인되지 않음

**예비 중복 위험:** 낮음~중간

---

## Candidate 3

### English
Results from the `앱 + 제어` query did not yet show a document that looks structurally close to the GhostHand v2 claim direction. Most returned documents appeared to be centered on app/service operation or platform-side control rather than same-device AI self-control.

**Preliminary overlap risk:** Low

### 한국어
`앱 + 제어` 검색 결과에서는 GhostHand 청구항 v2와 구조적으로 가까워 보이는 문헌이 아직 뚜렷하지 않았다. 다수 문헌은 앱/서비스 운영 또는 플랫폼 측 제어 중심으로 보였고, 동일 단말 AI 자기제어 구조와는 거리가 있었다.

**예비 중복 위험:** 낮음

---

## Current practical conclusion

### English
The current KIPRIS-based overlap check suggests that the revised GhostHand claim direction is not obviously blocked by a directly matching document, at least from the first-pass abstract-level review.

However, overlap risk becomes meaningful when the claim is written too broadly around:
- natural language control
- intelligent agents
- mobile device control

So the practical strategy should be:
- keep claims narrow
- emphasize same-device execution
- emphasize local runtime + debugging bridge
- emphasize verification/fallback
- emphasize integrated build-install-launch-control loop where useful

### 한국어
현재 KIPRIS 기반 1차 중복 점검 결과만 보면, 수정된 GhostHand 청구항 방향은 초록 수준 검토에서 즉시 막힐 정도의 직접 일치 문헌은 아직 보이지 않는다.

다만 아래 요소를 넓게 쓰면 겹침 위험이 커진다.
- 자연어 제어
- 지능형 에이전트
- 모바일 단말 제어

따라서 실무적으로는 다음 전략이 필요하다.
- 청구항을 좁게 유지
- 동일 단말 실행 구조 강조
- 로컬 실행 환경 + 디버깅 브리지 강조
- 검증/fallback 강조
- 필요 시 빌드·설치·실행·제어 통합 루프 강조

---

## Suggested next step

### English
Run a narrower 4th-pass search using concepts closer to:
- self-control
- same-device
- local execution environment
- debugging interface
- integrated mobile build/install/control

### 한국어
다음 단계에서는 아래 개념어에 가까운 4차 좁은 검색이 필요하다.
- 자기제어
- 동일 단말
- 로컬 실행 환경
- 디버깅 인터페이스
- 모바일 빌드/설치/제어 통합
