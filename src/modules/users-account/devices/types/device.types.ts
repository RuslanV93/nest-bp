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
