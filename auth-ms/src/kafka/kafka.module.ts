import { Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { KafkaController } from './kafka.controller';

@Module({
  controllers: [KafkaController],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}
