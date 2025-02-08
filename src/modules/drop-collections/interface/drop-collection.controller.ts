import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { DropCollectionService } from '../application/drop-collection.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('testing')
export class DropCollectionController {
  constructor(private readonly dropCollectionService: DropCollectionService) {}
  @Delete('all-data')
  @ApiOperation({
    summary: 'Delete all data.',
    description: 'Delete all collections.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAllData() {
    await this.dropCollectionService.deleteAllData();
  }
}
