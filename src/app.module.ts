import { ConfigModule } from '@nestjs/config';
ConfigModule.forRoot();
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { UsersAccountModule } from './modules/users-account/users-account.module';
import { BloggersPlatformModule } from './modules/blogger-platform/bloggers-platform.module';
import { DropCollectionModule } from './modules/drop-collections/drop-collection.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { mongoUrl } from './config/database.config';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { NotificationModule } from './modules/notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(mongoUrl),
    UsersAccountModule,
    BloggersPlatformModule,
    DropCollectionModule,
    NotificationModule,

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'swagger'),
      serveRoot: process.env.NODE_ENV === 'development' ? '/' : '/swagger',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
