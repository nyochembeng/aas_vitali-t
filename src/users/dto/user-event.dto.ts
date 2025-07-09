import {
  IsMongoId,
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum UserEventType {
  CREATED = 'UserCreated',
  UPDATED = 'UserUpdated',
  DELETED = 'UserDeleted',
}

export class UserEventDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'Unique user ID',
  })
  @IsMongoId({ message: 'Invalid user ID format' })
  @IsNotEmpty({ message: 'User ID is required' })
  userId: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the user',
  })
  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
  @MinLength(2, { message: 'Full name must be at least 2 characters' })
  @MaxLength(100, { message: 'Full name must not exceed 100 characters' })
  fullname: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address of the user',
  })
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  @MaxLength(255, { message: 'Email must not exceed 255 characters' })
  email: string;

  @ApiProperty({
    example: 'UserCreated',
    description: 'Type of user event',
    enum: UserEventType,
  })
  @IsEnum(UserEventType, { message: 'Invalid event type' })
  @IsNotEmpty({ message: 'Event type is required' })
  eventType: UserEventType;

  @ApiProperty({
    example: '2025-07-09T10:58:00.000Z',
    description: 'Timestamp of the event',
  })
  @IsString()
  @IsNotEmpty({ message: 'Timestamp is required' })
  timestamp: string;
}
