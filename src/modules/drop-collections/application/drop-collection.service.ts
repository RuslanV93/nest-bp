import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { DropSqlRepository } from '../infrastructure/drop.sql.repository';

@Injectable()
export class DropCollectionService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly dropSqlRepository: DropSqlRepository,
  ) {}
  async deleteAllData() {
    const collections = Object.keys(this.connection.collections);
    for (const collectionName of collections) {
      await this.connection.dropCollection(collectionName);
    }
    await this.dropSqlRepository.deleteAllData();
  }
}
