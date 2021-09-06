import { Producer as KafkaProducer } from "kafkajs";

export class Producer {
  private readonly topic: string;
  private readonly producer: KafkaProducer;

  constructor(topic: string, producer?: KafkaProducer) {
    this.topic = topic;
    this.producer = producer;
  }

  async send<T = any>(data: T) {
    await this.producer.send({
      topic: this.topic,
      messages: [{ value: JSON.stringify(data) }],
    });
  }
}
