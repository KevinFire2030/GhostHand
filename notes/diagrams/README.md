# Architecture Comparison Diagram Drafts

목적: 직무발명 문서에서 **본발명은 단말 내부에 제어 주체와 제어 경로가 함께 존재한다**는 점을 직관적으로 보여주기 위한 Mermaid 시안 모음.

## Files
- `architecture-comparison-v1.md`
  - 가장 단순한 비교도
  - 핵심 메시지: 선행은 밖, 본발명은 안

- `architecture-comparison-v2.md`
  - 폐루프 구조 강조형
  - 핵심 메시지: 단말 내부에서 해석 → 실행 → 검증 → 재시도

- `architecture-comparison-v3.md`
  - "단말 안에 다 들어 있네" 인상 강조형
  - 핵심 메시지: 단말 하나로 구성되는 자기제어 구조

## 추천
- 문서 본문 삽입용 1순위: `architecture-comparison-v3.md`
- 기술 설명 보강용 2순위: `architecture-comparison-v2.md`
- 가장 단순한 비교 표기용: `architecture-comparison-v1.md`
