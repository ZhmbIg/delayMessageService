import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/users.entity';
import { EnumMessageStatus } from '../common/enums/messageStatus.enum';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  content: string;

  @ManyToOne(() => User, user => user.messages)
  user: User;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({
    type: 'enum',
    enum: EnumMessageStatus,
    default: EnumMessageStatus.SCHEDULED
  })
  status: EnumMessageStatus;

  @Column({ type: 'timestamp', nullable: true })
  scheduleTime: Date;

  @CreateDateColumn()
  createdAt: Date;
}
