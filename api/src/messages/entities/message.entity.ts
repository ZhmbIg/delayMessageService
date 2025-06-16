import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { EnumMessageStatus } from '../../common/enums/messageStatus.enum';

@Entity('messages')
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    content: string;

    @ManyToOne(() => User, (user) => user.messages, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
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