// import * as dotenv from 'dotenv';
// import * as fs from 'fs';
// import * as path from 'path';

// dotenv.config();

// const frontendEnvVars = [
//   'APP_MODE',
//   'PORT',
//   'API_URL',
// ];

// const output: string[] = [];

// output.push('// This file is auto-generated from .env');
// output.push('export const config = {');

// frontendEnvVars.forEach((key) => {
//   const value = process.env[key];
//   if (value !== undefined) {
//     output.push(`  ${key}: "${value}",`);
//   }
// });

// output.push('};');

// const outputPath = path.join(__dirname, 'src', 'config.ts');
// fs.writeFileSync(outputPath, output.join('\n'), 'utf8');

// console.log(`✅ config.ts gegenereerd in: ${outputPath}`);

// import * as dotenv from 'dotenv';
// import * as fs from 'fs';
// import * as path from 'path';

// dotenv.config();

// const frontendConfig = {
//   API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000',
//   RUN_MODE: process.env.RUN_MODE || 'live',
// };

// const output = `// 🔧 Automatically generated from .env
// const config = ${JSON.stringify(frontendConfig, null, 2)} as const;
// export default config;
// `;

// fs.writeFileSync(path.join(__dirname, 'src/config/frontend-config.ts'), output);
console.log('✅ Frontend config gegenereerd.');