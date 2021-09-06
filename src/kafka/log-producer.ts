import { Producer as KafkaProducer } from "kafkajs";
import { Producer } from "./producer";

export interface LogBody {}

export class LogProducer extends Producer {
  public static readonly LOG_TOPIC: string = process.env.LOGS || "logs";

  constructor(producer: KafkaProducer) {
    super(LogProducer.LOG_TOPIC, producer);
  }

  async send<T>(data: T) {
    throw new Error("NotImplemented");
  }

  async sendLog(key: string, message: string) {
    const body = {};
    await super.send<LogBody>(body);
  }
}
