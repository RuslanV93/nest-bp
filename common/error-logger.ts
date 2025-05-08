import * as path from 'node:path';
import * as fs from 'node:fs';

const isVercel =
  process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
const logDir = isVercel ? '/tmp/logs' : path.resolve(process.cwd(), 'logs');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const errorPath = path.join(logDir, 'errors.log');

export function logErrorToFile(error: unknown) {
  const message =
    error instanceof Error ? error.stack || error.message : String(error);
  fs.appendFileSync(errorPath, `[${new Date().toISOString()}] ${message}\n`);
}
