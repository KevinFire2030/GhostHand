from pathlib import Path

base = Path(r"E:\ax\PRJs\GhostHand\docs\playbook")

mapping = {
    "PART 1. 왜 모바일 AI 에이전트인가 (개념 & 비전)": [
        "1장. AI는 왜 ‘앱’을 넘어 ‘에이전트’로 가는가.md",
        "2장. 내 스마트폰이 곧 AI 플랫폼이 되는 시대.md",
        "3장. AX란 무엇인가.md",
    ],
    "PART 2. 모바일 에이전트 플랫폼 구축": [
        "4장. 전체 아키텍처 개요.md",
        "5장. 실행 환경 구축 (Termux + OpenClaw).md",
        "6장. 에이전트의 두뇌 만들기 (RAG).md",
        "7장. Tools_ 스마트폰을 제어하는 힘.md",
        "8장. Skills와 Agent 설계.md",
        "9장. 인터페이스 만들기.md",
    ],
    "PART 3. AX 프레임워크 설계": [
        "10장. AX 기획 방법론.md",
        "11장. 개발 스택.md",
        "12장. 배포와 운영.md",
        "13장. 자동화 전략 (Vibe Coding).md",
    ],
    "PART 4. 고스트핸드 - 스마트폰을 대신 움직이는 AI": [
        "14장. 단말 제어 시스템 설계.md",
        "15장. 스마트폰 자동화 사례.md",
    ],
    "PART 5. 에이젠틱 라이프 - 일상의 재구성": [
        "16장. 하루의 시작을 바꾸다 (05_00–08_00).md",
        "17장. 생활 자동화.md",
        "18장. 밤의 자동화 (21_00–23_00).md",
    ],
    "PART 6. 에이젠틱 워크 - 업무의 재구성": [
        "19장. 업무 시작 자동화 (09_00).md",
        "20장. 회의와 커뮤니케이션 자동화.md",
        "21장. 문서 생산 자동화.md",
        "22장. 지식 노동의 자동화.md",
    ],
    "PART 7. 기존 AI와의 비교": [
        "23장. 스마트폰 내장 AI vs 나만의 에이전트.md",
    ],
    "PART 8. 제품화와 확장": [
        "24장. 배포 전략.md",
        "25장. 문서화.md",
        "26장. 브랜딩과 마케팅.md",
        "27장. 라이선스 전략.md",
    ],
    "PART 9. 미래 - 에이전트가 바꾸는 세상": [
        "28장. 개인 AI OS의 시대.md",
        "29장. 인간 + 에이전트 협업 구조.md",
        "30장. 당신의 삶을 재설계하라.md",
    ],
}

for part, files in mapping.items():
    part_dir = base / part
    part_dir.mkdir(parents=True, exist_ok=True)
    for name in files:
        path = part_dir / name
        if not path.exists():
            title = path.stem.replace('_', ': ')
            path.write_text(f"# {title}\n", encoding="utf-8")

print("done")
