import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadImageDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'User ID',
    required: false,
  })
  @IsOptional()
  @IsString()
  userId?: string;
}
