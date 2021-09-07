import { Body, Controller, Get, Post } from "@nestjs/common";
import { AppService } from "./app.service";
import { KafkaService } from "./kafka/kafka.service";
import { LogLevel } from "./kafka/log-level";
import { LogProducer } from "./kafka/log-producer";
import { RequestId } from "./request-id.decorator";

@Controller()
export class AppController {
  private readonly logProducer: LogProducer;

  constructor(
    private readonly appService: AppService,
    kafkaService: KafkaService,
  ) {
    this.logProducer = kafkaService.getLogProducer();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("/cc")
  async processCC(@Body() data: any, @RequestId() reqId: string) {
    this.logProducer.sendLog(
      "process-cc",
      LogLevel.INFO,
      "request-body",
      reqId,
      { ...data },
    );
    return { message: "Hello" };
  }
}
