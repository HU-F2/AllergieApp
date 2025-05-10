import { app, BrowserWindow } from 'electron';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

let win: BrowserWindow | null = null;

function createWindow() {
    win = new BrowserWindow({
        show: false,
        webPreferences: {
            preload: path.join(__dirname, '../dist-electron/preload.mjs'),
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: true,
        },
    });

    win.setTitle(process.env.VITE_APP_NAME || 'Polinator');
    win.maximize();
    win.show();

    if (process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(process.env.VITE_DEV_SERVER_URL);
    } else {
        // Load your file
        win.loadFile('dist/index.html');
    }

    win.on('closed', () => {
        win = null;
    });
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.whenReady().then(() => {
    if (win === null) {
        createWindow();
    }  
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});