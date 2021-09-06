import { DynamicModule, Module, Provider } from "@nestjs/common";
import { Broker } from "./broker";
import { KafkaService } from "./kafka.service";

@Module({
  providers: [KafkaService],
})
export class KafkaModule {
  static forRoot(clientId: string, broker: Broker): DynamicModule {
    const kafkaProvider: Provider<KafkaService> = {
      provide: KafkaService,
      useFactory() {
        return new KafkaService(clientId, broker);
      },
    };

    return {
      module: KafkaModule,
      global: true,
      providers: [kafkaProvider],
      exports: [kafkaProvider],
    };
  }
}
