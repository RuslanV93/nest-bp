// src/shared/types/index.d.ts
import * as express from 'express';

declare global {
  namespace Express {
    export interface Request {
      clientInfo: {
        ip: string;
        browser: string;
        browserVersion: string;
        os: string;
        device: string;
        userAgentString: string;
      };
    }
  }
}
