import { spawn } from 'child_process';

const mode = process.env.APP_MODE || 'electron';
const script = mode === 'liveserver' ? 'start:live' : 'start:electron';

const child = spawn('npm', ['run', script], {
  stdio: 'inherit',
  shell: true
});