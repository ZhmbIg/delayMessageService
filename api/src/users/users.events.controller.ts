import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';

@Controller()
export class UsersEventsController {
    constructor(private readonly usersService: UsersService) {}

    @EventPattern('user.created')
    async handleUserCreated(@Payload() data: { 
        id: string; 
        email: string; 
        role: string;
        createdAt: Date;
    }) {
        await this.usersService.createFromAuth(data);
    }
}