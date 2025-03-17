import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DropCollectionService } from './application/drop-collection.service';
import { DropCollectionController } from './interface/drop-collection.controller';
import { DropSqlRepository } from './infrastructure/drop.sql.repository';
import { CoreConfig } from '../../core/core-config/core.config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (coreConfig: CoreConfig) => {
        const uri = coreConfig.mongoUri;

        return {
          uri: uri,
        };
      },
      inject: [CoreConfig],
    }),
  ],
  controllers: [DropCollectionController],
  providers: [DropCollectionService, DropSqlRepository],
})
export class DropCollectionModule {}
