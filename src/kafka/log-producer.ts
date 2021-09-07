import { Producer as KafkaProducer } from "kafkajs";
import { LogLevel } from "./log-level";
import { Producer } from "./producer";

export interface LogBody {}

export class LogProducer extends Producer {
  public static readonly LOG_TOPIC: string = process.env.LOGS || "logs";

  /**
   * returns service name to send to kafka. extends this class and override to change
   */
  public static getServiceName(): string {
    return process.env.SERVICE_NAME || "mcp-js";
  }

  constructor(producer: KafkaProducer) {
    super(LogProducer.LOG_TOPIC, producer);
  }

  async sendLog<T = any>(
    context: string,
    level: LogLevel,
    title: string,
    uniqueId: string,
    data: T,
  ) {
    try {
      const body = {
        data: JSON.stringify(data),
        "X-B3-TraceId": uniqueId,
        message: title,
        level,
        context,
        service: LogProducer.getServiceName(),
      };
      await super.send<LogBody>(body);
    } catch (err) {
      console.log(`[send-log] send-log-error::`, err.message);
    }
  }
}
