// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectDataSource } from '@nestjs/typeorm';
// import { DataSource } from 'typeorm';
// import { ObjectId } from 'mongodb';
// import { DeviceDocument } from '../../domain/devices.model';
//
// @Injectable()
// export class DevicesSqlQueryRepository {
//   constructor(@InjectDataSource() private readonly dataSource: DataSource) {}
//   async getDevices(userId: ObjectId) {
//     const devices: DeviceDocument[] = await this.dataSource.query(
//       `
//     SELECT *
//     FROM "DEVICES"
//         WHERE "userId" = $1 AND "deletedAt" IS NULL
//     `,
//       [userId.toString()],
//     );
//     if (!devices.length) {
//       throw new NotFoundException('Devices Not Found');
//     }
//     return devices;
//   }
// }
