import { BazaEntity } from '../../../../shared/types/base.entity.type';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../../users/domain/users.orm.domain';
import { DeviceDomainDto } from '../types/device.types';
import { ObjectId } from 'mongodb';

@Entity()
export class Device extends BazaEntity {
  @ManyToOne(() => User)
  user: User;

  @Column()
  userId: number;

  @Column()
  ip: string;

  @Column()
  lastActivity: Date;

  @Column()
  title: string;

  @Column()
  tokenVersion: string;

  @Column()
  deviceId: string;

  static createInstance(deviceDto: DeviceDomainDto) {
    const device = new this();
    device.userId = deviceDto.userId;
    device.ip = deviceDto.ip;
    device.title = deviceDto.title;
    device.tokenVersion = deviceDto.tokenVersion;
    device.lastActivity = new Date();
    device.deviceId = deviceDto.deviceId;
    return device;
  }
  updateSession(updatedSession: DeviceDomainDto) {
    this.ip = updatedSession.ip;
    this.title = updatedSession.title;
    this.tokenVersion = updatedSession.tokenVersion;
    this.lastActivity = new Date();
  }
}
