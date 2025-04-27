import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BazaEntity } from '../../../../shared/types/base.entity.type';
import { User } from './users.orm.domain';

@Entity()
export class EmailInfo extends BazaEntity {
  @Column()
  confirmCode: string;

  @Column({ type: 'timestamp', nullable: true })
  codeExpirationDate: Date | null;

  @Column()
  isConfirmed: boolean;

  @Column({ type: 'timestamp', nullable: true })
  emailConfirmationCooldown: Date | null;

  @OneToOne(() => User, (u) => u.emailConfirmationInfo, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: User;
}
