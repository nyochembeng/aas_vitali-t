import {
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ThemePreferencesDto,
  NotificationPreferencesDto,
  MonitoringPreferencesDto,
  DataSharingDto,
} from './create-settings.dto';

export class UpdateSettingsDto {
  @ApiProperty({ type: ThemePreferencesDto, required: false })
  @IsOptional()
  @IsObject()
  @Transform(({ value }: { value: ThemePreferencesDto }) => value || {})
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

  @ApiProperty({ example: 'en', required: false })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Language code must be at least 2 characters' })
  language?: string;

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
