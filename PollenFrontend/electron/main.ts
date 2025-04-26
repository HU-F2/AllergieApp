import { app, BrowserWindow } from 'electron';
import * as dotenv from 'dotenv';

dotenv.config();

app.whenReady().then(() => {
    const win = new BrowserWindow({
        show: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: true,
        },
    });

    win.setTitle(process.env.VITE_APP_NAME || 'Pollinator');
    win.maximize();
    win.show();

    if (process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(process.env.VITE_DEV_SERVER_URL);
    } else {
        // Load your file
        win.loadFile('dist/index.html');
    }
});
