import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BazaEntity } from '../../../../shared/types/base.entity.type';
import { User } from './users.orm.domain';

@Entity()
export class PasswordInfo extends BazaEntity {
  @Column()
  passwordHash: string;

  @Column({ type: 'varchar', nullable: true })
  passwordRecoveryCode: string | null;

  @Column({ type: 'timestamp', nullable: true })
  passwordRecoveryCodeExpirationDate: Date | null;

  @OneToOne(() => User, (u) => u.passwordInfo, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: User;
}
