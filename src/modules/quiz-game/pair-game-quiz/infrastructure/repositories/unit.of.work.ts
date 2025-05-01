import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';

@Injectable()
export class UnitOfWork {
  constructor(private readonly dataSource: DataSource) {}

  async runTransaction<T>(work: (manager: EntityManager) => Promise<T>) {
    return this.dataSource.transaction(work);
  }
}
