import { Module } from '@nestjs/common';
import { UserEventsController } from './user-events.controller';
import { MessageEventsController } from './message-events.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [UserEventsController, MessageEventsController],
})
export class EventsModule {}
