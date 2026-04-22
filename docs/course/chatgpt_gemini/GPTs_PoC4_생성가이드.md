# GPTs_PoC4 생성 가이드

아래 내용은 ChatGPT의 **새 GPT 만들기** 화면에서,
사용자가 HeyGen 아바타로 생성하고자 하는 영상의 텍스트를 입력하면,
HeyGen API를 호출해 아바타 영상을 생성하고,
최종적으로 **생성된 영상 URL을 반환하는 GPTs**를 만들기 위한 가이드입니다.

---

## 1. 시나리오

### 1-1. 입력
- 사용자가 HeyGen 아바타로 생성하고자 하는 영상의 텍스트를 입력

### 1-2. 처리
- 새 GPT → 작업 → 새 작업 만들기
- 아래 파일을 참조하여 스키마에 들어갈 내용 작성
  - `examples/HeyGen/HeyGen_API_사용법.md`
  - `examples/HeyGen/create_avatar_video.py`
- `.env` 기준 입력값
  - `HEYGEN_API_KEY=sk_V2_hgu_kUQLz5Th8iX_GvcMxAM8zHbPUJ9XC0hgQd5onEY0dX4K`
  - `HEYGEN_AVATAR_ID=be60bd7e114e49a1bd6ce1a216106520`
  - `HEYGEN_VOICE_ID=724be9f77cde4d918a1d6138df24adb9`
  - `HEYGEN_INPUT_TEXT=안녕하세요. HeyGen API를 활용한 아바타 영상 생성 테스트입니다.`

### 1-3. 출력
- 생성된 아바타 영상의 URL 리턴

---

## 2. GPT 만들기 기본 방향
이 GPT는 단순 질의응답용이 아니라,
**외부 Action을 호출해서 실제 HeyGen API를 실행하는 GPT**입니다.

즉 사용자가 문장을 입력하면,
GPT가 그 문장을 Action에 전달하고,
HeyGen API가 아바타 영상을 생성한 뒤,
최종적으로 영상 URL을 돌려주는 흐름입니다.

---

## 3. 새 GPT 화면 입력 가이드

### 3-1. 이름
```text
HeyGen 아바타 영상 생성 GPT
```

### 3-2. 설명
```text
입력한 텍스트를 HeyGen 아바타 영상으로 생성하고 결과 영상 URL을 반환하는 GPT
```

### 3-3. 지침
아래 내용을 그대로 넣어도 됩니다.

```text
이 GPT의 목적은 사용자가 입력한 텍스트를 HeyGen 아바타 영상으로 생성하고, 최종적으로 생성된 영상 URL을 반환하는 것이다.

이 GPT는 다음과 같이 동작한다.
1. 사용자가 영상으로 만들고 싶은 텍스트를 입력한다.
2. GPT는 HeyGen 영상 생성 Action을 호출한다.
3. Action 호출 시 avatar_id, voice_id, input_text를 전달한다.
4. 영상 생성이 완료되면 결과 video_url을 사용자에게 반환한다.

이 GPT는 아래 원칙을 반드시 지켜야 한다.
- 사용자가 입력한 문장을 그대로 또는 필요한 최소한의 정리만 거쳐 Action에 전달한다.
- 영상 생성 결과가 준비되면 video_url을 가장 먼저 보여준다.
- 실패 시에는 에러 내용을 숨기지 말고 간단히 설명한다.
- API 키 같은 민감한 값은 사용자에게 노출하지 않는다.

이 GPT가 해서는 안 되는 것은 아래와 같다.
- API 키를 대화창에 출력하지 않는다.
- 생성되지 않은 URL을 임의로 만들어서 답하지 않는다.
- 사용자가 입력하지 않은 문장을 임의로 추가해서 영상 내용을 바꾸지 않는다.
```

### 3-4. 대화 스타터
```text
안녕하세요. HeyGen 아바타 영상 생성 테스트입니다.
```

```text
제품 소개 영상을 만들 수 있도록 30초 분량 멘트를 생성해줘.
```

```text
아래 문장으로 아바타 영상을 생성해줘.
```

---

## 4. 작업(Action) 추가 가이드

새 GPT 화면에서 아래 순서로 진행합니다.

1. **작업 추가** 클릭
2. **인증**: 없음
3. **스키마** 입력
4. 필요한 경우 개인정보 보호 정책 URL 입력

핵심은 **OpenAPI 스키마**를 넣는 것입니다.

---

## 5. Action 설계 개념
이번 PoC에서는 ChatGPT Action이 직접 HeyGen API를 호출하도록 설계합니다.

참고 파일 기준 핵심 API 흐름은 아래와 같습니다.
- 영상 생성 요청: `POST https://api.heygen.com/v2/video/generate`
- 상태 조회: `GET https://api.heygen.com/v1/video_status.get?video_id=...`

다만 GPT Action은 비동기 polling 처리가 번거로울 수 있으므로,
PoC 설명용으로는 아래 두 가지 방식 중 하나로 안내하면 좋습니다.

### 방식 A. 생성 요청만 하고 video_id 반환
- 장점: 스키마 단순
- 단점: 최종 video_url을 바로 못 받음

### 방식 B. 중간 래퍼 API를 하나 두고 최종 video_url 반환
- 장점: GPT 입장에서는 한 번 호출로 결과 URL 수령 가능
- 단점: 중간 서버가 필요

전하가 요청하신 최종 목표가 **생성된 아바타 영상의 URL 리턴**이므로,
실전에서는 **방식 B(래퍼 API)** 가 더 적합합니다.

하지만 지금 가이드 문서에서는,
HeyGen Direct API 구조를 이해할 수 있도록 **직접 호출 기준 스키마 예시**를 먼저 제공합니다.

---

## 6. OpenAPI 스키마 예시
아래는 새 GPT → 작업 → 스키마에 넣을 수 있는 예시입니다.

```yaml
openapi: 3.1.0
info:
  title: HeyGen Avatar Video Generator
  version: 1.0.0
  description: 사용자가 입력한 텍스트로 HeyGen 아바타 영상을 생성하는 API
servers:
  - url: https://api.heygen.com
paths:
  /v2/video/generate:
    post:
      operationId: createAvatarVideo
      summary: HeyGen 아바타 영상 생성
      description: avatar_id, voice_id, input_text를 받아 아바타 영상 생성을 요청한다.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - video_inputs
                - dimension
              properties:
                video_inputs:
                  type: array
                  items:
                    type: object
                    properties:
                      character:
                        type: object
                        properties:
                          type:
                            type: string
                            example: avatar
                          avatar_id:
                            type: string
                            example: be60bd7e114e49a1bd6ce1a216106520
                          avatar_style:
                            type: string
                            example: normal
                      voice:
                        type: object
                        properties:
                          type:
                            type: string
                            example: text
                          voice_id:
                            type: string
                            example: 724be9f77cde4d918a1d6138df24adb9
                          input_text:
                            type: string
                            example: 안녕하세요. HeyGen API를 활용한 아바타 영상 생성 테스트입니다.
                      background:
                        type: object
                        properties:
                          type:
                            type: string
                            example: color
                          value:
                            type: string
                            example: '#f6f6f6'
                dimension:
                  type: object
                  properties:
                    width:
                      type: integer
                      example: 1280
                    height:
                      type: integer
                      example: 720
      responses:
        '200':
          description: 영상 생성 요청 성공
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: object
                    properties:
                      video_id:
                        type: string
                        example: 1234567890
  /v1/video_status.get:
    get:
      operationId: getVideoStatus
      summary: HeyGen 영상 생성 상태 조회
      description: video_id를 받아 영상 생성 상태 및 video_url을 조회한다.
      parameters:
        - name: video_id
          in: query
          required: true
          schema:
            type: string
      responses:
        '200':
          description: 상태 조회 성공
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: object
                    properties:
                      status:
                        type: string
                        example: completed
                      video_url:
                        type: string
                        example: https://resource.heygen.com/video.mp4
components:
  securitySchemes:
    XApiKey:
      type: apiKey
      in: header
      name: X-Api-Key
security:
  - XApiKey: []
```

---

## 7. Action 입력 시 주의사항

### 7-1. 인증
새 GPT 화면에서 인증을 "없음"으로 두더라도,
OpenAPI 스키마 안에는 `X-Api-Key` header 구조를 포함할 수 있습니다.
다만 실제 ChatGPT Actions 환경에서는 인증값 주입 방식이 따로 필요할 수 있어,
실전에서는 중간 래퍼 API를 두는 편이 더 안정적입니다.

### 7-2. Direct API vs Wrapper API
- HeyGen Direct API를 GPT Action에 바로 연결하면 상태 조회까지 두 번 호출해야 할 수 있습니다.
- 최종적으로 URL만 받고 싶다면,
  **중간 API**가 `create -> poll -> return video_url` 을 한 번에 처리하는 구조가 더 좋습니다.

### 7-3. 민감정보
전하가 주신 `.env` 값 중 아래 값은 민감정보입니다.
- `HEYGEN_API_KEY`

문서에는 예시로 들어갈 수 있지만,
실제 GPT 지침이나 공개 스키마 예시에는 **실제 키를 그대로 넣지 않는 것**을 권장합니다.

---

## 8. 추천 실제 사용 문구
사용자가 GPT에 아래처럼 말하면 됩니다.

```text
안녕하세요. HeyGen API를 활용한 아바타 영상 생성 테스트입니다.
```

또는

```text
다음 문장으로 아바타 영상을 생성해줘: 안녕하세요. 오늘은 신제품 소개 영상을 안내드리겠습니다.
```

GPT는 이 문장을 `input_text`로 넘기고,
설정된 `avatar_id`, `voice_id`를 사용해 영상을 생성하게 됩니다.

---

## 9. 최종 정리
이 GPT의 핵심 구조는 아래와 같습니다.

- 입력: 사용자가 영상용 텍스트 입력
- 처리: GPT Action이 HeyGen API 호출
- 출력: 생성된 아바타 영상 URL 반환

즉,
이 GPT는 **텍스트를 입력받아 HeyGen 아바타 영상으로 바꾸고, 최종 결과 URL을 돌려주는 자동화 GPT**로 설계하면 됩니다.

---

## 10. 한 줄 정리
`HeyGen 아바타 영상 생성 GPT`는 사용자가 입력한 문장을 HeyGen API에 전달하고, 최종적으로 생성된 영상 URL을 반환하도록 구성하면 됩니다.
