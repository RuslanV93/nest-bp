import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appSetup } from './config/app.setup';
import { appConfig } from './app.config';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  appSetup(app);
  app.enableCors();
  await app.listen(appConfig.port);
}
bootstrap();
