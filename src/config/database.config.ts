// config.constants.ts
import { CoreConfig } from '../core/core-config/core.config';

export class DatabaseConfigService {
  constructor(private readonly coreConfig: CoreConfig) {}

  get mongoUrl(): string {
    return this.coreConfig.mongoUri;
  }

  get postgresUrl(): string {
    return this.coreConfig.postgresUrl;
  }

  get postgresLogin(): string {
    return this.coreConfig.postgresLogin;
  }

  get postgresPassword(): string {
    return this.coreConfig.postgresPassword;
  }

  get postgresPort(): number {
    return +this.coreConfig.postgresPort; // Преобразуем в число
  }

  get postgresDbName(): string {
    return this.coreConfig.postgresDbName;
  }
}
