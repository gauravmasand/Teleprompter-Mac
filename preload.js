const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('tp', {
  close: () => ipcRenderer.invoke('win:close'),
  minimize: () => ipcRenderer.invoke('win:minimize'),
  setClickThrough: (on) => ipcRenderer.invoke('win:toggle-click-through', on),
});
