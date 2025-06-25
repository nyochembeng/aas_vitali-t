import {
  IsDate,
  IsEnum,
  IsNotEmpty,
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
  @ApiProperty({ example: 'Dr. Jane Smith', description: 'Doctor name' })
  @IsString()
  @IsNotEmpty({ message: 'Doctor name is required' })
  name: string;

  @ApiProperty({ example: '1234567890', description: 'Doctor phone number' })
  @IsString()
  @MinLength(7, { message: 'Doctor phone number must be at least 7 digits' })
  @MaxLength(15, { message: 'Doctor phone number must not exceed 15 digits' })
  @Matches(/^\d+$/, { message: 'Doctor phone number must contain only digits' })
  phoneNumber: string;

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

export class CreateProfileDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'User ID' })
  @IsString()
  @IsNotEmpty({ message: 'User ID is required' })
  userId: string;

  @ApiProperty({ example: '1990-01-01', description: 'Date of birth' })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty({ message: 'Date of birth is required' })
  @IsDateNotInFuture({ message: 'Date of birth cannot be in the future' })
  @IsValidAge({ message: 'Age must be between 13 and 120 years' })
  dateOfBirth: Date;

  @ApiProperty({ example: '170.5', description: 'Height', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^[0-9]+(\.[0-9]+)?$/, { message: 'Height must be a valid number' })
  @Transform(({ value }) => (value ? String(value) : value) as string)
  height?: string;

  @ApiProperty({ example: 'cm', description: 'Height unit' })
  @IsEnum(['cm', 'ft'], { message: 'Height unit must be cm or ft' })
  @IsNotEmpty({ message: 'Height unit is required' })
  heightUnit: 'cm' | 'ft';

  @ApiProperty({ example: '70.5', description: 'Weight', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^[0-9]+(\.[0-9]+)?$/, { message: 'Weight must be a valid number' })
  @Transform(({ value }) => (value ? String(value) : value) as string)
  weight?: string;

  @ApiProperty({ example: 'kg', description: 'Weight unit' })
  @IsEnum(['kg', 'lbs'], { message: 'Weight unit must be kg or lbs' })
  @IsNotEmpty({ message: 'Weight unit is required' })
  weightUnit: 'kg' | 'lbs';

  @ApiProperty({ example: '1234567890', description: 'Phone number' })
  @IsString()
  @MinLength(7, { message: 'Phone number must be at least 7 digits' })
  @MaxLength(15, { message: 'Phone number must not exceed 15 digits' })
  @Matches(/^\d+$/, { message: 'Phone number must contain only digits' })
  @IsNotEmpty({ message: 'Phone number is required' })
  phoneNumber: string;

  @ApiProperty({ example: '+1', description: 'Country code' })
  @IsString()
  @Matches(/^\+\d{1,4}$/, { message: 'Invalid country code' })
  @IsNotEmpty({ message: 'Country code is required' })
  countryCode: string;

  @ApiProperty({ example: '2025-01-01', description: 'Conceived date' })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty({ message: 'Conceived date is required' })
  @IsDateNotInFuture({ message: 'Conceived date cannot be in the future' })
  @IsValidConceivedDate({
    message: 'Conceived date must be within the last 9 months',
  })
  conceivedDate: Date;

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

  @ApiProperty({ description: 'Doctor contact information' })
  @IsObject()
  @ValidateNested()
  @Type(() => DoctorContactDto)
  @IsNotEmpty({ message: 'Doctor contact is required' })
  doctorContact: DoctorContactDto;

  @ApiProperty({
    example: { key: 'value' },
    description: 'Additional metadata',
    required: false,
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
