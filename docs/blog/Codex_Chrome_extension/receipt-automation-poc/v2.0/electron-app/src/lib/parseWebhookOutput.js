function extractJsonBlock(output) {
  const marker = '=== 전체 JSON ===';
  const markerIndex = output.indexOf(marker);
  if (markerIndex === -1) return null;

  const afterMarker = output.slice(markerIndex + marker.length).trim();
  const firstBrace = afterMarker.indexOf('{');
  if (firstBrace === -1) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = firstBrace; i < afterMarker.length; i += 1) {
    const char = afterMarker[i];

    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === '\\') {
      escaped = true;
      continue;
    }
    if (char === '"') {
      inString = !inString;
      continue;
    }
    if (inString) continue;

    if (char === '{') depth += 1;
    if (char === '}') {
      depth -= 1;
      if (depth === 0) {
        return afterMarker.slice(firstBrace, i + 1);
      }
    }
  }
  return null;
}

function extractLineValue(output, label) {
  const regex = new RegExp(`^${label}:\\s*(.+)$`, 'm');
  const match = output.match(regex);
  return match ? match[1].trim() : '';
}

function parseElapsedSeconds(output) {
  const value = extractLineValue(output, '걸린 시간');
  const match = value.match(/([0-9]+(?:\.[0-9]+)?)/);
  return match ? Number.parseFloat(match[1]) : null;
}

function parseWebhookOutput(output) {
  const jsonBlock = extractJsonBlock(output);
  let json = null;
  if (jsonBlock) {
    try {
      json = JSON.parse(jsonBlock);
    } catch (_error) {
      json = null;
    }
  }

  const account = json?.recommended_account || extractLineValue(output, '추천 계정') || '알 수 없음';
  const reason = json?.reason || extractLineValue(output, '추천 이유') || '알 수 없음';
  const elapsedSeconds = parseElapsedSeconds(output);

  return {
    account,
    reason,
    elapsedSeconds,
    json,
    raw: output,
  };
}

module.exports = {
  parseWebhookOutput,
};
