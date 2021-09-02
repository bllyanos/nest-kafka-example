import { Injectable } from '@nestjs/common';
import { KafkaService } from './kafka/kafka.service';
import { LogProducer } from './kafka/log-producer';
import { Producer } from './kafka/producer';

@Injectable()
export class AppService {
  private logProducer: LogProducer;
  private tisProducer: Producer;

  constructor(private readonly kafkaService: KafkaService) {
    this.logProducer = kafkaService.getLogProducer();
    this.tisProducer = kafkaService.getProducer('tis-data');
  }

  getHello(): string {
    this.logProducer.sendLog('hello', 'helo');
    return 'Hello World!';
  }
}
