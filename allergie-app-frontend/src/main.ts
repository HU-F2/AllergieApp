import { app, BrowserWindow } from 'electron';
import { startServer } from './server.js';
import { Server } from 'http';

let mainWindow: BrowserWindow | null = null;
let serverInstance: Server;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 8000,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  const startUrl = 'http://localhost:4000';
  mainWindow.loadURL(startUrl);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  serverInstance = startServer();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (serverInstance) {
    serverInstance.close(() => {
      console.log('Server is gestopt');
    });
  }

  // macOS specifieke exit regel
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
