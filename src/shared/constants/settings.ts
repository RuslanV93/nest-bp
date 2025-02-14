import process from 'node:process';

export const PORT =
  process.env.NODE_ENV === 'development' ? (process.env.PORT ?? 3003) : 5000;
export const URL =
  process.env.NODE_ENV === 'development'
    ? (process.env.URL ?? 'http://192.168.50.115:')
    : 'http://localhost:';
export const EMAIL_PASS_CODE = process.env.EMAIL_PASS_CODE;
export const EMAIL_SENDER_ADDRESS = process.env.EMAIL_SENDER_ADDRESS;
export const WEBSITE_URL = process.env.WEBSITE_URL;
