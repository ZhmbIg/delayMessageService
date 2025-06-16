import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { OnEvent } from '@nestjs/event-emitter';
import { EnumRoles } from 'src/common/enums/roles.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  @OnEvent('user.created')
  async handleUserCreated(data: { id: string; email: string; role: EnumRoles }) {
    await this.userRepository.save({
      id: data.id,
      email: data.email,
      role: data.role
    });
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException(`User with email ${email} not found`);
    return user;
  }


  async create(userData: CreateUserDTO): Promise<User> {
    const existingUser = await this.userRepository.findOne({ where: { email: userData.email } });
    if (existingUser) {
      throw new NotFoundException(`User with email ${userData.email} already exists`);
    }
    const user = await this.userRepository.create(userData);
    return await this.userRepository.save(user);
  }

  async update(id: string, updateData: UpdateUserDTO): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const updatedUser = Object.assign(user, updateData);
    return await this.userRepository.save(updatedUser);
  }

  async delete(id: string): Promise<string> {
    await this.userRepository.delete(id);
    return `User with id ${id} deleted successfully`;
  }

  async createFromAuth(userData: {
    id: string;
    email: string;
    role: string;
    createdAt: Date;
  }): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { id: userData.id }
    });

    if (existingUser) {
      return existingUser;
    }

    const newUser = this.userRepository.create({
      id: userData.id,
      email: userData.email,
      role: userData.role as EnumRoles,
      createdAt: userData.createdAt
    });

    return await this.userRepository.save(newUser);
  }
}
