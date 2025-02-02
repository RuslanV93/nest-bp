import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersAccountModule } from './modules/users-account/users-account.module';
import { MongooseModule } from '@nestjs/mongoose';
import { mongoUrl } from './config/database.config';

@Module({
  imports: [MongooseModule.forRoot(mongoUrl), UsersAccountModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
