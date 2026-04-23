# GPTs_PoC4_생성가이드

## 1. PoC 개요
- 사용자가 입력한 텍스트를 HeyGen 아바타 영상으로 생성
- GPT Action을 통해 외부 API를 호출하는 자동화형 PoC
- 최종적으로 생성된 아바타 영상의 URL을 반환

### * 핵심 배경 지식
- 이 PoC는 단순 지식 응답형 GPT가 아니라 **외부 Action/API 연동형 GPT**입니다.
- 즉, GPT가 답변만 만드는 것이 아니라 실제 외부 서비스를 호출합니다.
- HeyGen Direct API는 `X-Api-Key` 헤더 기반 인증을 사용합니다.
- 실전에서는 `avatar_id`, `voice_id`, API 키를 서버 측에서 고정 관리하는 구조가 가장 안정적입니다.
- 현재 가이드는 PoC용으로 Direct API를 GPT Action에 붙이는 예시를 설명합니다.

---

## 2. 시나리오

### 1) 입력
- 사용자가 HeyGen 아바타로 생성하고자 하는 영상의 텍스트를 입력

예시 질문)
- `안녕하세요. HeyGen 아바타 영상 생성 테스트입니다.`
- `제품 소개 영상을 만들 수 있도록 30초 분량 멘트를 생성해줘.`
- `아래 문장으로 아바타 영상을 생성해줘.`

### 2) 처리
- GPT Action이 HeyGen API를 호출한다.
- 고정된 `avatar_id`, `voice_id`를 사용하고, 사용자가 입력한 문장을 `input_text`로 전달한다.
- 영상 생성 요청 후 `video_id`를 받고, 상태 조회를 통해 `video_url`을 확인한다.
- 실패 시 에러 원인을 설명한다.

### 3) 출력
- 생성된 아바타 영상의 URL 반환
- 실패 시 실패 원인 및 교정 포인트 안내

---

## 3. GPTs 생성(구성) 가이드
위의 내용을 바탕으로 GPT를 생성한다고 했을 때의 구성 가이드 초안입니다.

### 1. 이름:
```text
HeyGen 아바타 영상 생성 GPT
```

대안 예시:
- HeyGen 영상 생성 GPT
- 아바타 영상 자동 생성 GPT
- HeyGen Action 연동 GPT

추천 이름은 아래입니다.

```text
HeyGen 아바타 영상 생성 GPT
```

### 2. 설명:
```text
입력한 텍스트를 HeyGen 아바타 영상으로 생성하고 결과 영상 URL을 반환하는 GPT
```

### 3. 지침:
아래 내용을 그대로 초안으로 사용해도 됩니다.

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

### 4. 대화 스타트:
- `안녕하세요. HeyGen 아바타 영상 생성 테스트입니다.`
- `제품 소개 영상을 만들 수 있도록 30초 분량 멘트를 생성해줘.`
- `아래 문장으로 아바타 영상을 생성해줘.`

### 5. 지식:
- `examples/HeyGen/HeyGen_API_사용법.md`
- `examples/HeyGen/create_avatar_video.py`
- HeyGen API 사용 메모
- Action 설정 가이드 문서

추천:
- Direct API 구조 설명 문서 1개
- 실제 호출 예제 코드 1개
- 인증/스키마 설정 메모 1개

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
참고 파일 기준 핵심 API 흐름은 아래와 같습니다.
- 영상 생성 요청: `POST https://api.heygen.com/v2/video/generate`
- 상태 조회: `GET https://api.heygen.com/v1/video_status.get?video_id=...`

PoC 설명용으로는 아래 두 가지 방식으로 이해하면 됩니다.

### 방식 A. 생성 요청 후 video_id 반환
- 장점: 스키마 단순
- 단점: 최종 video_url을 바로 못 받음

### 방식 B. 상태 조회까지 호출 후 video_url 반환
- 장점: 최종 URL 확인 가능
- 단점: GPT 또는 사용자가 한 번 더 상태 조회를 해야 할 수 있음

실전에서는 중간 래퍼 API를 두고 `create -> poll -> return video_url` 을 한 번에 처리하는 구조가 가장 안정적입니다.

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

## 8. 추천 사용 방식
이 GPT는 아래처럼 사용하는 것이 좋습니다.

1. 사용자가 영상용 텍스트 입력
2. GPT가 Action으로 HeyGen API 호출
3. video_id 또는 video_url 확인
4. 실패 시 에러 원인과 수정 포인트 확인

예시:
- `안녕하세요. HeyGen 아바타 영상 생성 테스트입니다.`
- `다음 문장으로 아바타 영상을 생성해줘: 안녕하세요. 오늘은 신제품 소개 영상을 안내드리겠습니다.`

---

## 9. 주의사항
- 실제 API 키는 공개 문서나 공개 스키마에 그대로 넣지 않는 것이 좋습니다.
- ChatGPT Action에서 인증은 **API 키 / 맞춤형 / X-Api-Key** 로 설정합니다.
- example 값만 넣으면 강제가 되지 않으므로,
  실제 운영에서는 **enum 고정** 또는 **중간 서버에서 고정값 주입** 구조가 더 안전합니다.
- 장기적으로는 GPT가 `input_text`만 넘기고,
  `avatar_id`, `voice_id`, API 키는 서버 측에서 고정 관리하는 구조가 가장 안정적입니다.

---

## 10. 한 줄 정리
이 GPT는 사용자가 입력한 문장을 HeyGen API에 전달하고, 고정된 avatar_id와 voice_id를 사용해 영상을 생성한 뒤 최종적으로 생성된 영상 URL을 반환하도록 구성하면 됩니다.
