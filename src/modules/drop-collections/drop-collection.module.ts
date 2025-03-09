import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { mongoUrl } from '../../config/database.config';
import { DropCollectionService } from './application/drop-collection.service';
import { DropCollectionController } from './interface/drop-collection.controller';
import { DropSqlRepository } from './infrastructure/drop.sql.repository';

@Module({
  imports: [MongooseModule.forRoot(mongoUrl)],
  controllers: [DropCollectionController],
  providers: [DropCollectionService, DropSqlRepository],
})
export class DropCollectionModule {}
