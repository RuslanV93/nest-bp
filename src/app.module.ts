import { configModule } from './config-module';
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
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    CqrsModule.forRoot(),
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
