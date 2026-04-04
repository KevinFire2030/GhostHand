# Prior Art References

## English
Use this file to collect candidate prior-art documents found through KIPRIS, Google Patents, WIPO, or other sources.

Recommended fields:
- Title
- Number
- Source
- Applicant / Assignee
- Summary
- Overlap with GhostHand
- Difference from GhostHand
- Relevance score

### Initial KIPRIS sample review

Query used:
- invention title: `단말`
- abstract: `제어`
- rows: `10`
- source: KIPRIS `getAdvancedSearch`

#### Candidate 1
- **Title:** 디지털 단말기를 위한 스마트 엣지 플랫폼 및 스마트 엣지 플랫폼의 동작방법
- **Application Number:** 1020230128325
- **Open Number:** 1020230141712
- **Register Number:** 1029470340000
- **Applicant:** 주식회사 제오닉스
- **IPC:** H04L 67/00 | H04L 67/289 | H04L 67/51 | G06F 8/65 | G06N 3/02
- **Quick note:** Appears related to digital terminal management, application update, and control through a server-mediated platform.
- **Potential overlap with GhostHand:** device management and application control on a terminal.
- **Key difference from GhostHand:** likely centered on server/platform orchestration rather than an on-device AI agent controlling the same device through a local execution loop.
- **Preliminary relevance:** Medium

#### Candidate 2
- **Title:** 무선 통신의 방법 및 단말 장치
- **Application Number:** 1020227010701
- **Open Number:** 1020220076464
- **Register Number:** 1029437820000
- **Applicant:** 광동 오포 모바일 텔레커뮤니케이션즈 코포레이션 리미티드
- **IPC:** H04W 24/02 | H04W 48/08 | H04W 48/20 | H04W 28/06 | H04W 12/03 | H04W 12/04 | H04W 76/27 | H04W 80/02 | H04W 88/02
- **Quick note:** Appears focused on wireless communication procedures and terminal behavior.
- **Potential overlap with GhostHand:** terminal-side control logic in a mobile context.
- **Key difference from GhostHand:** likely network/protocol control rather than natural language driven same-device AI control.
- **Preliminary relevance:** Low to Medium

#### Candidate 3
- **Title:** 공사용 개폐기의 상태를 제어하는 사용자 단말의 상태 제어 방법
- **Application Number:** 1020250043724
- **Open Number:** 1020250052338
- **Register Number:** 1029434130000
- **Applicant:** 한국전력공사
- **IPC:** G01R 31/327 | G01R 23/20 | G01R 31/40 | H04M 1/725 | G01R 19/165 | G08B 21/18 | H02G 1/02 | G08C 17/02 | G16Y 40/10 | G16Y 40/30
- **Quick note:** A user terminal controls the state of an electrical switching device.
- **Potential overlap with GhostHand:** user-terminal-based control actions.
- **Key difference from GhostHand:** external equipment control, not same-device self-control architecture.
- **Preliminary relevance:** Low

### Current assessment
The initial KIPRIS sample confirms that broad keywords such as `단말` and `제어` return many terminal-related control documents, but many are too broad or belong to communication/control domains outside GhostHand's likely novelty zone.

This suggests the next KIPRIS search pass should narrow toward:
- on-device AI behavior
- software agent execution
- same-device control
- application launch / terminal UI control
- natural language or intent-based execution

---

## 한국어
이 파일은 KIPRIS, Google Patents, WIPO 등에서 찾은 선행기술 후보 문헌을 정리하는 용도다.

권장 항목:
- 제목
- 번호
- 출처
- 출원인 / 권리자
- 요약
- GhostHand와 겹치는 부분
- GhostHand와 다른 부분
- 관련성 점수

### 1차 KIPRIS 샘플 검토

사용한 검색 조건:
- 발명의명칭: `단말`
- 초록: `제어`
- rows: `10`
- 출처: KIPRIS `getAdvancedSearch`

#### 후보 1
- **제목:** 디지털 단말기를 위한 스마트 엣지 플랫폼 및 스마트 엣지 플랫폼의 동작방법
- **출원번호:** 1020230128325
- **공개번호:** 1020230141712
- **등록번호:** 1029470340000
- **출원인:** 주식회사 제오닉스
- **IPC:** H04L 67/00 | H04L 67/289 | H04L 67/51 | G06F 8/65 | G06N 3/02
- **간단 메모:** 디지털 단말 관리, 어플리케이션 업데이트 및 제어를 서버 기반 플랫폼으로 수행하는 내용으로 보인다.
- **GhostHand와 겹치는 부분:** 단말 관리, 어플리케이션 제어라는 큰 틀
- **GhostHand와 다른 부분:** 같은 단말 내부에서 동작하는 AI 에이전트의 자기제어보다는 서버/플랫폼 오케스트레이션에 가까워 보임
- **예비 관련성:** 중간

#### 후보 2
- **제목:** 무선 통신의 방법 및 단말 장치
- **출원번호:** 1020227010701
- **공개번호:** 1020220076464
- **등록번호:** 1029437820000
- **출원인:** 광동 오포 모바일 텔레커뮤니케이션즈 코포레이션 리미티드
- **IPC:** H04W 24/02 | H04W 48/08 | H04W 48/20 | H04W 28/06 | H04W 12/03 | H04W 12/04 | H04W 76/27 | H04W 80/02 | H04W 88/02
- **간단 메모:** 무선 통신 절차와 단말 동작에 관한 내용으로 보인다.
- **GhostHand와 겹치는 부분:** 모바일 단말 측 제어 논리라는 점
- **GhostHand와 다른 부분:** 자연어 기반 동일 단말 AI 제어보다는 네트워크/프로토콜 제어 영역에 가까움
- **예비 관련성:** 낮음~중간

#### 후보 3
- **제목:** 공사용 개폐기의 상태를 제어하는 사용자 단말의 상태 제어 방법
- **출원번호:** 1020250043724
- **공개번호:** 1020250052338
- **등록번호:** 1029434130000
- **출원인:** 한국전력공사
- **IPC:** G01R 31/327 | G01R 23/20 | G01R 31/40 | H04M 1/725 | G01R 19/165 | G08B 21/18 | H02G 1/02 | G08C 17/02 | G16Y 40/10 | G16Y 40/30
- **간단 메모:** 사용자 단말이 외부 설비 상태를 제어하는 기술로 보인다.
- **GhostHand와 겹치는 부분:** 사용자 단말 기반 제어라는 점
- **GhostHand와 다른 부분:** 동일 단말 자기제어가 아니라 외부 장치 제어 구조임
- **예비 관련성:** 낮음

### 현재 판단
이번 1차 KIPRIS 샘플 결과는 `단말`, `제어` 같은 넓은 키워드로는 단말 관련 제어 문헌이 많이 나오지만,
GhostHand의 차별성에 직접 맞닿는 문헌은 아직 많지 않을 가능성을 보여준다.

즉 다음 검색 단계에서는 더 좁혀야 한다.

추천 축:
- 온디바이스 AI 동작
- 소프트웨어 에이전트 실행
- 동일 단말 자기제어
- 앱 실행 / 단말 UI 제어
- 자연어 또는 의도 기반 실행
