# scrrec.md

## 개요
Android 단말 화면 녹화는 ADB의 기본 `screenrecord` 기능으로 수행할 수 있다.
별도 앱 설치 없이 무선 ADB 또는 USB ADB 연결 상태에서 바로 사용할 수 있다.

---

## 기본 녹화 명령
```bash
adb shell screenrecord --time-limit 10 /sdcard/plm_10s.mp4
```

### 의미
- `adb shell screenrecord` : 단말에서 화면 녹화 실행
- `--time-limit 10` : 10초 동안 녹화
- `/sdcard/plm_10s.mp4` : 단말 내부 저장 경로

---

## 로컬로 가져오기
녹화가 끝난 뒤 단말 내부 파일을 로컬 PC/Termux 작업 폴더로 복사한다.

```bash
adb pull /sdcard/plm_10s.mp4 ~/PRJs/GhostHand/examples/plm/videos/plm_10s.mp4
```

---

## 단말 임시 파일 정리
로컬로 복사한 뒤 단말 내부 임시 파일은 삭제할 수 있다.

```bash
adb shell rm /sdcard/plm_10s.mp4
```

---

## 전체 예시 흐름
```bash
adb shell screenrecord --time-limit 10 /sdcard/plm_10s.mp4
adb pull /sdcard/plm_10s.mp4 ~/PRJs/GhostHand/examples/plm/videos/plm_10s.mp4
adb shell rm /sdcard/plm_10s.mp4
```

---

## 장점
- 별도 녹화 앱 설치 불필요
- ADB 연결만 되어 있으면 바로 사용 가능
- 짧은 데모 영상, 증빙 영상 저장에 적합
- 자동화 스크립트에 쉽게 포함 가능

---

## 제한사항
- 기본적으로 내부 오디오 녹화는 제한될 수 있음
- 장시간 녹화 시 파일 크기가 커질 수 있음
- 무선 ADB 상태가 불안정하면 전송 실패 가능성이 있음
- 실시간 방송보다는 짧은 시연 영상 저장에 적합

---

## PLM 예시 경로
- 저장 폴더: `~/PRJs/GhostHand/examples/plm/videos`
- 예시 파일: `plm_10s.mp4`

---

## 참고
실무에서는 다음 흐름으로 사용하는 것이 편하다.
1. ADB 연결 확인
2. `screenrecord`로 단말 녹화
3. `adb pull`로 로컬 저장
4. 필요 시 GitHub에 업로드
