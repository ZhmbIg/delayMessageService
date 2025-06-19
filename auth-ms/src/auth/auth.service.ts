import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import * as jwt from 'jsonwebtoken';
import { TokenResponseDTO } from './dto/token-response.dto';
import { RedisService } from 'src/redis/redis.service';
import { EnumRoles } from 'src/common/enum/EnumRoles.enum';
import { KafkaService } from '../kafka/kafka.service';
import { KafkaTopics } from '../common/enum/kafka-topics.enum';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly redisService: RedisService,
        private readonly kafkaService: KafkaService,
    ) { }

    async register(dto: RegisterDTO): Promise<User> {
        const existingUser = await this.userRepository.findOne({ where: { email: dto.email } });
        if (existingUser) {
            throw new NotFoundException('Email already exists');
        }
        const { email, password, role = EnumRoles.USER } = dto
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = this.userRepository.create({ email, password: hashedPassword, role })
        const user = await this.userRepository.save(newUser);

        await this.kafkaService.emit(KafkaTopics.USER_CREATED, {
            id: user.id,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
        });

        return user;
    }

    async validateUser(dto: LoginDTO): Promise<TokenResponseDTO> {
        const { email, password } = dto;
        const user = await this.userRepository.findOne({ where: { email } });

        if (!user) {
            throw new NotFoundException('Email not found');
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            throw new NotFoundException('Invalid password');
        }

        return this.generateTokens(user.id);
    }


    async generateTokens(userId: string): Promise<TokenResponseDTO> {
        const user = await this.userRepository.findOne({ where: { id: userId } });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const payload = {
            sub: userId,
            email: user.email,
            role: user.role
        };

        const accessToken = jwt.sign(
            payload,
            `${process.env.JWT_ACCESS_SECRET}`,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            payload,
            `${process.env.JWT_REFRESH_SECRET}`,
            { expiresIn: '7d' }
        );

        await this.redisService.set(userId, refreshToken);
        return { accessToken, refreshToken };
    }

    async validateUserById(userId: string) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        return user;
    }

    async checkUserPermissions(userId: string, resource: string) {
        const user = await this.validateUserById(userId);
        return {
            userId: user.id,
            resource,
            hasAccess: true
        };
    }

    async validateUserAccess(userId: string, messageId: string) {
        const user = await this.validateUserById(userId);
        return {
            userId: user.id,
            messageId,
            hasAccess: true
        };
    }
}
