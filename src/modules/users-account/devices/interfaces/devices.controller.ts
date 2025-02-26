import { Controller, Delete, Get, Param } from '@nestjs/common';

@Controller('/security/devices')
export class DevicesController {
  constructor() {}

  @Get()
  async getDevices() {}

  @Delete()
  async terminateOtherSessions() {}

  @Delete(':id')
  async terminateSessionById(@Param('id') id: string) {}
}
