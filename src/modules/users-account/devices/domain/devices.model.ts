import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument, Model } from 'mongoose';
import { DeviceDomainDto } from './dto/device.domain-dto';

@Schema({ timestamps: true })
export class Device {
  @Prop()
  userId: ObjectId;

  @Prop()
  ip: string;

  @Prop()
  loginDate: Date;

  @Prop()
  lastActivity: Date;

  @Prop()
  title: string;

  @Prop()
  tokenVersion: string;

  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: Date, nullable: true })
  deletedAt: Date | null;

  static createInstance(this: DeviceModelType, newDevice: DeviceDomainDto) {
    const device = new this();
    device.userId = newDevice.userId;
    device.ip = newDevice.ip;
    device.title = newDevice.title;
    device.tokenVersion = newDevice.tokenVersion;
    device.lastActivity = new Date();
    device.loginDate = new Date();
    return device;
  }
  updateLastActivityInfo(updatedSession: DeviceDomainDto) {
    this.ip = updatedSession.ip;
    this.title = updatedSession.title;
    this.tokenVersion = updatedSession.tokenVersion;
    this.lastActivity = new Date();
  }
  deleteDevice() {
    this.deletedAt = new Date();
  }
}
export const DeviceSchema = SchemaFactory.createForClass(Device);
DeviceSchema.loadClass(Device);
export type DeviceDocument = HydratedDocument<Device>;
export type DeviceModelType = Model<DeviceDocument> & typeof Device;
