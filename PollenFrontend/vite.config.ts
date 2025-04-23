import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron/simple';

export default defineConfig({
    plugins: [
        react(),
        electron({
            main: {
                entry: 'electron/main.ts',
            },
            preload: {
                input: 'electron/preload.ts',
            },
            // renderer: {},
        }),
    ],
    build: {
        outDir: 'dist',
    },
    define: {
        'process.env': {
            VITE_DEV_SERVER_URL: 'http://localhost:5173', // Vite dev server URL
        },
    },
});
