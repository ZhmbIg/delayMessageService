import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Message } from './messages.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMessageDTO } from './dto/create-message.dto';
import { EnumMessageStatus } from 'src/common/enums/messageStatus.enum';
import { UpdateMessageDTO } from './dto/update-message.dto';
import { ClientKafka } from '@nestjs/microservices';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MessagesService {
  private readonly kafkaClient: ClientKafka;

  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly usersService: UsersService,
  ) {
    this.kafkaClient = new ClientKafka({
      client: {
        clientId: process.env.KAFKA_CLIENT_ID || 'api-service',
        brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
      },
      producer: {
        allowAutoTopicCreation: true,
      },
    });
  }

  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  async findAll(): Promise<Message[]> {
    return await this.messageRepository.find();
  }

  async findById(id: string): Promise<Message> {
    const message = await this.messageRepository.findOneBy({ id });
    if (!message) {
      throw new NotFoundException('Message not found');
    }
    return message;
  }
  async create(createMessageDto: CreateMessageDTO): Promise<Message> {
    // Check if user exists
    const user = await this.usersService.findById(createMessageDto.userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${createMessageDto.userId} not found`);
    }

    const message = await this.messageRepository.save({
      content: createMessageDto.content,
      user: { id: createMessageDto.userId },
      scheduleTime: createMessageDto.scheduleTime,
      status: EnumMessageStatus.SCHEDULED,
    });

    await this.kafkaClient.emit('message.created', {
      messageId: message.id,
      userId: message.userId,
      content: message.content,
      scheduleTime: message.scheduleTime,
      createdAt: message.createdAt,
    });

    return message;
  }

  async update(id: string, updateMessageDto: UpdateMessageDTO): Promise<Message> {
    const message = await this.findById(id)
    if (!message) {
      throw new NotFoundException('Message not found')
    }
    const updatedMessage = Object.assign(message, updateMessageDto);
    return await this.messageRepository.save(updatedMessage);

  }

  async delete(id: string): Promise<string> {
    const message = await this.findById(id);
    if (!message) {
      throw new NotFoundException('Message not found');
    }
    await this.messageRepository.delete(id);
    return `Message with id ${id} deleted successfully`;
  }

  async findBySatus(status: EnumMessageStatus): Promise<Message[]> {
    const messages = await this.messageRepository.find({ where: { status } })
    if (!messages || messages.length === 0) {
      throw new NotFoundException(`No messages found with status ${status}`);
    }
    return messages
  }

  async markAsStatus(id: string, status: EnumMessageStatus): Promise<Message> {
    const message = await this.findById(id);
    if (!message) {
      throw new NotFoundException('Message not found');
    }
    message.status = status;
    return this.messageRepository.save(message);
  }

  async findByUser(userId: string): Promise<Message[]> {
    return this.messageRepository.find({ where: { user: { id: userId } } });
  }

  async createMessage(userId: string, content: string) {
    const message = await this.messageRepository.save({
      user: { id: userId },
      content,
      status: EnumMessageStatus.SCHEDULED,
    });

    await this.kafkaClient.emit('message.created', {
      messageId: message.id,
      userId: message.userId,
      content: message.content,
      createdAt: message.createdAt,
    });

    return message;
  }

  async scheduleMessage(messageId: string, userId: string, scheduleTime: Date) {
    // Проверка прав через auth-ms
    await this.kafkaClient.emit('message.auth.validate', {
      messageId,
      userId,
    }).toPromise();

    // Планирование сообщения
    const message = await this.messageRepository.findOne({
      where: { id: messageId }
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    message.scheduleTime = scheduleTime;
    const scheduledMessage = await this.messageRepository.save(message);

    // Отправка события в Kafka
    await this.kafkaClient.emit('message.scheduled', {
      messageId: scheduledMessage.id,
      userId,
      scheduleTime,
    });

    return scheduledMessage;
  }
}
