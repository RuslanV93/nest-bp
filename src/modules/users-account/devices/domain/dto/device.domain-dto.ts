import { ObjectId } from 'mongodb';

export class DeviceDomainDto {
  userId: ObjectId;
  ip: string;
  title: string;
  tokenVersion: string;
  deviceId: string;
}
