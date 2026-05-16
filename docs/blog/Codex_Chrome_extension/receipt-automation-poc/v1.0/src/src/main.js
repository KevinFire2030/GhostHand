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
  const candidate = data?.result || data?.data || data?.response || data;
  const account = candidate?.account || candidate?.recommendedAccount || candidate?.category || candidate?.정산계정 || candidate?.추천계정;
  const reason = candidate?.reason || candidate?.rationale || candidate?.message || candidate?.이유 || candidate?.raw;
  const confidence = candidate?.confidence || candidate?.score || candidate?.신뢰도;

  return {
    account: account || '분석 결과 확인 필요',
    reason: reason || '웹훅 응답은 수신했지만 추천 계정/이유 필드를 찾지 못했습니다.',
    confidence: confidence || null,
    raw: data
  };
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
