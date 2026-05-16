const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('node:path');
const fs = require('node:fs/promises');
const { pathToFileURL } = require('node:url');

const DEFAULT_ACCOUNTS = ['회의비', '판촉비', '국내교통비', '물품구매', '복리후생비', '소모품비'];

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 760,
    minWidth: 1080,
    minHeight: 680,
    title: 'Receipt Automation PoC',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('receipt:getConfig', async () => {
  const env = await loadLocalEnv();

  return {
    endpoint: env.OPENCLAW_WEBHOOK_ENDPOINT || process.env.OPENCLAW_WEBHOOK_ENDPOINT || '',
    apiKey: env.OPENCLAW_WEBHOOK_TOKEN || env.OPENCLAW_API_KEY || process.env.OPENCLAW_WEBHOOK_TOKEN || process.env.OPENCLAW_API_KEY || ''
  };
});

ipcMain.handle('receipt:selectImage', async () => {
  const result = await dialog.showOpenDialog({
    title: '영수증 이미지 선택',
    properties: ['openFile'],
    filters: [
      { name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'webp', 'bmp'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  if (result.canceled || result.filePaths.length === 0) return null;

  const filePath = result.filePaths[0];
  const stat = await fs.stat(filePath);
  const ext = path.extname(filePath).slice(1).toLowerCase() || 'png';
  const mimeType = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;

  return {
    path: filePath,
    name: path.basename(filePath),
    size: stat.size,
    mimeType,
    previewUrl: pathToFileURL(filePath).href
  };
});

ipcMain.handle('receipt:analyze', async (_event, payload) => {
  if (!payload?.filePath) throw new Error('분석할 이미지 파일이 없습니다.');

  const endpoint = String(payload.endpoint || '').trim();
  const apiKey = String(payload.apiKey || '').trim();
  const imageBuffer = await fs.readFile(payload.filePath);
  const imageBase64 = imageBuffer.toString('base64');
  const fileName = path.basename(payload.filePath);

  if (!endpoint) {
    return createLocalMockRecommendation(fileName);
  }

  const requestBody = {
    type: 'receipt_account_recommendation',
    fileName,
    mimeType: payload.mimeType || 'image/png',
    imageBase64,
    accounts: payload.accounts || DEFAULT_ACCOUNTS,
    instruction: '영수증 이미지를 분석해서 가장 유사한 경비 정산 계정을 하나 추천하고, 이유를 한국어로 짧게 설명해줘.'
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(apiKey ? { authorization: `Bearer ${apiKey}` } : {})
    },
    body: JSON.stringify(requestBody)
  });

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    throw new Error(data?.error || data?.message || `Webhook 호출 실패: HTTP ${response.status}`);
  }

  return normalizeWebhookResponse(data);
});

function normalizeWebhookResponse(data) {
  // OpenClaw webhook/agent 응답 형태가 달라도 데모 UI가 깨지지 않도록 주요 필드를 흡수한다.
  // 단, top-level에 명시적인 결과가 있으면 nested result/message보다 우선한다.
  const candidates = [
    // OpenClaw image.describe는 실제 모델 JSON을 rawModelText.outputs[0].text에 담아줄 수 있다.
    // 이 값이 있으면 wrapper의 account/recommendedAccount보다 우선한다.
    extractImageDescribePayload(data?.rawModelText),
    extractImageDescribePayload(data?.reason),
    extractImageDescribePayload(data?.result),
    extractImageDescribePayload(data?.data),
    extractImageDescribePayload(data?.response),
    data,
    parseJsonIfPossible(data?.result),
    parseJsonIfPossible(data?.data),
    parseJsonIfPossible(data?.response),
    parseJsonIfPossible(data?.message),
    data?.result,
    data?.data,
    data?.response
  ].filter((item) => item && typeof item === 'object');

  const account = firstValue(candidates, ['account', 'recommendedAccount', 'category', '정산계정', '추천계정']);
  const reason = firstValue(candidates, ['reason', 'rationale', '이유']);
  const confidence = firstValue(candidates, ['confidence', 'score', '신뢰도']);
  const fallbackMessage = firstValue(candidates, ['message', 'raw']);

  return {
    account: account || '분석 결과 확인 필요',
    reason: reason || fallbackMessage || '웹훅 응답은 수신했지만 추천 계정/이유 필드를 찾지 못했습니다.',
    confidence: confidence ?? null,
    raw: data
  };
}

function firstValue(candidates, keys) {
  for (const candidate of candidates) {
    for (const key of keys) {
      const value = candidate?.[key];
      if (value !== undefined && value !== null && value !== '') return value;
    }
  }
  return null;
}

function parseJsonIfPossible(value) {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) return value;

  try {
    return JSON.parse(trimmed);
  } catch {
    return value;
  }
}

function extractImageDescribePayload(value) {
  const parsed = parseJsonIfPossible(value);
  if (!parsed || typeof parsed !== 'object') return null;

  const outputText = parsed?.outputs?.find((output) => typeof output?.text === 'string')?.text;
  const outputPayload = parseJsonIfPossible(outputText);
  if (outputPayload && typeof outputPayload === 'object') return outputPayload;

  return parsed;
}

async function loadLocalEnv() {
  const candidates = [
    path.join(app.getAppPath(), '.env'),
    path.join(process.cwd(), '.env'),
    path.join(path.dirname(process.execPath), '.env')
  ];

  for (const envPath of candidates) {
    try {
      const content = await fs.readFile(envPath, 'utf8');
      return parseEnv(content);
    } catch {
      // 다음 후보를 확인한다.
    }
  }

  return {};
}

function parseEnv(content) {
  return String(content)
    .split(/\r?\n/)
    .reduce((acc, line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return acc;
      const separator = trimmed.indexOf('=');
      if (separator === -1) return acc;

      const key = trimmed.slice(0, separator).trim();
      let value = trimmed.slice(separator + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      acc[key] = value;
      return acc;
    }, {});
}

function createLocalMockRecommendation(fileName) {
  const lower = fileName.toLowerCase();
  let account = '회의비';
  let reason = '데모 모드입니다. 스타벅스/카페 영수증은 회의나 업무 미팅 상황에서 자주 발생하므로 회의비로 추천합니다.';

  if (lower.includes('taxi') || lower.includes('transport')) {
    account = '국내교통비';
    reason = '파일명에서 교통 관련 단서가 보여 국내교통비로 추천합니다.';
  } else if (lower.includes('ad') || lower.includes('promo')) {
    account = '판촉비';
    reason = '파일명에서 광고/프로모션 관련 단서가 보여 판촉비로 추천합니다.';
  } else if (lower.includes('supply') || lower.includes('item')) {
    account = '물품구매';
    reason = '파일명에서 물품 구매 관련 단서가 보여 물품구매로 추천합니다.';
  }

  return { account, reason, confidence: 'demo', raw: { mode: 'local-demo' } };
}
