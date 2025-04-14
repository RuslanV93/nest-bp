import * as dotenv from 'dotenv';
import { existsSync } from 'fs';
import { join } from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { DataSource } from 'typeorm';
import * as process from 'node:process';

const envPaths = [
  join(__dirname, '../env', `.env.${process.env.NODE_ENV}.local`),
  join(__dirname, '../env', `.env.${process.env.NODE_ENV}`),
  join(__dirname, '../env', '.env.production'),
];

for (const path of envPaths) {
  if (existsSync(path)) {
    dotenv.config({ path });
    break;
  }
}

export default new DataSource({
  type: 'postgres',
  url: process.env.NEON_STRING,
  entities: ['src/**/*.orm.domain.ts'],
  migrations: ['src/db/migrations/*.ts'],
  namingStrategy: new SnakeNamingStrategy(),
  synchronize: false,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});
