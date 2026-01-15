const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Database operations
  getAlexState: () => ipcRenderer.invoke('db:getAlexState'),
  getEmotionVocabulary: () => ipcRenderer.invoke('db:getEmotionVocabulary'),
  getPillars: () => ipcRenderer.invoke('db:getPillars'),
  getRecentObservations: (limit) => ipcRenderer.invoke('db:getRecentObservations', limit),
  addObservation: (data) => ipcRenderer.invoke('db:addObservation', data),
  addCustomEmotion: (data) => ipcRenderer.invoke('db:addCustomEmotion', data),
  getShadowMoments: (limit) => ipcRenderer.invoke('db:getShadowMoments', limit),
  getActiveThreads: () => ipcRenderer.invoke('db:getActiveThreads'),

  // Love-O-Meter state
  getLoveOMeter: () => ipcRenderer.invoke('state:getLoveOMeter'),
  saveLoveOMeter: (data) => ipcRenderer.invoke('state:saveLoveOMeter', data),

  // Fox state
  getFoxState: () => ipcRenderer.invoke('state:getFoxState'),
  saveFoxState: (data) => ipcRenderer.invoke('state:saveFoxState', data),

  // Notes Between Stars
  getNotes: () => ipcRenderer.invoke('state:getNotes'),
  addNote: (note) => ipcRenderer.invoke('state:addNote', note),

  // Window controls
  minimize: () => ipcRenderer.send('window:minimize'),
  maximize: () => ipcRenderer.send('window:maximize'),
  close: () => ipcRenderer.send('window:close')
});
