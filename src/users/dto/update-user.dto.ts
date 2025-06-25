import {
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
  IsDate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'User full name',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Full name must be at least 2 characters' })
  @MaxLength(100, { message: 'Full name must not exceed 100 characters' })
  @Matches(/^[a-zA-Z\s]+$/, {
    message: 'Full name must contain only letters and spaces',
  })
  fullname?: string;

  @ApiProperty({
    example: 'reset_token',
    description: 'Password reset token',
    required: false,
  })
  @IsOptional()
  @IsString()
  resetPasswordToken?: string;

  @ApiProperty({
    example: 'NewPassword123!',
    description: 'New password',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(128, { message: 'Password must not exceed 128 characters' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  password?: string;

  @ApiProperty({
    example: '2024-12-31T23:59:59.000Z',
    description: 'Token expiration date and time',
    required: false,
  })
  @IsOptional()
  @IsDate({ message: 'Expires must be a valid ISO date string' })
  resetPasswordExpires?: Date;
}
