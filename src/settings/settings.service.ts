import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';
import { CreateSettingsDto } from './dto/create-settings.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { Types } from 'mongoose';
import { Settings } from './schemas/settings.schema';

export type SettingsDocument = Settings & Document;

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(Settings.name)
    private readonly settingsModel: Model<SettingsDocument>,
  ) {}

  async createSettings(
    userId: string,
    createSettingsDto: CreateSettingsDto,
  ): Promise<Settings> {
    const existingSettings = await this.settingsModel
      .findOne({ userId })
      .exec();
    if (existingSettings) {
      throw new BadRequestException('Settings already exist for this user');
    }

    if (userId !== createSettingsDto.userId) {
      throw new UnauthorizedException('User ID mismatch');
    }

    const settings = new this.settingsModel({
      ...createSettingsDto,
      userId: new Types.ObjectId(userId),
      lastUpdated: new Date().toISOString(),
    });

    return settings.save();
  }

  async getSettings(userId: string): Promise<Settings> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const settings = await this.settingsModel.findOne({ userId }).exec();
    if (!settings) {
      throw new NotFoundException('Settings not found');
    }
    return settings;
  }

  async updateSettings(
    userId: string,
    updateSettingsDto: UpdateSettingsDto,
  ): Promise<Settings> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const settings = await this.settingsModel
      .findOneAndUpdate(
        { userId },
        {
          $set: { ...updateSettingsDto, lastUpdated: new Date().toISOString() },
        },
        { new: true, runValidators: true },
      )
      .exec();

    if (!settings) {
      throw new NotFoundException('Settings not found');
    }
    return settings;
  }

  async deleteSettings(userId: string): Promise<void> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const result = await this.settingsModel.deleteOne({ userId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Settings not found');
    }
  }
}
