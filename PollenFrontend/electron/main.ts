import { app, BrowserWindow } from 'electron';

app.whenReady().then(() => {
    const win = new BrowserWindow({
        title: 'Pollen Applicatie',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: true,
        },
    });

    if (process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(process.env.VITE_DEV_SERVER_URL);
    } else {
        // Load your file
        win.loadFile('dist/index.html');
    }
});
