const { contextBridge, ipcRenderer } = require('electron');

// Expose safe API to renderer
contextBridge.exposeInMainWorld('binaryHome', {
  loadConfig: () => ipcRenderer.invoke('load-config'),
  loadState: () => ipcRenderer.invoke('load-state'),
  saveState: (state) => ipcRenderer.invoke('save-state', state),
  loadMindHealth: () => ipcRenderer.invoke('load-mind-health')
});
