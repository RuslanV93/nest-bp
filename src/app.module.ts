import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersAccountModule } from './modules/users-account/users-account.module';
import { MongooseModule } from '@nestjs/mongoose';
import { mongoUrl } from './config/database.config';
import { BloggersPlatformModule } from './modules/blogger-platform/bloggers-platform.module';
import { DropCollectionModule } from './modules/drop-collections/drop-collection.module';

@Module({
  imports: [
    MongooseModule.forRoot(mongoUrl),
    UsersAccountModule,
    BloggersPlatformModule,
    DropCollectionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
