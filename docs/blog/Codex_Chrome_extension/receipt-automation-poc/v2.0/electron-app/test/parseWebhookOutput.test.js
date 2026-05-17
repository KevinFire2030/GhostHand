const assert = require('node:assert/strict');
const { parseWebhookOutput } = require('../src/lib/parseWebhookOutput');

const sampleOutput = `이미지: /mnt/e/demo/v2.0/sample/receipt_01_cafe_meeting.png
웹훅 호출: http://localhost:8644/webhooks/expense-receipt
웹훅 접수: HTTP 202 / delivery_id=1779023501463
결과 대기 중...

=== 추천 결과 ===
추천 계정: 회의비
추천 이유: 카페에서 커피와 간단한 다과를 구매한 영수증입니다.
걸린 시간: 40.16초

=== 전체 JSON ===
{
  "success": true,
  "merchant": "스타벅스 강남역점",
  "purchased_at": "2026-05-16 14:32:18",
  "items": [
    "카페 아메리카노 Tall 2개",
    "치즈 베이글 1개"
  ],
  "amount": "13,500원",
  "recommended_account": "회의비",
  "reason": "카페에서 커피와 간단한 다과를 구매한 영수증입니다."
}`;

const parsed = parseWebhookOutput(sampleOutput);
assert.equal(parsed.account, '회의비');
assert.equal(parsed.reason, '카페에서 커피와 간단한 다과를 구매한 영수증입니다.');
assert.equal(parsed.elapsedSeconds, 40.16);
assert.equal(parsed.json.merchant, '스타벅스 강남역점');
assert.deepEqual(parsed.json.items, ['카페 아메리카노 Tall 2개', '치즈 베이글 1개']);

const fallbackOutput = `=== 추천 결과 ===\n추천 계정: 국내교통비\n추천 이유: 택시 이용 영수증입니다.\n걸린 시간: 12.30초`;
const fallbackParsed = parseWebhookOutput(fallbackOutput);
assert.equal(fallbackParsed.account, '국내교통비');
assert.equal(fallbackParsed.reason, '택시 이용 영수증입니다.');
assert.equal(fallbackParsed.elapsedSeconds, 12.3);
assert.equal(fallbackParsed.json, null);

console.log('parseWebhookOutput tests passed');
