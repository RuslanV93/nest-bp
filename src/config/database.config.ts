import process from 'node:process';
import * as dotenv from 'dotenv';

dotenv.config();
export const mongoUrl: string = process.env.MONGO_URL
  ? process.env.MONGO_URL
  : 'mongodb://0.0.0.0:27017/nest-bp';
