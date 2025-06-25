import {
  IsDate,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDateNotInFuture,
  IsValidAge,
  IsValidConceivedDate,
  IsValidDueDate,
} from '../../common/decorators/profile-validators.decorator';

class DoctorContactDto {
  @ApiProperty({
    example: 'Dr. Jane Smith',
    description: 'Doctor name',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: '1234567890',
    description: 'Doctor phone number',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(7, { message: 'Doctor phone number must be at least 7 digits' })
  @MaxLength(15, { message: 'Doctor phone number must not exceed 15 digits' })
  @Matches(/^\d+$/, { message: 'Doctor phone number must contain only digits' })
  phoneNumber?: string;

  @ApiProperty({
    example: 'jane.smith@example.com',
    description: 'Doctor email',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\S+@\S+\.\S+$/, { message: 'Invalid doctor email address' })
  @MaxLength(255, { message: 'Doctor email must not exceed 255 characters' })
  email?: string;
}

export class UpdateProfileDto {
  @ApiProperty({
    example: '1990-01-01',
    description: 'Date of birth',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @IsDateNotInFuture({ message: 'Date of birth cannot be in the future' })
  @IsValidAge({ message: 'Age must be between 13 and 120 years' })
  dateOfBirth?: Date;

  @ApiProperty({ example: '170.5', description: 'Height', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^[0-9]+(\.[0-9]+)?$/, { message: 'Height must be a valid number' })
  @Transform(({ value }) => (value ? String(value) : value) as string)
  height?: string;

  @ApiProperty({ example: 'cm', description: 'Height unit', required: false })
  @IsOptional()
  @IsEnum(['cm', 'ft'], { message: 'Height unit must be cm or ft' })
  heightUnit?: 'cm' | 'ft';

  @ApiProperty({ example: '70.5', description: 'Weight', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^[0-9]+(\.[0-9]+)?$/, { message: 'Weight must be a valid number' })
  @Transform(({ value }) => (value ? String(value) : value) as string)
  weight?: string;

  @ApiProperty({ example: 'kg', description: 'Weight unit', required: false })
  @IsOptional()
  @IsEnum(['kg', 'lbs'], { message: 'Weight unit must be kg or lbs' })
  weightUnit?: 'kg' | 'lbs';

  @ApiProperty({
    example: '1234567890',
    description: 'Phone number',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(7, { message: 'Phone number must be at least 7 digits' })
  @MaxLength(15, { message: 'Phone number must not exceed 15 digits' })
  @Matches(/^\d+$/, { message: 'Phone number must contain only digits' })
  phoneNumber?: string;

  @ApiProperty({ example: '+1', description: 'Country code', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^\+\d{1,4}$/, { message: 'Invalid country code' })
  countryCode?: string;

  @ApiProperty({
    example: '2025-01-01',
    description: 'Conceived date',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @IsDateNotInFuture({ message: 'Conceived date cannot be in the future' })
  @IsValidConceivedDate({
    message: 'Conceived date must be within the last 9 months',
  })
  conceivedDate?: Date;

  @ApiProperty({
    example: '2025-10-01',
    description: 'Due date',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @IsValidDueDate({
    message: 'Due date must be 37–42 weeks from conceived date',
  })
  dueDate?: Date;

  @ApiProperty({ description: 'Doctor contact information', required: false })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => DoctorContactDto)
  doctorContact?: DoctorContactDto;

  @ApiProperty({
    example: { key: 'value' },
    description: 'Additional metadata',
    required: false,
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
