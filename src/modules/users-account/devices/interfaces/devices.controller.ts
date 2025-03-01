import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetDevicesQuery } from '../application/use-cases/get-devices.query-handler';
import { ExtractUserFromRequest } from '../../auth/guards/decorators/extract-user-from-request-decorator';
import { UserContextDto } from '../../auth/guards/dto/user-context.dto';
import { DeviceViewDto } from './dto/devices.view-dto';
import {
  DeleteOtherDevicesCommand,
  DeleteSpecifiedDeviceCommand,
} from '../application/use-cases/delete-device.use-case';
import { RefreshGuard } from '../../auth/guards/bearer/jwt-refresh-auth-guard';

@Controller('/security/devices')
export class DevicesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @UseGuards(RefreshGuard)
  async getDevices(
    @ExtractUserFromRequest() user: UserContextDto,
  ): Promise<DeviceViewDto[]> {
    const devices: DeviceViewDto[] = await this.queryBus.execute(
      new GetDevicesQuery(user.id),
    );
    return devices;
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RefreshGuard)
  async terminateOtherSessions(
    @ExtractUserFromRequest() user: UserContextDto,
  ): Promise<void> {
    await this.commandBus.execute(
      new DeleteOtherDevicesCommand(user.id, user.deviceId),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RefreshGuard)
  async terminateSessionById(
    @Param('id') id: string,
    @ExtractUserFromRequest() user: UserContextDto,
  ) {
    if (id === user.deviceId) {
      throw new ForbiddenException();
    }
    await this.commandBus.execute(
      new DeleteSpecifiedDeviceCommand(user.id, id),
    );
  }
}
