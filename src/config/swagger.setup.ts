import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { get } from 'http';
import { createWriteStream } from 'fs';
import { INestApplication } from '@nestjs/common';
import { PORT, URL } from '../shared/constants/settings';

const serverUrl = `${URL}${PORT}`;

export const swaggerSetup = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Blogger Platform')
    .setDescription('Blogger Platform API')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);
  get(`${serverUrl}/swagger/swagger-ui-bundle.js`, function (response) {
    response.pipe(createWriteStream('swagger/swagger-ui-bundle.js'));
    console.log(
      `Swagger UI bundle file written to: '/swagger/swagger-ui-bundle.js'`,
    );
  });

  get(`${serverUrl}/swagger/swagger-ui-init.js`, function (response) {
    response.pipe(createWriteStream('swagger/swagger-ui-init.js'));
    console.log(
      `Swagger UI init file written to: '/swagger/swagger-ui-init.js'`,
    );
  });

  get(
    `${serverUrl}/swagger/swagger-ui-standalone-preset.js`,
    function (response) {
      response.pipe(
        createWriteStream('swagger/swagger-ui-standalone-preset.js'),
      );
      console.log(
        `Swagger UI standalone preset file written to: '/swagger/swagger-ui-standalone-preset.js'`,
      );
    },
  );

  get(`${serverUrl}/swagger/swagger-ui.css`, function (response) {
    response.pipe(createWriteStream('swagger/swagger-ui.css'));
    console.log(`Swagger UI css file written to: '/swagger/swagger-ui.css'`);
  });
};
