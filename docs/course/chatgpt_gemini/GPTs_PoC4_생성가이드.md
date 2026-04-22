# GPTs_PoC4 생성 가이드

아래 내용은 ChatGPT의 **새 GPT 만들기** 화면에서,
사용자가 HeyGen 아바타로 생성하고자 하는 영상의 텍스트를 입력하면,
HeyGen API를 호출해 아바타 영상을 생성하고,
최종적으로 **생성된 영상 URL을 반환하는 GPTs**를 만들기 위한 최종 가이드입니다.

---

## 1. 시나리오

### 1-1. 입력
- 사용자가 HeyGen 아바타로 생성하고자 하는 영상의 텍스트를 입력

### 1-2. 처리
- 새 GPT → 작업 → 새 작업 만들기
- 아래 파일을 참조하여 스키마에 들어갈 내용 작성
  - `examples/HeyGen/HeyGen_API_사용법.md`
  - `examples/HeyGen/create_avatar_video.py`
- `.env` 기준 고정값
  - `HEYGEN_AVATAR_ID=be60bd7e114e49a1bd6ce1a216106520`
  - `HEYGEN_VOICE_ID=724be9f77cde4d918a1d6138df24adb9`
- 사용자가 입력한 문장을 `input_text`로 전달

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
3. Action 호출 시 고정된 avatar_id와 voice_id를 사용하고, 사용자가 입력한 문장을 input_text로 전달한다.
4. 영상 생성이 완료되면 결과 video_url을 사용자에게 반환한다.

이 GPT는 아래 원칙을 반드시 지켜야 한다.
- 사용자가 입력한 문장을 그대로 또는 필요한 최소한의 정리만 거쳐 Action에 전달한다.
- avatar_id는 반드시 be60bd7e114e49a1bd6ce1a216106520 를 사용한다.
- voice_id는 반드시 724be9f77cde4d918a1d6138df24adb9 를 사용한다.
- default_voice 같은 임시값이나 placeholder를 절대 사용하지 않는다.
- 영상 생성 결과가 준비되면 video_url을 가장 먼저 보여준다.
- 실패 시에는 에러 내용을 숨기지 말고 간단히 설명한다.
- API 키 같은 민감한 값은 사용자에게 노출하지 않는다.

이 GPT가 해서는 안 되는 것은 아래와 같다.
- API 키를 대화창에 출력하지 않는다.
- 생성되지 않은 URL을 임의로 만들어서 답하지 않는다.
- 사용자가 입력하지 않은 문장을 임의로 추가해서 영상 내용을 바꾸지 않는다.
- voice_id나 avatar_id에 임의의 값을 넣지 않는다.
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
2. **인증 유형**: API 키
3. **방식**: 맞춤형
4. **맞춤형 헤더 이름**: `X-Api-Key`
5. **스키마** 입력
6. 필요한 경우 개인정보 보호 정책 URL 입력

핵심은 **HeyGen 인증을 `X-Api-Key` 헤더 방식으로 맞추는 것**입니다.

---

## 5. Action 설계 개념
이번 PoC에서는 ChatGPT Action이 직접 HeyGen API를 호출하도록 설계합니다.

참고 파일 기준 핵심 API 흐름은 아래와 같습니다.
- 영상 생성 요청: `POST https://api.heygen.com/v2/video/generate`
- 상태 조회: `GET https://api.heygen.com/v1/video_status.get?video_id=...`

다만 GPT Action은 비동기 polling 처리가 번거로울 수 있으므로,
PoC 설명용으로는 아래 두 가지 방식 중 하나로 안내하면 좋습니다.

### 방식 A. 생성 요청 후 video_id 반환
- 장점: 스키마 단순
- 단점: 최종 video_url을 바로 못 받음

### 방식 B. 상태 조회까지 호출 후 video_url 반환
- 장점: 최종 URL 확인 가능
- 단점: GPT 또는 사용자가 한 번 더 상태 조회를 해야 할 수 있음

전하가 요청하신 최종 목표가 **생성된 아바타 영상의 URL 리턴**이므로,
실전에서는 중간 래퍼 API를 두고 `create -> poll -> return video_url` 을 한 번에 처리하는 구조가 가장 안정적입니다.

하지만 현재 가이드 문서는,
HeyGen Direct API 구조를 이해하고 바로 붙여볼 수 있도록 **직접 호출 기준 스키마 예시**를 제공합니다.

---

## 6. 실패 원인과 교정 포인트
실제 테스트 중 아래와 같은 실패가 발생할 수 있습니다.

예시 실패:
- `유효하지 않은 voice_id (default_voice)`
- `해당 음성이 존재하지 않습니다.`

이 오류는 GPT가 실제 voice_id 대신 `default_voice` 같은 placeholder를 넣었기 때문에 발생합니다.

해결 방법:
- `voice_id`를 example로만 두지 말고 **enum으로 고정**합니다.
- `avatar_id`도 같이 enum으로 고정합니다.
- 지침에도 실제 고정값 사용 규칙을 넣습니다.

즉, 이번 최종 스키마는
- `avatar_id = be60bd7e114e49a1bd6ce1a216106520`
- `voice_id = 724be9f77cde4d918a1d6138df24adb9`
를 **허용값 1개로 고정**한 버전입니다.

---

## 7. 최종 OpenAPI 스키마
아래는 새 GPT → 작업 → 스키마에 넣을 수 있는 최종 버전입니다.

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
      description: 고정된 avatar_id와 voice_id를 사용해 input_text 기반 아바타 영상을 생성한다.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/CreateAvatarVideoRequest"
      responses:
        "200":
          description: 영상 생성 요청 성공
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/CreateAvatarVideoResponse"

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
        "200":
          description: 상태 조회 성공
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/GetVideoStatusResponse"

components:
  schemas:
    CreateAvatarVideoRequest:
      type: object
      required:
        - video_inputs
        - dimension
      properties:
        video_inputs:
          type: array
          items:
            type: object
            required:
              - character
              - voice
            properties:
              character:
                type: object
                required:
                  - type
                  - avatar_id
                  - avatar_style
                properties:
                  type:
                    type: string
                    enum:
                      - avatar
                  avatar_id:
                    type: string
                    enum:
                      - be60bd7e114e49a1bd6ce1a216106520
                  avatar_style:
                    type: string
                    enum:
                      - normal
              voice:
                type: object
                required:
                  - type
                  - voice_id
                  - input_text
                properties:
                  type:
                    type: string
                    enum:
                      - text
                  voice_id:
                    type: string
                    enum:
                      - 724be9f77cde4d918a1d6138df24adb9
                  input_text:
                    type: string
                    description: 사용자가 영상으로 만들고 싶은 텍스트
                    example: 안녕하세요. HeyGen API를 활용한 아바타 영상 생성 테스트입니다.
              background:
                type: object
                properties:
                  type:
                    type: string
                    enum:
                      - color
                  value:
                    type: string
                    example: "#f6f6f6"
        dimension:
          type: object
          required:
            - width
            - height
          properties:
            width:
              type: integer
              enum:
                - 1280
            height:
              type: integer
              enum:
                - 720

    CreateAvatarVideoResponse:
      type: object
      properties:
        data:
          type: object
          properties:
            video_id:
              type: string
              example: "1234567890"

    GetVideoStatusResponse:
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

  securitySchemes:
    XApiKey:
      type: apiKey
      in: header
      name: X-Api-Key

security:
  - XApiKey: []
```

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
고정된 `avatar_id`, `voice_id`를 사용해 영상을 생성하게 됩니다.

---

## 9. 주의사항
- 실제 API 키는 공개 문서나 공개 스키마에 그대로 넣지 않는 것이 좋습니다.
- ChatGPT Action에서 인증은 **API 키 / 맞춤형 / X-Api-Key** 로 설정합니다.
- example 값만 넣으면 강제가 되지 않으므로,
  실제 운영에서는 **enum 고정** 또는 **중간 서버에서 고정값 주입** 구조가 더 안전합니다.
- 장기적으로는 GPT가 `input_text`만 넘기고,
  `avatar_id`, `voice_id`, API 키는 서버 측에서 고정 관리하는 구조가 가장 안정적입니다.

---

## 10. 최종 정리
이 GPT의 핵심 구조는 아래와 같습니다.

- 입력: 사용자가 영상용 텍스트 입력
- 처리: GPT Action이 HeyGen API 호출
- 출력: 생성된 아바타 영상 URL 반환

즉,
이 GPT는 **텍스트를 입력받아 HeyGen 아바타 영상으로 바꾸고, 최종 결과 URL을 돌려주는 자동화 GPT**로 설계하면 됩니다.

---

## 11. 한 줄 정리
`HeyGen 아바타 영상 생성 GPT`는 사용자가 입력한 문장을 HeyGen API에 전달하고, 고정된 avatar_id와 voice_id를 사용해 영상을 생성한 뒤 최종적으로 생성된 영상 URL을 반환하도록 구성하면 됩니다.
