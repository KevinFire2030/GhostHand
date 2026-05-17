const state = {
  selectedPath: null,
  analyzing: false,
};

const elements = {
  envBadge: document.querySelector('#envBadge'),
  pickButton: document.querySelector('#pickButton'),
  dropZone: document.querySelector('#dropZone'),
  sampleList: document.querySelector('#sampleList'),
  previewImage: document.querySelector('#previewImage'),
  emptyPreview: document.querySelector('#emptyPreview'),
  selectedPath: document.querySelector('#selectedPath'),
  analyzeButton: document.querySelector('#analyzeButton'),
  statusBox: document.querySelector('#statusBox'),
  accountValue: document.querySelector('#accountValue'),
  elapsedValue: document.querySelector('#elapsedValue'),
  merchantValue: document.querySelector('#merchantValue'),
  amountValue: document.querySelector('#amountValue'),
  reasonValue: document.querySelector('#reasonValue'),
  jsonValue: document.querySelector('#jsonValue'),
  logValue: document.querySelector('#logValue'),
};

function setStatus(message, type = 'idle') {
  elements.statusBox.textContent = message;
  elements.statusBox.className = `status-box ${type}`;
}

function toFileUrl(imagePath) {
  const normalized = imagePath.replace(/\\/g, '/');
  const prefix = /^[A-Za-z]:\//.test(normalized) ? 'file:///' : 'file://';
  return encodeURI(`${prefix}${normalized}`);
}

function setSelectedImage(imagePath) {
  state.selectedPath = imagePath;
  elements.selectedPath.textContent = `선택 경로: ${imagePath}`;
  elements.previewImage.src = toFileUrl(imagePath);
  elements.previewImage.style.display = 'block';
  elements.emptyPreview.style.display = 'none';
  elements.analyzeButton.disabled = false;

  document.querySelectorAll('.sample-button').forEach((button) => {
    button.classList.toggle('active', button.dataset.path === imagePath);
  });
}

function renderResult(response) {
  if (!response.ok) {
    setStatus('분석 실패', 'error');
    elements.reasonValue.textContent = response.error || response.stderr || '알 수 없는 오류가 발생했습니다.';
    elements.logValue.textContent = [response.stderr, response.stdout].filter(Boolean).join('\n\n');
    return;
  }

  const parsed = response.result;
  const json = parsed.json || {};
  setStatus('추천 완료', 'success');
  elements.accountValue.textContent = parsed.account || '-';
  elements.elapsedValue.textContent = parsed.elapsedSeconds ? `${parsed.elapsedSeconds.toFixed(2)}초` : `${(response.durationMs / 1000).toFixed(2)}초`;
  elements.merchantValue.textContent = json.merchant || '-';
  elements.amountValue.textContent = json.amount || '-';
  elements.reasonValue.textContent = parsed.reason || '-';
  elements.jsonValue.textContent = JSON.stringify(json || parsed, null, 2);
  elements.logValue.textContent = response.stdout || '';
}

async function analyzeSelectedImage() {
  if (!state.selectedPath || state.analyzing) return;
  state.analyzing = true;
  elements.analyzeButton.disabled = true;
  setStatus('웹훅 호출 중 → AI가 영수증을 읽는 중...', 'running');
  elements.logValue.textContent = '';

  const response = await window.receiptDemo.analyze({ imagePath: state.selectedPath, timeout: 180 });
  renderResult(response);

  state.analyzing = false;
  elements.analyzeButton.disabled = false;
}

async function loadSamples() {
  const samples = await window.receiptDemo.listSamples();
  elements.sampleList.innerHTML = '';
  samples.forEach((sample) => {
    const button = document.createElement('button');
    button.className = 'sample-button';
    button.dataset.path = sample.path;
    button.textContent = `${sample.label} · ${sample.file}`;
    button.addEventListener('click', () => setSelectedImage(sample.path));
    elements.sampleList.appendChild(button);
  });
}

async function loadEnvironment() {
  const env = await window.receiptDemo.environment();
  elements.envBadge.innerHTML = `실행 모드: <strong>${env.mode}</strong><br />v2.0: ${env.v2Root}`;
}

elements.pickButton.addEventListener('click', async () => {
  const imagePath = await window.receiptDemo.pickImage();
  if (imagePath) setSelectedImage(imagePath);
});

elements.analyzeButton.addEventListener('click', analyzeSelectedImage);

elements.dropZone.addEventListener('dragover', (event) => {
  event.preventDefault();
  elements.dropZone.classList.add('drag-over');
});

elements.dropZone.addEventListener('dragleave', () => {
  elements.dropZone.classList.remove('drag-over');
});

elements.dropZone.addEventListener('drop', (event) => {
  event.preventDefault();
  elements.dropZone.classList.remove('drag-over');
  const file = event.dataTransfer.files?.[0];
  if (file?.path) setSelectedImage(file.path);
});

Promise.all([loadSamples(), loadEnvironment()]).catch((error) => {
  setStatus('초기화 실패', 'error');
  elements.reasonValue.textContent = error.message;
});
