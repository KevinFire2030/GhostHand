const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('receiptApi', {
  selectImage: () => ipcRenderer.invoke('receipt:selectImage'),
  analyze: (payload) => ipcRenderer.invoke('receipt:analyze', payload)
});
