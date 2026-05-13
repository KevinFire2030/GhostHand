const keywordInput = document.querySelector("#keyword");
const sortModeInput = document.querySelector("#sortMode");
const visibleBrowserInput = document.querySelector("#visibleBrowser");
const runButton = document.querySelector("#runButton");
const logList = document.querySelector("#log");
const resultBox = document.querySelector("#result");

function addLog(message, detail) {
  const item = document.createElement("li");
  const time = new Date().toLocaleTimeString("ko-KR", { hour12: false });
  item.innerHTML = `<strong>${time}</strong><span>${message}</span>`;

  if (detail?.url || detail?.error) {
    const meta = document.createElement("small");
    meta.textContent = detail.url || detail.error;
    item.appendChild(meta);
  }

  logList.appendChild(item);
  item.scrollIntoView({ block: "nearest" });
}

function renderResult(result) {
  const statusClass = result.success ? "success" : "failure";
  resultBox.className = `result ${statusClass}`;
  resultBox.innerHTML = `
    <div class="result-status">${result.success ? "성공" : "실패"}</div>
    <dl>
      <dt>검색어</dt>
      <dd>${result.keyword || "-"}</dd>
      <dt>정렬</dt>
      <dd>${result.sortLabel || "-"}</dd>
      <dt>페이지 제목</dt>
      <dd>${result.finalTitle || "-"}</dd>
      <dt>최종 URL</dt>
      <dd class="break">${result.finalUrl || "-"}</dd>
      <dt>스크린샷</dt>
      <dd class="break">${result.screenshotPath || "-"}</dd>
      <dt>메모</dt>
      <dd>${result.note || result.error || "-"}</dd>
    </dl>
  `;
}

window.automation.onGmarketStep((step) => {
  addLog(step.message, step);
});

runButton.addEventListener("click", async () => {
  runButton.disabled = true;
  runButton.textContent = "실행 중...";
  logList.innerHTML = "";
  resultBox.className = "result empty";
  resultBox.textContent = "자동화를 실행하고 있습니다.";

  try {
    const result = await window.automation.runGmarket({
      keyword: keywordInput.value.trim() || "무선 마우스",
      sortMode: sortModeInput.value,
      visibleBrowser: visibleBrowserInput.checked
    });
    renderResult(result);
  } catch (error) {
    renderResult({
      success: false,
      error: error.message
    });
  } finally {
    runButton.disabled = false;
    runButton.textContent = "검색 및 정렬 실행";
  }
});
