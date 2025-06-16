import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
      },
      consumer: {
        groupId: process.env.KAFKA_CONSUMER_GROUP || 'auth-consumer',
      },
    },
  });

  app.enableCors();
  
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));

  await app.startAllMicroservices();
  await app.listen(3001);
}
bootstrap();
