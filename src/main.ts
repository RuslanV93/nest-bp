import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appSetup } from './config/app.setup';
import { useContainer } from 'class-validator';
import { CoreConfig } from './core/core-config/core.config';
import { initializeTransactionalContext } from 'typeorm-transactional';

async function bootstrap() {
  initializeTransactionalContext(); // Инициализируем транзакционный контекст
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  appSetup(app);
  app.enableCors();
  const coreConfig = app.get<CoreConfig>(CoreConfig);
  await app.listen(coreConfig.port);
}
bootstrap();
