import { Injectable } from "@nestjs/common";
import { KafkaService } from "./kafka/kafka.service";
import { LogLevel } from "./kafka/log-level";
import { LogProducer } from "./kafka/log-producer";
import { Producer } from "./kafka/producer";

@Injectable()
export class AppService {
  private logProducer: LogProducer;
  private tisProducer: Producer;

  constructor(private readonly kafkaService: KafkaService) {
    this.logProducer = kafkaService.getLogProducer();
    this.tisProducer = kafkaService.getProducer("tis-data");
  }

  getHello(): string {
    // this.logProducer.sendLog()
    return "Hello World!";
  }
}
