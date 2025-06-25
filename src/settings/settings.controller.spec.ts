import { Test, TestingModule } from '@nestjs/testing';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { CreateSettingsDto } from './dto/create-settings.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Settings } from './schemas/settings.schema';

describe('SettingsController', () => {
  let controller: SettingsController;
  let settingsService: SettingsService;

  const mockSettingsService = {
    createSettings: jest.fn(),
    getSettings: jest.fn(),
    updateSettings: jest.fn(),
    deleteSettings: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SettingsController],
      providers: [{ provide: SettingsService, useValue: mockSettingsService }],
    }).compile();

    controller = module.get<SettingsController>(SettingsController);
    settingsService = module.get<SettingsService>(SettingsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create settings', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const createSettingsDto: CreateSettingsDto = {
        userId,
        language: 'en',
        themePreferences: { mode: 'light' },
        notificationPreferences: { monitoringAlerts: true },
        monitoringPreferences: { alertSensitivity: 'standard' },
        dataSharing: { analytics: true, research: false },
      };
      const settings = new Settings({ ...createSettingsDto, _id: '123' });
      mockSettingsService.createSettings.mockResolvedValue(settings);

      const result = await controller.create(userId, createSettingsDto);
      expect(result).toEqual(settings);
      expect(mockSettingsService.createSettings).toHaveBeenCalledWith(
        userId,
        createSettingsDto,
      );
    });

    it('should throw BadRequestException if settings exist', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const createSettingsDto: CreateSettingsDto = { userId, language: 'en' };
      mockSettingsService.createSettings.mockRejectedValue(
        new BadRequestException('Settings already exist'),
      );

      await expect(
        controller.create(userId, createSettingsDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getSettings', () => {
    it('should return settings', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const settings = new Settings({ userId, _id: '123', language: 'en' });
      mockSettingsService.getSettings.mockResolvedValue(settings);

      const result = await controller.getSettings(userId);
      expect(result).toEqual(settings);
      expect(mockSettingsService.getSettings).toHaveBeenCalledWith(userId);
    });

    it('should throw NotFoundException if settings not found', async () => {
      const userId = '507f1f77bcf86cd799439011';
      mockSettingsService.getSettings.mockRejectedValue(
        new NotFoundException('Settings not found'),
      );

      await expect(controller.getSettings(userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update settings', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const updateSettingsDto: UpdateSettingsDto = { language: 'es' };
      const settings = new Settings({ userId, _id: '123', language: 'es' });
      mockSettingsService.updateSettings.mockResolvedValue(settings);

      const result = await controller.update(userId, updateSettingsDto);
      expect(result).toEqual(settings);
      expect(mockSettingsService.updateSettings).toHaveBeenCalledWith(
        userId,
        updateSettingsDto,
      );
    });

    it('should throw NotFoundException if settings not found', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const updateSettingsDto: UpdateSettingsDto = { language: 'es' };
      mockSettingsService.updateSettings.mockRejectedValue(
        new NotFoundException('Settings not found'),
      );

      await expect(
        controller.update(userId, updateSettingsDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete settings', async () => {
      const userId = '507f1f77bcf86cd799439011';
      mockSettingsService.deleteSettings.mockResolvedValue(undefined);

      await expect(controller.delete(userId)).resolves.toBeUndefined();
      expect(mockSettingsService.deleteSettings).toHaveBeenCalledWith(userId);
    });

    it('should throw NotFoundException if settings not found', async () => {
      const userId = '507f1f77bcf86cd799439011';
      mockSettingsService.deleteSettings.mockRejectedValue(
        new NotFoundException('Settings not found'),
      );

      await expect(controller.delete(userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
