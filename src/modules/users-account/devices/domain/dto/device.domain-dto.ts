import { ObjectId } from 'mongodb';

export class DeviceDomainDto {
  userId: string;
  ip: string;
  title: string;
  tokenVersion: string;
  deviceId: string;
}
