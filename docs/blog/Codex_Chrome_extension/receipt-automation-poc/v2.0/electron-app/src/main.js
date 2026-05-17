const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('node:path');
const os = require('node:os');
const { execFile } = require('node:child_process');
const { parseWebhookOutput } = require('./lib/parseWebhookOutput');

const APP_ROOT = path.resolve(__dirname, '..');
const V2_ROOT = path.resolve(APP_ROOT, '..');
const WEBHOOK_SCRIPT = path.join(V2_ROOT, 'src', 'webhook_test.py');
const SAMPLE_DIR = path.join(V2_ROOT, 'sample');

const SAMPLE_RECEIPTS = [
  { label: '카페 회의비', file: 'receipt_01_cafe_meeting.png' },
  { label: '택시 교통비', file: 'receipt_02_taxi_transport.png' },
  { label: '사무용품', file: 'receipt_03_office_supplies.png' },
  { label: '고객 점심', file: 'receipt_04_client_lunch.png' },
  { label: '홍보 인쇄물', file: 'receipt_05_promotion_printing.png' },
  { label: '주차 영수증', file: 'receipt_06_parking.png' },
  { label: '소프트웨어 구독', file: 'receipt_07_software_subscription.png' },
  { label: '야근 배달', file: 'receipt_08_delivery_overtime.png' },
  { label: '출장 호텔', file: 'receipt_09_hotel_business_trip.png' },
  { label: '장비 구매', file: 'receipt_10_equipment_purchase.png' },
  { label: '카드 영수증', file: 'credit_card_receipt_sample.png' },
];

function createWindow() {
  const win = new BrowserWindow({
    width: 1180,
    height: 780,
    minWidth: 960,
    minHeight: 640,
    title: 'Receipt Auto Account PoC',
    backgroundColor: '#0f172a',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile(path.join(__dirname, 'index.html'));
}

function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    execFile(command, args, { ...options, windowsHide: true, maxBuffer: 1024 * 1024 * 8 }, (error, stdout, stderr) => {
      if (error) {
        error.stdout = stdout;
        error.stderr = stderr;
        reject(error);
        return;
      }
      resolve({ stdout, stderr });
    });
  });
}

async function toWslPath(filePath) {
  if (process.platform !== 'win32') return filePath;
  // wsl.exe can treat Windows backslashes as escape characters before wslpath sees them.
  // Passing E:/... keeps the drive letter while avoiding backslash loss such as E:axPRJs...
  const safeWindowsPath = filePath.replace(/\\/g, '/');
  const { stdout } = await runCommand('wsl.exe', ['wslpath', '-a', safeWindowsPath]);
  return stdout.trim().replace(/\r/g, '');
}

async function runWebhookTest(imagePath, timeout = 180) {
  const startedAt = Date.now();
  const normalizedImagePath = path.resolve(imagePath);

  let command;
  let args;
  let cwd;

  if (process.platform === 'win32') {
    const wslV2Root = await toWslPath(V2_ROOT);
    const wslImagePath = await toWslPath(normalizedImagePath);
    command = 'wsl.exe';
    args = [
      'bash',
      '-lc',
      `cd ${JSON.stringify(wslV2Root)} && python3 src/webhook_test.py ${JSON.stringify(wslImagePath)} --timeout ${Number(timeout)}`,
    ];
    cwd = V2_ROOT;
  } else {
    command = 'python3';
    args = [WEBHOOK_SCRIPT, normalizedImagePath, '--timeout', String(timeout)];
    cwd = V2_ROOT;
  }

  try {
    const { stdout, stderr } = await runCommand(command, args, { cwd });
    return {
      ok: true,
      imagePath: normalizedImagePath,
      durationMs: Date.now() - startedAt,
      result: parseWebhookOutput(stdout),
      stdout,
      stderr,
      commandPreview: [command, ...args].join(' '),
    };
  } catch (error) {
    return {
      ok: false,
      imagePath: normalizedImagePath,
      durationMs: Date.now() - startedAt,
      error: error.message,
      stdout: error.stdout || '',
      stderr: error.stderr || '',
      commandPreview: [command, ...args].join(' '),
    };
  }
}

ipcMain.handle('receipt:list-samples', async () =>
  SAMPLE_RECEIPTS.map((sample) => ({
    ...sample,
    path: path.join(SAMPLE_DIR, sample.file),
  }))
);

ipcMain.handle('receipt:pick-image', async () => {
  const result = await dialog.showOpenDialog({
    title: '영수증 이미지 선택',
    defaultPath: SAMPLE_DIR,
    properties: ['openFile'],
    filters: [
      { name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'webp', 'bmp'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  });

  if (result.canceled || result.filePaths.length === 0) return null;
  return result.filePaths[0];
});

ipcMain.handle('receipt:analyze', async (_event, payload) => {
  if (!payload?.imagePath) {
    return { ok: false, error: '분석할 이미지가 선택되지 않았습니다.' };
  }
  return runWebhookTest(payload.imagePath, payload.timeout || 180);
});

ipcMain.handle('app:environment', async () => ({
  platform: process.platform,
  appRoot: APP_ROOT,
  v2Root: V2_ROOT,
  webhookScript: WEBHOOK_SCRIPT,
  home: os.homedir(),
  mode: process.platform === 'win32' ? 'Windows Electron → WSL python3' : 'WSL/Linux python3',
}));

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
