import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class ThemePreferencesDto {
  @ApiProperty({
    example: 'light',
    enum: ['light', 'dark', 'system'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['light', 'dark', 'system'], { message: 'Invalid theme mode' })
  mode?: 'light' | 'dark' | 'system';
}

export class NotificationPreferencesDto {
  @ApiProperty({ example: true, required: false })
  @IsOptional()
  monitoringAlerts?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  dailyHealthTips?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  weeklyReports?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  symptomReminders?: boolean;
}

export class MonitoringPreferencesDto {
  @ApiProperty({
    example: 'standard',
    enum: ['standard', 'sensitive'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['standard', 'sensitive'], { message: 'Invalid alert sensitivity' })
  alertSensitivity?: 'standard' | 'sensitive';

  @ApiProperty({
    example: 'daily',
    enum: ['daily', 'weekly', 'monthly'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['daily', 'weekly', 'monthly'], {
    message: 'Invalid notification frequency',
  })
  notificationFrequency?: 'daily' | 'weekly' | 'monthly';

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  reminderNotifications?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  healthEducationUpdates?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  insightsFromDataTrends?: boolean;
}

export class DataSharingDto {
  @ApiProperty({ example: true, required: false })
  @IsOptional()
  analytics?: boolean;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  research?: boolean;
}

export class CreateSettingsDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'User ID' })
  @IsString()
  @IsNotEmpty({ message: 'User ID is required' })
  userId: string;

  @ApiProperty({ type: ThemePreferencesDto, required: false })
  @IsOptional()
  @IsObject()
  @Transform(
    ({ value }: { value: ThemePreferencesDto | null | undefined }) =>
      value || {},
  )
  themePreferences?: ThemePreferencesDto;

  @ApiProperty({ type: NotificationPreferencesDto, required: false })
  @IsOptional()
  @IsObject()
  @Transform(({ value }: { value: NotificationPreferencesDto }) => value || {})
  notificationPreferences?: NotificationPreferencesDto;

  @ApiProperty({ type: MonitoringPreferencesDto, required: false })
  @IsOptional()
  @IsObject()
  @Transform(({ value }: { value: MonitoringPreferencesDto }) => value || {})
  monitoringPreferences?: MonitoringPreferencesDto;

  @ApiProperty({ example: 'en', description: 'Language code' })
  @IsString()
  @MinLength(2, { message: 'Language code must be at least 2 characters' })
  @IsNotEmpty({ message: 'Language is required' })
  language: string;

  @ApiProperty({ type: DataSharingDto, required: false })
  @IsOptional()
  @IsObject()
  @Transform(({ value }: { value: DataSharingDto }) => value || {})
  dataSharing?: DataSharingDto;

  @ApiProperty({ example: '2025-06-21T12:00:00Z', required: false })
  @IsOptional()
  @IsString()
  lastUpdated?: string;
}
