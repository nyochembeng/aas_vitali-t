import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Profile } from './schemas/profile.schema';

describe('ProfileController', () => {
  let controller: ProfileController;
  let profileService: ProfileService;

  const mockProfileService = {
    createProfile: jest.fn(),
    getProfile: jest.fn(),
    updateProfile: jest.fn(),
    uploadProfileImage: jest.fn(),
    deleteProfile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [{ provide: ProfileService, useValue: mockProfileService }],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
    profileService = module.get<ProfileService>(ProfileService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a profile', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const createProfileDto: CreateProfileDto = {
        userId,
        dateOfBirth: new Date('1990-01-01'),
        height: '170.5',
        heightUnit: 'cm',
        weight: '70.5',
        weightUnit: 'kg',
        phoneNumber: '1234567890',
        countryCode: '+1',
        conceivedDate: new Date('2025-01-01'),
        doctorContact: { name: 'Dr. Jane', phoneNumber: '1234567890' },
      };
      const profile = new Profile({ ...createProfileDto, _id: '123' });
      mockProfileService.createProfile.mockResolvedValue(profile);

      const result = await controller.create(userId, createProfileDto);
      expect(result).toEqual(profile);
      expect(mockProfileService.createProfile).toHaveBeenCalledWith(
        userId,
        createProfileDto,
      );
    });

    it('should throw BadRequestException if profile exists', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const createProfileDto: CreateProfileDto = {
        userId,
        dateOfBirth: new Date('1990-01-01'),
        height: '170.5',
        heightUnit: 'cm',
        weight: '70.5',
        weightUnit: 'kg',
        phoneNumber: '1234567890',
        countryCode: '+1',
        conceivedDate: new Date('2025-01-01'),
        doctorContact: { name: 'Dr. Jane', phoneNumber: '1234567890' },
      };
      mockProfileService.createProfile.mockRejectedValue(
        new BadRequestException('Profile already exists'),
      );

      await expect(controller.create(userId, createProfileDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getProfile', () => {
    it('should return a profile', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const profile = new Profile({
        userId,
        _id: '123',
        dateOfBirth: new Date('1990-01-01'),
      });
      mockProfileService.getProfile.mockResolvedValue(profile);

      const result = await controller.getProfile(userId);
      expect(result).toEqual(profile);
      expect(mockProfileService.getProfile).toHaveBeenCalledWith(userId);
    });

    it('should throw NotFoundException if profile not found', async () => {
      const userId = '507f1f77bcf86cd799439011';
      mockProfileService.getProfile.mockRejectedValue(
        new NotFoundException('Profile not found'),
      );

      await expect(controller.getProfile(userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a profile', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const updateProfileDto: UpdateProfileDto = { height: '175.0' };
      const profile = new Profile({ userId, _id: '123', height: '175.0' });
      mockProfileService.updateProfile.mockResolvedValue(profile);

      const result = await controller.update(userId, updateProfileDto);
      expect(result).toEqual(profile);
      expect(mockProfileService.updateProfile).toHaveBeenCalledWith(
        userId,
        updateProfileDto,
      );
    });

    it('should throw NotFoundException if profile not found', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const updateProfileDto: UpdateProfileDto = { height: '175.0' };
      mockProfileService.updateProfile.mockRejectedValue(
        new NotFoundException('Profile not found'),
      );

      await expect(controller.update(userId, updateProfileDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('uploadImage', () => {
    it('should upload profile image', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const file = {
        buffer: Buffer.from(''),
        originalname: 'test.jpg',
        mimetype: 'image/jpeg',
        size: 1000,
      } as Express.Multer.File;
      const profile = new Profile({
        userId,
        _id: '123',
        profileImage: 'https://i.ibb.co/test.jpg',
      });
      mockProfileService.uploadProfileImage.mockResolvedValue(profile);

      const result = await controller.uploadImage(userId, file);
      expect(result).toEqual(profile);
      expect(mockProfileService.uploadProfileImage).toHaveBeenCalledWith(
        userId,
        file,
      );
    });

    it('should throw BadRequestException for invalid file', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const file = {
        buffer: Buffer.from(''),
        originalname: 'test.txt',
        mimetype: 'text/plain',
        size: 1000,
      } as Express.Multer.File;
      mockProfileService.uploadProfileImage.mockRejectedValue(
        new BadRequestException('Invalid file type'),
      );

      await expect(controller.uploadImage(userId, file)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('delete', () => {
    it('should delete a profile', async () => {
      const userId = '507f1f77bcf86cd799439011';
      mockProfileService.deleteProfile.mockResolvedValue(undefined);

      await expect(controller.delete(userId)).resolves.toBeUndefined();
      expect(mockProfileService.deleteProfile).toHaveBeenCalledWith(userId);
    });

    it('should throw NotFoundException if profile not found', async () => {
      const userId = '507f1f77bcf86cd799439011';
      mockProfileService.deleteProfile.mockRejectedValue(
        new NotFoundException('Profile not found'),
      );

      await expect(controller.delete(userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
