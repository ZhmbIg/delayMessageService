import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaService implements OnModuleInit {
  private readonly kafkaClient: ClientKafka;

  constructor() {
    this.kafkaClient = new ClientKafka({
      client: {
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

  async emit(topic: string, message: any) {
    return this.kafkaClient.emit(topic, message);
  }
}
