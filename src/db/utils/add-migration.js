const execSync = require('child_process').execSync;

const arg = process.argv[2];
if (!arg) {
  throw new Error('Need some name for migration');
}
const command = `cross-env NODE_ENV=development typeorm-ts-node-commonjs migration:generate ./src/db/migrations/${arg} -d src/db/typeorm.config.ts`;

execSync(command, { stdio: 'inherit' });
