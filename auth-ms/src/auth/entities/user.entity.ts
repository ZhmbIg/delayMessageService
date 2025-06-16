import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { EnumRoles } from '../../common/enum/EnumRoles.enum';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: EnumRoles,
        default: EnumRoles.USER
    })
    role: EnumRoles;

    @CreateDateColumn()
    createdAt: Date;
}