import { configModule } from './config-module';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { UsersAccountModule } from './modules/users-account/users-account.module';
import { BloggersPlatformModule } from './modules/blogger-platform/bloggers-platform.module';
import { DropCollectionModule } from './modules/drop-collections/drop-collection.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { NotificationModule } from './modules/notification/notification.module';
import { CqrsModule } from '@nestjs/cqrs';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreConfig } from './core/core-config/core.config';
import { CoreModule } from './core/core-config/core.module';
import { SwaggerConfigService } from './config/swagger.setup';

@Module({
  imports: [
    configModule,

    CoreModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 10000,
          limit: 30,
        },
      ],
    }),
    CqrsModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: (coreConfig: CoreConfig) => ({
        type: 'postgres',
        host: coreConfig.postgresUrl,
        port: Number(coreConfig.postgresPort),
        username: coreConfig.postgresLogin,
        password: coreConfig.postgresPassword,
        database: coreConfig.postgresDbName,
        autoLoadEntities: true,
        synchronize: true,
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
      }),
      inject: [CoreConfig],
    }),
    MongooseModule.forRootAsync({
      useFactory: (coreConfig: CoreConfig) => {
        const uri = coreConfig.mongoUri;

        return {
          uri: uri,
        };
      },
      inject: [CoreConfig],
    }),
    UsersAccountModule,
    BloggersPlatformModule,
    DropCollectionModule,
    NotificationModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'swagger'),
      serveRoot: '/swagger',
    }),
  ],
  controllers: [AppController],
  providers: [CoreConfig, AppService, SwaggerConfigService],
})
export class AppModule {}
