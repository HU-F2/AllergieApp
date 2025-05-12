// electron/preload.js
import { contextBridge } from 'electron';

window.addEventListener('DOMContentLoaded', () => {
    console.log('Preload script loaded');
});

contextBridge.exposeInMainWorld('electronGlobalVariables', {
  IN_DESKTOP_ENV: true
});