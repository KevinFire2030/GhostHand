const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("automation", {
  runGmarket: (options) => ipcRenderer.invoke("gmarket:run", options),
  onGmarketStep: (callback) => {
    const listener = (_event, step) => callback(step);
    ipcRenderer.on("gmarket:step", listener);
    return () => ipcRenderer.removeListener("gmarket:step", listener);
  }
});
