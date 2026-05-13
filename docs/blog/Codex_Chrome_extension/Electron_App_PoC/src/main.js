const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");
const { runGmarketAutomation } = require("./automation/gmarket");

function createWindow() {
  const win = new BrowserWindow({
    width: 980,
    height: 760,
    minWidth: 820,
    minHeight: 640,
    title: "G마켓 검색 자동화 PoC",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile(path.join(__dirname, "index.html"));
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.handle("gmarket:run", async (_event, options) => {
  return runGmarketAutomation({
    keyword: options?.keyword || "무선 마우스",
    sortMode: options?.sortMode || "review",
    visibleBrowser: options?.visibleBrowser !== false,
    onStep: (step) => {
      BrowserWindow.getAllWindows().forEach((win) => {
        win.webContents.send("gmarket:step", step);
      });
    }
  });
});
