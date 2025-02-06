import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { DropCollectionService } from '../application/drop-collection.service';

@Controller('testing')
export class DropCollectionController {
  constructor(private readonly dropCollectionService: DropCollectionService) {}
  @Delete('all-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAllData() {
    await this.dropCollectionService.deleteAllData();
  }
}
