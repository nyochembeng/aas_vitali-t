import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ImageUtils } from '../common/utils/image.utils';
import { Types } from 'mongoose';
import { Profile } from './schemas/profile.schema';
import { AppConfigService } from 'src/config/config.service';

export type ProfileDocument = Profile & Document;

@Injectable()
export class ProfileService {
  private readonly imageUtils: ImageUtils;

  constructor(
    @InjectModel(Profile.name)
    private readonly profileModel: Model<ProfileDocument>,
    private readonly configService: AppConfigService,
  ) {
    this.imageUtils = new ImageUtils(configService);
  }

  async createProfile(
    userId: string,
    createProfileDto: CreateProfileDto,
  ): Promise<Profile> {
    const existingProfile = await this.profileModel.findOne({ userId }).exec();
    if (existingProfile) {
      throw new BadRequestException('Profile already exists for this user');
    }

    if (userId !== createProfileDto.userId) {
      throw new UnauthorizedException('User ID mismatch');
    }

    const profile = new this.profileModel({
      ...createProfileDto,
      userId: new Types.ObjectId(userId),
    });

    return profile.save();
  }

  async getProfile(userId: string): Promise<Profile> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const profile = await this.profileModel.findOne({ userId }).exec();
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }

  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const profile = await this.profileModel
      .findOneAndUpdate(
        { userId },
        { $set: updateProfileDto },
        { new: true, runValidators: true },
      )
      .exec();

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }

  async uploadProfileImage(
    userId: string,
    file: Express.Multer.File,
  ): Promise<Profile> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const profile = await this.profileModel.findOne({ userId }).exec();
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const imageUrl = await this.imageUtils.uploadToImgBB(file);

    const updatedProfile = await this.profileModel
      .findOneAndUpdate({ userId }, { profileImage: imageUrl }, { new: true })
      .exec();

    if (!updatedProfile) {
      throw new NotFoundException('Profile not found after update');
    }
    return updatedProfile;
  }

  async deleteProfile(userId: string): Promise<void> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const result = await this.profileModel.deleteOne({ userId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Profile not found');
    }
  }

  async getProfilesByIds(userIds: string[]): Promise<Profile[]> {
    const validUserIds = userIds
      .filter((id) => Types.ObjectId.isValid(id))
      .map((id) => new Types.ObjectId(id));
    if (validUserIds.length === 0) {
      return [];
    }

    return this.profileModel.find({ userId: { $in: validUserIds } }).exec();
  }

  async profileExists(userId: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(userId)) {
      return false;
    }
    return (await this.profileModel.countDocuments({ userId }).exec()) > 0;
  }
}
