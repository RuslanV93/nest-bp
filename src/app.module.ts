import { configModule } from './config-module';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { UsersAccountModule } from './modules/users-account/users-account.module';
import { BloggersPlatformModule } from './modules/blogger-platform/bloggers-platform.module';
import { DropCollectionModule } from './modules/drop-collections/drop-collection.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  mongoUrl,
  postgresDbName,
  postgresLogin,
  postgresPassword,
  postgresPort,
  postgresUrl,
} from './config/database.config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { NotificationModule } from './modules/notification/notification.module';
import { CqrsModule } from '@nestjs/cqrs';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 10000,
          limit: 30,
        },
      ],
    }),
    CqrsModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: postgresUrl,
      port: postgresPort,
      username: postgresLogin,
      password: postgresPassword,
      database: postgresDbName,
      autoLoadEntities: false,
      synchronize: false,
      // extra: {
      //   ssl: {
      //     rejectUnauthorized: false,
      //   },
      // },
    }),
    MongooseModule.forRoot(mongoUrl),
    UsersAccountModule,
    BloggersPlatformModule,
    DropCollectionModule,
    NotificationModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'swagger'),
      serveRoot: '/swagger',
    }),
    configModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
