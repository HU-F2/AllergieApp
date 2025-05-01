import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron/simple'

export default defineConfig(({ mode }) => {
    // Laad env variabelen voor de huidige mode
    const env = loadEnv(mode, process.cwd());
  
    return {
      plugins: [
        react(),
        electron({
          main: {
            entry: 'electron/main.ts',
          },
          preload: {
            input: 'electron/preload.ts',
          },
        }),
      ],
      define: {
        'process.env': {
          VITE_APP_NAME: JSON.stringify(env.VITE_APP_NAME),
          VITE_BACKEND_API_URL: JSON.stringify(env.VITE_BACKEND_API_URL),
          VITE_DEV_SERVER_URL: JSON.stringify(env.VITE_DEV_SERVER_URL),
        }
      },
      build: {
        rollupOptions: {
            external: ['fsevents']
        },    
        outDir: 'dist',
      }
    }
});
