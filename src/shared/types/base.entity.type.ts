import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

export class BaseEntity {
  @PrimaryColumn()
  _id: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt: Date;
  @VersionColumn({ default: 1 })
  version: number;
}
