import { Injectable, OnModuleInit } from "@nestjs/common";
import { Kafka, Producer as KafkaProducer } from "kafkajs";
import { Broker } from "./broker";
import { LogProducer } from "./log-producer";
import { Producer } from "./producer";

const retry = { retries: 6 };

@Injectable()
export class KafkaService implements OnModuleInit {
  private readonly clientId: string;
  private readonly broker: Broker;
  private readonly kafkaProducers: Map<string, Producer>;
  private instance: Kafka;
  private logInstance: Kafka;
  private _eventProducer: KafkaProducer;
  private _logProducer: KafkaProducer;

  constructor(
    clientId: string,
    broker: Broker,
    LogProducerClass: new (
      producer: KafkaProducer,
    ) => LogProducer = LogProducer,
  ) {
    this.clientId = clientId;
    this.broker = broker;
    this.kafkaProducers = new Map();

    let logShouldConnect = false;

    this.instance = new Kafka({
      clientId: `${this.clientId}[${Date.now()}]`,
      brokers: [this.broker.eventHost],
    });

    this._eventProducer = this.instance.producer({ retry });

    if (this.broker.logHost && this.broker.logHost !== this.broker.eventHost) {
      console.log(`[kafka-service] use different broker for logging`);
      logShouldConnect = true;
      this.logInstance = new Kafka({
        clientId: `${this.clientId}[${Date.now()}]-log`,
        brokers: [this.broker.logHost],
      });
      this._logProducer = this.logInstance.producer({ retry });
    } else {
      console.log(`[kafka-service] use same broker`);
      this.logInstance = this.instance;
      this._logProducer = this._eventProducer;
    }

    const logTopic = LogProducer.LOG_TOPIC;
    const initiateLogProducer = this.broker.topics.includes(logTopic);
    const eventTopicsOnly = this.broker.topics.filter((t) => t !== logTopic);

    if (initiateLogProducer) {
      const logProducer = new LogProducerClass(this._logProducer);
      this.kafkaProducers.set(logTopic, logProducer);
    }

    for (const topic of eventTopicsOnly) {
      const eventProducer = new Producer(topic, this._eventProducer);
      this.kafkaProducers.set(topic, eventProducer);
    }
  }

  async onModuleInit() {
    let logShouldConnect = false;
    if (this.broker.logHost && this.broker.logHost !== this.broker.eventHost) {
      logShouldConnect = true;
    }

    const connectTask: Promise<any>[] = [];
    connectTask.push(this._eventProducer.connect());
    if (logShouldConnect) {
      connectTask.push(this._logProducer.connect());
    }

    await Promise.all(connectTask);

    console.log(
      `[kafka-service] brokers connected. (${connectTask.length}) broker(s)`,
    );
  }

  /**
   * @param name name or producer's topic
   */
  getProducer(name: string) {
    return this.kafkaProducers.get(name);
  }

  getLogProducer(): LogProducer {
    return <LogProducer>this.kafkaProducers.get(LogProducer.LOG_TOPIC);
  }
}
