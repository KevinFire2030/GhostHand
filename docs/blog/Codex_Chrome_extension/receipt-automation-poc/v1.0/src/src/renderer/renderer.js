const state = {
  selectedFile: null,
  accounts: ['회의비', '판촉비', '국내교통비', '물품구매', '복리후생비', '소모품비']
};

const $ = (id) => document.getElementById(id);

const selectButton = $('selectButton');
const analyzeButton = $('analyzeButton');
const previewBox = $('previewBox');
const fileName = $('fileName');
const fileSize = $('fileSize');
const mimeType = $('mimeType');
const endpointInput = $('endpointInput');
const apiKeyInput = $('apiKeyInput');
const logBox = $('logBox');
const connectionStatus = $('connectionStatus');
const recommendedAccount = $('recommendedAccount');
const reasonText = $('reasonText');
const rawResponse = $('rawResponse');
const flowItems = Array.from(document.querySelectorAll('#flowList li'));

selectButton.addEventListener('click', async () => {
  try {
    const file = await window.receiptApi.selectImage();
    if (!file) return;

    state.selectedFile = file;
    fileName.textContent = file.name;
    fileSize.textContent = formatBytes(file.size);
    mimeType.textContent = file.mimeType;
    previewBox.innerHTML = `<img src="${file.previewUrl}" alt="선택한 영수증 이미지" />`;
    analyzeButton.disabled = false;
    recommendedAccount.textContent = '-';
    reasonText.textContent = '분석 요청 전입니다.';
    rawResponse.textContent = '{}';
    setFlow(1);
    setLog(`이미지 선택 완료\n${file.name}\n\n이제 OpenClaw로 분석 요청을 보낼 수 있습니다.`);
  } catch (error) {
    setError(error);
  }
});

analyzeButton.addEventListener('click', async () => {
  if (!state.selectedFile) return;

  analyzeButton.disabled = true;
  selectButton.disabled = true;
  connectionStatus.textContent = endpointInput.value.trim() ? '웹훅 호출 중' : '데모 mock 분석 중';
  setFlow(2);
  setLog('이미지를 base64로 변환하고 분석 요청을 준비합니다...');

  try {
    setFlow(3);
    setLog(`${endpointInput.value.trim() ? 'OpenClaw 웹훅 호출 중...' : '웹훅 URL이 없어 로컬 데모 mock으로 분석합니다...'}\n\n정산 계정 후보: ${state.accounts.join(', ')}`);

    const result = await window.receiptApi.analyze({
      endpoint: endpointInput.value,
      apiKey: apiKeyInput.value,
      filePath: state.selectedFile.path,
      mimeType: state.selectedFile.mimeType,
      accounts: state.accounts
    });

    setFlow(4);
    connectionStatus.textContent = '분석 완료';
    recommendedAccount.textContent = result.account || '-';
    reasonText.textContent = result.reason || '이유 없음';
    rawResponse.textContent = JSON.stringify(result.raw || result, null, 2);
    setLog(`추천 결과 수신 완료\n추천 계정: ${result.account}\n신뢰도: ${result.confidence ?? '-'}`);
  } catch (error) {
    connectionStatus.textContent = '오류 발생';
    setError(error);
  } finally {
    analyzeButton.disabled = false;
    selectButton.disabled = false;
  }
});

function setFlow(doneCount) {
  flowItems.forEach((item, index) => {
    item.classList.toggle('done', index < doneCount);
  });
}

function setLog(message) {
  logBox.textContent = message;
}

function setError(error) {
  const message = error?.message || String(error);
  logBox.textContent = `오류: ${message}`;
  rawResponse.textContent = JSON.stringify({ error: message }, null, 2);
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return '-';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
