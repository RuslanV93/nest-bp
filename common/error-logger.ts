import * as path from 'node:path';
import * as fs from 'node:fs';

const logDir = path.resolve(process.cwd(), 'logs');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const errorPath = path.join(logDir, 'errors.log');

export function logErrorToFile(error: unknown) {
  const message =
    error instanceof Error ? error.stack || error.message : String(error);
  fs.appendFileSync(errorPath, `[${new Date().toISOString()}] ${message}\n`);
}
