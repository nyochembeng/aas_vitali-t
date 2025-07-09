import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Producer, ProducerRecord } from 'kafkajs';
import { AppConfigService } from '../config/config.service';
import { Partitioners } from 'kafkajs';

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
  private readonly kafka: Kafka;
  private producer: Producer;

  constructor(private readonly configService: AppConfigService) {
    this.kafka = new Kafka({
      clientId: this.configService.kafkaClientId,
      brokers: [this.configService.kafkaBroker],
      // ssl: true,
      // sasl: {
      //   mechanism: 'plain',
      //   username: this.configService.kafkaApiKey,
      //   password: this.configService.kafkaApiSecret,
      // },
    });
    this.producer = this.kafka.producer({
      createPartitioner: Partitioners.LegacyPartitioner,
    });
  }

  async onModuleInit() {
    await this.producer.connect();
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
  }

  async send(topic: string, message: any): Promise<void> {
    const record: ProducerRecord = {
      topic,
      messages: [{ value: JSON.stringify(message) }],
    };
    await this.producer.send(record);
  }
}
