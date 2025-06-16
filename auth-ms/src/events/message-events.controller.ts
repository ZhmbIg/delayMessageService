import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AuthService } from '../auth/auth.service';

@Controller()
export class MessageEventsController {
  constructor(private readonly authService: AuthService) {}

  @EventPattern('message.auth.validate')
  async validateMessageAccess(
    @Payload() data: { messageId: string; userId: string }
  ) {
    return await this.authService.validateUserAccess(
      data.userId,
      data.messageId
    );
  }
}