import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { DeviceDocument } from '../../domain/devices.model';
import { ObjectId } from 'mongodb';

@Injectable()
export class DevicesSqlRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async createDevice(device: DeviceDocument) {
    const newDeviceId: string = await this.dataSource.query(
      `
    INSERT INTO "DEVICES" 
    ("userId", ip, "loginDate", "lastActivity", title, "tokenVersion", "deviceId")
    VALUES($1, $2, $3, $4, $5, $6, $7)
    RETURNING "deviceId"
    `,
      [
        device.userId.toString(),
        device.ip,
        device.loginDate,
        device.lastActivity,
        device.title,
        device.tokenVersion,
        device.deviceId,
      ],
    );
    if (!newDeviceId) {
      throw new InternalServerErrorException('Something went wrong');
    }
    return newDeviceId;
  }

  async findOneByDeviceId(deviceId: string): Promise<DeviceDocument> {
    const device: DeviceDocument[] = await this.dataSource.query(
      `
    SELECT * FROM "DEVICES"
        WHERE "deviceId" = $1 AND "deletedAt" IS NULL
    `,
      [deviceId],
    );
    return device[0];
  }
  async findSessionByTokenVersion(tokenVersion: string, userId: ObjectId) {
    const session: DeviceDocument[] = await this.dataSource.query(
      `
    SELECT * FROM "DEVICES"
        WHERE "tokenVersion" = $1
        AND "userId" = $2
        AND "deletedAt" IS NULL
    `,
      [tokenVersion, userId],
    );
    if (!session.length) return null;
    return session[0];
  }

  async findOrNotFoundException(deviceId: string) {
    const device = await this.findOneByDeviceId(deviceId);
    if (!device) {
      throw new NotFoundException(`Device ${deviceId} not found`);
    }
    return device;
  }
  async findAll(userId: ObjectId, deviceId: string) {
    const devices: DeviceDocument[] = await this.dataSource.query(
      `
      SELECT * FROM "DEVICES"
        WHERE "userId" = $1; AND "deviceId" <> $2
    `,
      [userId, deviceId],
    );
    if (!devices.length) {
      throw new NotFoundException('Devices not found');
    }
    return devices;
  }
  async deleteDevice(deviceData: DeviceDocument | DeviceDocument[]) {
    const now = new Date();
    if (Array.isArray(deviceData)) {
      const deviceMap = deviceData.map((device) => device.deviceId);

      await this.dataSource.query(
        `
       UPDATE "DEVICES"
       SET "deletedAt" = $1
       WHERE "deviceId" IN (${deviceMap.map((_, i) => `$${i + 2}`).join(',')})
       `,
        [now, ...deviceMap],
      );
    } else {
      await this.dataSource.query(
        `
      UPDATE  "DEVICES"
      SET "deletedAt" = $1
      WHERE "deviceId" = $2
      `,
        [now, deviceData.deviceId],
      );
    }
  }
}
