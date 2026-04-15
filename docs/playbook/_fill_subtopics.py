from pathlib import Path

base = Path(r"E:\ax\PRJs\GhostHand\docs\playbook")

subtopics = {
    "1장. AI는 왜 ‘앱’을 넘어 ‘에이전트’로 가는가": ["AI의 진화: 도구 → 비서 → 에이전트", "AX (Agent Experience)의 등장", "기존 모바일 UX의 한계"],
    "2장. 내 스마트폰이 곧 AI 플랫폼이 되는 시대": ["클라우드 vs 온디바이스 AI", "개인화된 AI의 필요성", "나만의 OS로서의 스마트폰"],
    "3장. AX란 무엇인가": ["AX 정의와 핵심 개념", "UX / DX와의 차이", "AX 설계 원칙"],
    "4장. 전체 아키텍처 개요": ["모바일 에이전트 구조", "플랫폼 vs 프레임워크 vs 서비스", "OpenClaw 기반 구조"],
    "5장. 실행 환경 구축 (Termux + OpenClaw)": ["Termux(텀럭스) 환경 구성", "OpenClaw vs PicoClaw 비교", "모바일에서 AI 실행하기"],
    "6장. 에이전트의 두뇌 만들기 (RAG)": ["RAG 구조 이해", "OpenDocuments 활용", "개인 지식베이스 구축"],
    "7장. Tools: 스마트폰을 제어하는 힘": ["Wireless ADB 구조", "단말 제어 전략", "API vs 직접 제어"],
    "8장. Skills와 Agent 설계": ["스킬 기반 에이전트 구조", "작업 분해 방법", "하네스(Harness) 설계"],
    "9장. 인터페이스 만들기": ["Web UI (Streamlit)", "메신저 인터페이스 (텔레그램, 슬랙)", "음성 인터페이스 확장"],
    "10장. AX 기획 방법론": ["디자인 씽킹", "5D 프로세스 (Define–Discover–Design–Develop–Deploy)", "AX 서비스 기획"],
    "11장. 개발 스택": ["Python (Streamlit, FastAPI)", "Node.js", "APK 빌드 & WebView"],
    "12장. 배포와 운영": ["Web 배포 전략", "APK 배포", "AaaS (Agent as a Service)", "n8n 자동화"],
    "13장. 자동화 전략 (Vibe Coding)": ["자동화 설계 패턴", "n8n 활용", "이벤트 기반 시스템"],
    "14장. 단말 제어 시스템 설계": ["Ghost Hand 개념", "권한과 보안", "실행 흐름"],
    "15장. 스마트폰 자동화 사례": ["알람 설정", "테마 변경", "앱 설치/삭제", "앱 실행 자동화", "설정 제어"],
    "16장. 하루의 시작을 바꾸다 (05:00–08:00)": ["기상 자동화", "데일리 브리핑", "출근 루틴 자동화"],
    "17장. 생활 자동화": ["피트니스 AI 트레이너", "식단 관리", "커피 자동 주문"],
    "18장. 밤의 자동화 (21:00–23:00)": ["크론 기반 자동화", "뉴스/정보 수집", "자동 투자 시스템"],
    "19장. 업무 시작 자동화 (09:00)": ["메일 요약", "일정 자동 생성"],
    "20장. 회의와 커뮤니케이션 자동화": ["녹음 → 회의록", "통화 요약", "메시지 자동화"],
    "21장. 문서 생산 자동화": ["보고서 작성", "발표자료 생성", "기술 문서 생성"],
    "22장. 지식 노동의 자동화": ["특허 작성", "리서치 자동화", "PoC 생성"],
    "23장. 스마트폰 내장 AI vs 나만의 에이전트": ["S26 AI vs OpenClaw", "폐쇄형 vs 개방형", "확장성 비교"],
    "24장. 배포 전략": ["GitHub", "npm", "오픈소스 전략"],
    "25장. 문서화": ["README 작성법", "매뉴얼 구조", "플레이북 설계"],
    "26장. 브랜딩과 마케팅": ["세계 최초 모바일 에이전트 플랫폼", "Invisible Hand 개념", "콘텐츠 전략 (유튜브, 인스타, GeekNews)"],
    "27장. 라이선스 전략": ["오픈소스 vs 상용화", "수익 모델"],
    "28장. 개인 AI OS의 시대": [],
    "29장. 인간 + 에이전트 협업 구조": [],
    "30장. 당신의 삶을 재설계하라": [],
}

for path in base.rglob('*.md'):
    if path.name == 'README.md':
        continue
    title = path.stem.replace('_', ': ')
    topics = subtopics.get(title, [])
    lines = [f'# {title}', '']
    if topics:
        lines.append('## 소목차')
        lines.append('')
        for topic in topics:
            lines.append(f'- {topic}')
        lines.append('')
    else:
        lines.append('## 소목차')
        lines.append('')
        lines.append('- 추후 작성 예정')
        lines.append('')

    path.write_text('\n'.join(lines), encoding='utf-8')

print('done')
