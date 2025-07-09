import { KafkaOptions, Transport } from '@nestjs/microservices';
import { AppConfigService } from '../config/config.service';

export const kafkaConfig = (configService: AppConfigService): KafkaOptions => ({
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: configService.kafkaClientId,
      brokers: [configService.kafkaBroker],
    },
    consumer: {
      groupId: 'dps-consumer-group',
    },
  },
});
