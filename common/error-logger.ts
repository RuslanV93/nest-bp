import * as path from 'node:path';
import * as fs from 'node:fs';
import { HttpException } from '@nestjs/common';

const isVercel =
  process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
const logDir = isVercel ? '/tmp/logs' : path.resolve(process.cwd(), 'logs');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const errorPath = path.join(logDir, 'errors.log');

export function logErrorToFile(error: unknown) {
  let message: string;
  if (error instanceof HttpException) {
    const response = error.getResponse();

    const status = error.getStatus();
    const full = {
      status,
      response,
      stack: error.stack,
    };
    message = JSON.stringify(full, null, 2);
  } else if (error instanceof Error) {
    message = error.stack || error.message;
  } else {
    message = String(error);
  }

  fs.appendFileSync(errorPath, `[${new Date().toISOString()}] ${message}\n`);
}
