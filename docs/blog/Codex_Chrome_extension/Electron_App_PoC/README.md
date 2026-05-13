# Electron App PoC: G마켓 검색 및 정렬 자동화

이 폴더는 2번째 실습이었던 `G마켓에서 "무선 마우스" 검색 -> 상품평 많은순 정렬 -> 검색 결과 확인` 흐름을 Electron 앱으로 포장한 PoC입니다.

## 목표

Codex + Chrome Extension + Recorder로 검증한 브라우징 자동화 흐름을, Codex 없이도 실행할 수 있는 버튼형 데스크톱 앱 형태로 옮기는 예제입니다.

## 자동화 범위

- G마켓 접속
- 검색어 입력
- 검색 실행
- 정렬 목록 열기
- 지정 정렬 옵션 클릭
- 최종 URL과 페이지 제목 확인
- 결과 스크린샷 저장

## 안전 조건

이 PoC는 다음 행동을 하지 않습니다.

- 상품 상세 페이지 진입
- 장바구니 담기
- 구매
- 결제
- 로그인 정보 입력

## 실행 방법

```bash
npm install
npm run install:browsers
npm start
```

## 구성

```text
src/main.js
Electron 메인 프로세스와 IPC 처리

src/preload.js
Renderer에서 사용할 안전한 API 노출

src/renderer.js
화면 이벤트 처리와 상태 표시

src/automation/gmarket.js
Playwright 기반 G마켓 자동화 로직
```

## 실습 흐름과의 대응

Recorder에서 확인한 핵심 selector는 다음과 같습니다.

```text
#form__search-keyword
div.box__head-search button
div.box__sort-control-selected > button
div.box__control-area li:nth-of-type(5) > a
```

PoC에서는 기본 검색어를 `무선 마우스`, 기본 정렬을 `상품평 많은순`으로 둡니다. 정렬 적용 여부는 URL에 `s=13` 파라미터가 붙는지 확인합니다.
