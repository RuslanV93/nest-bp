import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../../shared/types/base.entity.type';
import { User } from './users.orm.domain';

@Entity()
export class PasswordInfo extends BaseEntity {
  @Column()
  passwordHash: string;

  @Column({ type: 'varchar', nullable: true })
  passwordRecoveryCode: string | null;

  @Column({ type: 'timestamp', nullable: true })
  passwordRecoveryCodeExpirationDate: Date | null;

  @OneToOne(() => User, (u) => u.passwordInfo)
  @JoinColumn()
  user: User;
}
