const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('receiptDemo', {
  listSamples: () => ipcRenderer.invoke('receipt:list-samples'),
  pickImage: () => ipcRenderer.invoke('receipt:pick-image'),
  analyze: (payload) => ipcRenderer.invoke('receipt:analyze', payload),
  environment: () => ipcRenderer.invoke('app:environment'),
});
