import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appSetup } from './config/app.setup';
import { PORT } from './shared/constants/settings';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  appSetup(app);
  app.enableCors();
  await app.listen(PORT);
}
bootstrap();
