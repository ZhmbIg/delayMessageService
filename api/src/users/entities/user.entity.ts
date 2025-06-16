import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { Message } from '../../messages/entities/message.entity';
import { EnumRoles } from '../../common/enums/roles.enum';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column({
        type: 'enum',
        enum: EnumRoles,
        default: EnumRoles.USER
    })
    role: EnumRoles;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => Message, (message) => message.user, {
        cascade: true,
        eager: false
    })
    messages: Message[];
}