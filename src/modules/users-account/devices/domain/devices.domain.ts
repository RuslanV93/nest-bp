import { InternalServerErrorException } from '@nestjs/common';

export type DeviceEntityType = {
  _id: string;
  userId: string;
  ip: string;
  loginDate: Date;
  lastActivity: Date;
  title: string;
  tokenVersion: string;
  deviceId: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt?: Date | null;
};

export type DeviceDomainDto = {
  userId: string;
  ip: string;
  title: string;
  tokenVersion: string;
  deviceId: string;
};

import { ObjectId } from 'mongodb';

export class SqlDomainDevice {
  _id: string;
  userId: string;
  ip: string;
  loginDate: Date;
  lastActivity: Date;
  title: string;
  tokenVersion: string;
  deviceId: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;

  constructor(data: DeviceEntityType) {
    this._id = data._id;
    this.userId = data.userId;
    this.ip = data.ip;
    this.loginDate = data.loginDate ? new Date(data.loginDate) : new Date();
    this.lastActivity = data.lastActivity
      ? new Date(data.lastActivity)
      : new Date();
    this.title = data.title;
    this.tokenVersion = data.tokenVersion;
    this.deviceId = data.deviceId;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.deletedAt = data.deletedAt ? data.deletedAt : null;
  }

  static fromSqlResult(sqlRow: DeviceEntityType): SqlDomainDevice {
    return new SqlDomainDevice(sqlRow);
  }

  static createInstance(deviceDto: DeviceDomainDto): SqlDomainDevice {
    const newId = new ObjectId().toString();
    const now = new Date();

    const device = new SqlDomainDevice({
      _id: newId,
      userId: deviceDto.userId,
      ip: deviceDto.ip,
      title: deviceDto.title,
      tokenVersion: deviceDto.tokenVersion,
      deviceId: deviceDto.deviceId,
      loginDate: now,
      lastActivity: now,
      createdAt: null,
      updatedAt: null,
      deletedAt: null,
    });

    return device;
  }
  updateSession(updatedSession: DeviceDomainDto) {
    this.ip = updatedSession.ip;
    this.title = updatedSession.title;
    this.tokenVersion = updatedSession.tokenVersion;
    this.lastActivity = new Date();
  }
}
