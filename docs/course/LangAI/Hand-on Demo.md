# Hand-on Demo

## 개요
이 문서는 LangAI 실습 수강생들이 **휴대폰에서 최대한 쉽게 따라할 수 있도록**,
각 단계에서 필요한 명령어를 바로 **복붙해서 실행할 수 있게** 정리한 실습 가이드입니다.

가능한 한 설명은 짧게,
명령어는 바로 실행 가능한 형태로 코드블록에 정리했습니다.

---

## 1. Termux 설치

### 1.1 어디서 받나
스마트폰 브라우저에서 F-Droid 공식 사이트에 접속해 Termux를 다운로드합니다.

- <https://f-droid.org/en/packages/com.termux/>

### 1.2 설치
- F-Droid 페이지에서 APK 다운로드
- 스마트폰에서 설치 진행
- 설치 후 Termux 실행

---

## 2. 초기 준비
기본 패키지를 최신 상태로 맞춰주는 과정입니다.

### 2.1 패키지 업데이트
```bash
pkg update && pkg upgrade -y
```

### 2.2 기본 도구 설치
```bash
pkg install -y nodejs git curl cmake make clang binutils python
```

### 2.3 설치 확인
```bash
node -v
git --version
```

### 2.4 네트워크 인터페이스 설정
```bash
cat > /data/data/com.termux/files/usr/bin/ifconfig << 'EOF'
#!/data/data/com.termux/files/usr/bin/sh
echo "lo: flags=73<UP,LOOPBACK,RUNNING> mtu 65536"
echo " inet 127.0.0.1 netmask 255.0.0.0"
echo " loop txqueuelen 1000 (Local Loopback)"
EOF
chmod +x /data/data/com.termux/files/usr/bin/ifconfig
```

---

## 3. OpenClaw 설치

### 3.1 텔레그램 의존성 패키지 설치
```bash
npm install grammy
npm install @grammyjs/runner
npm install @grammyjs/transformer-throttler
```

### 3.2 오픈클로 설치
```bash
npm install -g openclaw@2026.4.2
```

### 3.3 설치 확인
```bash
openclaw --version
```

---

## 4. 온보드 설정 (onboard)
오픈클로 처음 시작할 때 필요한 환경을 설정하는 과정입니다.

### 4.1 온보드 실행
```bash
openclaw onboard
```

### 4.2 LLM 연결
다음 항목을 선택합니다.

- OpenAI
- OpenAI Codex
- OAuth URL

### 4.3 통신 채널 설정
다음 항목을 선택합니다.

- Telegram (Bot API)
- 봇 토큰 복붙

### 4.4 Search 설정
다음 항목을 선택합니다.

- DuckDuckGo Search

### 4.5 Skills 설정
- Skip for now

### 4.6 Enable hooks
- Skip for now

---

## 5. OpenClaw 실행
```bash
openclaw gateway
```

---

## 6. WebUI에서 첫 대화하기

### 6.1 접속 URL 확인하기
```bash
openclaw dashboard
```

### 6.2 브라우저 주소창에 복사한 주소 붙여넣기
- `openclaw dashboard` 실행 후 나온 주소를 복사
- 브라우저 주소창에 붙여넣기

### 6.3 첫 대화하기
- WebUI 접속 후 간단한 메시지 입력
- 예: `안녕, 잘 들리니?`

### 6.4 스마트폰 무선 연결 실습
WebUI 대화가 성공했다면,
이제 OpenClaw 실행 환경과 스마트폰을 연결해서 실습을 확장할 수 있습니다.

#### 스마트폰에서 먼저 할 일
1. 개발자 옵션 켜기
2. 무선 디버깅 켜기
3. 무선 디버깅 화면에서 아래 3가지를 확인
   - 페어링용 IP 주소
   - 페어링용 포트 번호
   - 페어링 코드
4. 같은 화면 또는 연결 정보에서
   - 연결용 IP 주소
   - 연결용 포트 번호
   도 확인

#### Termux에서 adb 도구 설치
```bash
pkg install -y android-tools
```

#### 설치 확인
```bash
adb version
```

#### 페어링 실행
아래 형식으로 입력합니다.
```bash
adb pair IP:포트
```

예시:
```bash
adb pair 192.168.0.10:37123
```

실행 후 스마트폰 화면에 보이는 **페어링 코드**를 입력합니다.

#### 스마트폰 연결 실행
아래 형식으로 입력합니다.
```bash
adb connect IP:포트
```

예시:
```bash
adb connect 192.168.0.10:37655
```

#### 연결 확인
```bash
adb devices
```

예시 출력:
```text
List of devices attached
192.168.0.10:5555  device
```

여기까지 되면 스마트폰이 OpenClaw 실행 환경과 연결된 것입니다.
이후에는 앱 실행, 입력 자동화, 화면 제어, 테스트 흐름 자동화 같은 실습으로 확장할 수 있습니다.

#### 연결이 안 될 때 체크할 것
- 스마트폰과 Termux 실행 환경이 같은 네트워크에 연결되어 있는지
- 무선 디버깅이 계속 켜져 있는지
- 페어링용 주소와 연결용 주소를 서로 헷갈리지 않았는지
- pairing code를 정확히 입력했는지
- adb가 Termux에 정상 설치되었는지

---

## 7. 텔레그램 연결하기

### 7.1 BotFather에서 newbot 생성
진행 순서:
- BotFather 열기
- `/newbot` 입력
- 봇 이름 입력
- 봇 ID 입력
- 발급된 봇 토큰 저장

### 7.2 페어링
예시:

- Your Telegram user id: `5440299023`
- Pairing code: `D8VZWJMF`

봇 오너 승인 명령:
```bash
openclaw pairing approve telegram D8VZWJMF
```

복붙용:
```bash
openclaw pairing approve telegram D8VZWJMF
```

### 7.3 연결 확인
- 텔레그램에서 봇에게 메시지 보내기
- OpenClaw가 응답하는지 확인

---

## 8. 실습용 핵심 명령어 모음
아래 명령어만 모아서 다시 정리합니다.

### 패키지 업데이트
```bash
pkg update && pkg upgrade -y
```

### 기본 도구 설치
```bash
pkg install -y nodejs git curl cmake make clang binutils python
```

### ifconfig 스크립트 생성
```bash
cat > /data/data/com.termux/files/usr/bin/ifconfig << 'EOF'
#!/data/data/com.termux/files/usr/bin/sh
echo "lo: flags=73<UP,LOOPBACK,RUNNING> mtu 65536"
echo " inet 127.0.0.1 netmask 255.0.0.0"
echo " loop txqueuelen 1000 (Local Loopback)"
EOF
chmod +x /data/data/com.termux/files/usr/bin/ifconfig
```

### 텔레그램 의존성 설치
```bash
npm install grammy
npm install @grammyjs/runner
npm install @grammyjs/transformer-throttler
```

### OpenClaw 설치
```bash
npm install -g openclaw@2026.4.2
```

### 버전 확인
```bash
openclaw --version
```

### 온보드 실행
```bash
openclaw onboard
```

### 게이트웨이 실행
```bash
openclaw gateway
```

### 대시보드 URL 확인
```bash
openclaw dashboard
```

### 텔레그램 페어링 승인
```bash
openclaw pairing approve telegram D8VZWJMF
```
