import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './schemas/user.schema';
import { MailModule } from 'src/mail/mail.module';
import { AppConfigModule } from 'src/config/config.module';
import { KafkaProducerService } from 'src/kafka/kafka.producer.service';

@Module({
  imports: [
    MailModule,
    AppConfigModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UsersService, KafkaProducerService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
