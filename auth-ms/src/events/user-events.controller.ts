import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AuthService } from '../auth/auth.service';

@Controller()
export class UserEventsController {
  constructor(private readonly authService: AuthService) {}

  @EventPattern('user.validate')
  async handleUserValidation(@Payload() data: { userId: string }) {
    return await this.authService.validateUserById(data.userId);
  }

  @EventPattern('user.permissions')
  async handlePermissionsCheck(
    @Payload() data: { userId: string; resource: string }
  ) {
    return await this.authService.checkUserPermissions(
      data.userId,
      data.resource
    );
  }
}