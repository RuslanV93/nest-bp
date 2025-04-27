// import {
//   Injectable,
//   InternalServerErrorException,
//   NotFoundException,
// } from '@nestjs/common';
// import { InjectDataSource } from '@nestjs/typeorm';
// import { DataSource } from 'typeorm';
// import { ObjectId } from 'mongodb';
// import { SqlDomainDevice } from '../../domain/devices.domain';
// import { DeviceEntityType } from '../../types/device.types';
//
// @Injectable()
// export class DevicesSqlRepository {
//   constructor(@InjectDataSource() private readonly dataSource: DataSource) {}
//
//   async createDevice(device: SqlDomainDevice) {
//     const newDeviceId: string = await this.dataSource.query(
//       `
//     INSERT INTO "DEVICES"
//     ("userId", ip, "loginDate", "lastActivity", title, "tokenVersion", "deviceId")
//     VALUES($1, $2, $3, $4, $5, $6, $7)
//     RETURNING "deviceId"
//     `,
//       [
//         device.userId.toString(),
//         device.ip,
//         device.loginDate,
//         device.lastActivity,
//         device.title,
//         device.tokenVersion,
//         device.deviceId,
//       ],
//     );
//     if (!newDeviceId) {
//       throw new InternalServerErrorException('Something went wrong');
//     }
//     return newDeviceId;
//   }
//
//   async findOneByDeviceId(deviceId: string): Promise<SqlDomainDevice | null> {
//     const device: DeviceEntityType[] = await this.dataSource.query(
//       `
//     SELECT * FROM "DEVICES"
//         WHERE "deviceId" = $1 AND "deletedAt" IS NULL
//     `,
//       [deviceId],
//     );
//     if (!device.length) {
//       return null;
//     }
//     return SqlDomainDevice.fromSqlResult(device[0]);
//   }
//   async findSessionByDeviceId(deviceId: string, userId: ObjectId) {
//     const session: DeviceEntityType[] = await this.dataSource.query(
//       `
//     SELECT * FROM "DEVICES"
//         WHERE "deviceId" = $1
//         AND "userId" = $2
//         AND "deletedAt" IS NULL
//     `,
//       [deviceId, userId.toString()],
//     );
//     if (!session.length) return null;
//     return SqlDomainDevice.fromSqlResult(session[0]);
//   }
//
//   async findOrNotFoundException(deviceId: string) {
//     const device = await this.findOneByDeviceId(deviceId);
//     if (!device) {
//       throw new NotFoundException(`Device ${deviceId} not found`);
//     }
//     return device;
//   }
//   async findAll(userId: ObjectId, deviceId: string) {
//     const devices: DeviceEntityType[] = await this.dataSource.query(
//       `
//       SELECT * FROM "DEVICES"
//         WHERE "userId" = $1 AND "deviceId" <> $2 AND "deletedAt" IS NULL
//     `,
//       [userId.toString(), deviceId],
//     );
//     if (!devices.length) {
//       throw new NotFoundException('Devices not found');
//     }
//     return devices.map((device) => SqlDomainDevice.fromSqlResult(device));
//   }
//   async deleteDevice(deviceData: SqlDomainDevice | SqlDomainDevice[]) {
//     const now = new Date();
//     if (Array.isArray(deviceData)) {
//       const deviceMap = deviceData.map((device) => device.deviceId);
//
//       await this.dataSource.query(
//         `
//        UPDATE "DEVICES"
//        SET "deletedAt" = $1
//        WHERE "deviceId" IN (${deviceMap.map((_, i) => `$${i + 2}`).join(',')})
//        `,
//         [now, ...deviceMap],
//       );
//     } else {
//       await this.dataSource.query(
//         `
//       UPDATE "DEVICES"
//       SET "deletedAt" = $1
//       WHERE "deviceId" = $2
//       `,
//         [now, deviceData.deviceId],
//       );
//     }
//   }
//   async updateSession(device: SqlDomainDevice) {
//     await this.dataSource.query(
//       `
//     UPDATE "DEVICES"
//     SET "ip" = $1, "title" = $2, "tokenVersion" = $3, "lastActivity" = $4
//     WHERE "deviceId" = $5
//     `,
//       [
//         device.ip,
//         device.title,
//         device.tokenVersion,
//         device.lastActivity,
//         device.deviceId,
//       ],
//     );
//   }
// }
