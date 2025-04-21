import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Server } from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 4000;

const srcPath = path.join(__dirname, '../src');
const distPath = path.join(__dirname, '../dist');

// Geef toegang tot src en dist
app.use(express.static(srcPath));
app.use(express.static(distPath));

app.get('/', (req, res) => {
  res.sendFile(path.join(srcPath, 'views', 'index.html'));
});

app.get('/test', (req, res) => {
  res.sendFile(path.join(srcPath, 'views', 'test.html'));
});

export function startServer(): Server {
  return app.listen(port, () => {
    console.log(`Frontend draait op http://localhost:${port}`);
  });
}