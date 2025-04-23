import { app, BrowserWindow, session } from 'electron';

app.whenReady().then(() => {
    const win = new BrowserWindow({
        title: 'Pollen Applicatie',
        webPreferences: {
            nodeIntegration: false, // Important for security
            contextIsolation: true, // Prevents access to Electron's internals from the renderer
            sandbox: true, // Adds additional security layer
        },
    });

    // You can use `process.env.VITE_DEV_SERVER_URL` when the vite command is called `serve`
    if (process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(process.env.VITE_DEV_SERVER_URL);
    } else {
        // Load your file
        win.loadFile('dist/index.html');
    }

    session.defaultSession.setPermissionRequestHandler(
        (webContents, permission, callback) => {
            if (permission === 'geolocation') {
                callback(true); // Allow geolocation
            } else {
                callback(false); // Deny all other permissions
            }
        }
    );
});
