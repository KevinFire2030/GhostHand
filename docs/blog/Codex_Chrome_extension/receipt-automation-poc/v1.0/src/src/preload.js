const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('receiptApi', {
  selectImage: () => ipcRenderer.invoke('receipt:selectImage'),
  getConfig: () => ipcRenderer.invoke('receipt:getConfig'),
  analyze: (payload) => ipcRenderer.invoke('receipt:analyze', payload)
});
