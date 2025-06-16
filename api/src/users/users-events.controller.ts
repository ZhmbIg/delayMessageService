import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { KafkaTopics } from '../common/enums/kafka-topics.enum';

@Controller()
export class UsersEventsController {
    private readonly logger = new Logger(UsersEventsController.name);
    
    constructor(private readonly usersService: UsersService) {}

    @EventPattern(KafkaTopics.USER_CREATED)
    async handleUserCreated(@Payload() data: { 
        id: string; 
        email: string; 
        role: string;
        createdAt: Date;
    }) {
        this.logger.debug(`Received user.created event: ${JSON.stringify(data)}`);
        
        try {
            const result = await this.usersService.createFromAuth(data);
            this.logger.debug(`User created in messages_db: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            this.logger.error(`Error creating user: ${error.message}`);
            throw error;
        }
    }
}