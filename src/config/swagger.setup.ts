import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { get } from 'http';
import { createWriteStream } from 'fs';
import { INestApplication, Injectable } from '@nestjs/common';
import { CoreConfig } from '../core/core-config/core.config';

@Injectable()
export class SwaggerConfigService {
  constructor(private readonly coreConfig: CoreConfig) {}

  setupSwagger(app: INestApplication) {
    const localUrl = this.coreConfig.localUrl;
    const port = this.coreConfig.port;
    const serverUrl = `${localUrl}${port}`;

    const config = new DocumentBuilder()
      .setTitle('Blogger Platform')
      .setDescription('Blogger Platform API')
      .setVersion('1.0')
      .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
      .addBasicAuth({ type: 'http', scheme: 'basic' })
      .build();

    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, documentFactory);

    get(`${serverUrl}/swagger/swagger-ui-bundle.js`, (response) => {
      response.pipe(createWriteStream('swagger/swagger-ui-bundle.js'));
      console.log(
        `Swagger UI bundle file written to: '/swagger/swagger-ui-bundle.js'`,
      );
    });

    get(`${serverUrl}/swagger/swagger-ui-init.js`, (response) => {
      response.pipe(createWriteStream('swagger/swagger-ui-init.js'));
      console.log(
        `Swagger UI init file written to: '/swagger/swagger-ui-init.js'`,
      );
    });

    get(`${serverUrl}/swagger/swagger-ui-standalone-preset.js`, (response) => {
      response.pipe(
        createWriteStream('swagger/swagger-ui-standalone-preset.js'),
      );
      console.log(
        `Swagger UI standalone preset file written to: '/swagger/swagger-ui-standalone-preset.js'`,
      );
    });

    get(`${serverUrl}/swagger/swagger-ui.css`, (response) => {
      response.pipe(createWriteStream('swagger/swagger-ui.css'));

      console.log(`Swagger UI css file written to: '/swagger/swagger-ui.css'`);
    });
  }
}
