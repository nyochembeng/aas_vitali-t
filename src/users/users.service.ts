import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { UserEventDto, UserEventType } from './dto/user-event.dto';
import { KafkaProducerService } from 'src/kafka/kafka.producer.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private kafkaProducerService: KafkaProducerService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new this.userModel(createUserDto);
    const savedUser = await user.save();

    // Publish UserCreated event to Kafka
    const userEvent: UserEventDto = {
      userId: (savedUser._id as string).toString(),
      fullname: savedUser.fullname,
      email: savedUser.email,
      eventType: UserEventType.CREATED,
      timestamp: new Date().toISOString(),
    };
    await this.kafkaProducerService.send('user-parameters', userEvent);

    return savedUser;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).select('+password').exec();
  }

  async findByResetToken(token: string): Promise<User | null> {
    return this.userModel
      .findOne({ resetPasswordToken: token })
      .select('+password')
      .exec();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Publish UserUpdated event to Kafka
    const userEvent: UserEventDto = {
      userId: (user._id as string).toString(),
      fullname: user.fullname,
      email: user.email,
      eventType: UserEventType.UPDATED,
      timestamp: new Date().toISOString(),
    };
    await this.kafkaProducerService.send('user-parameters', userEvent);

    return user;
  }

  async delete(id: string): Promise<void> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Publish UserDeleted event to Kafka
    const userEvent: UserEventDto = {
      userId: (user._id as string).toString(),
      fullname: user.fullname,
      email: user.email,
      eventType: UserEventType.DELETED,
      timestamp: new Date().toISOString(),
    };
    await this.kafkaProducerService.send('user-parameters', userEvent);

    await this.userModel.findByIdAndDelete(id).exec();
  }
}
