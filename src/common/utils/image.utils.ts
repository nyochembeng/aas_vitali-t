import { BadRequestException } from '@nestjs/common';
import * as imgbbUploader from 'imgbb-uploader';
import { AppConfigService } from '../../config/config.service';

export class ImageUtils {
  constructor(private readonly configService: AppConfigService) {}

  async uploadToImgBB(file: Express.Multer.File): Promise<string> {
    this.validateImage(file);

    try {
      const apiKey = this.configService.imgbbApiKey;
      const albumId = this.configService.imgbbAlbumId;
      if (!apiKey) {
        throw new BadRequestException('ImgBB API key not configured');
      }
      if (!albumId) {
        throw new BadRequestException('ImgBB album ID not configured');
      }

      const response = await imgbbUploader({
        apiKey,
        base64string: file.buffer.toString('base64'),
        name: file.originalname,
        expiration: 0, // No expiration
        album: albumId, // Upload to Vitali-T album
      });

      return response.url;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new BadRequestException(
        `Failed to upload image to ImgBB: ${errorMessage}`,
      );
    }
  }

  validateImage(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('No image file provided');
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed',
      );
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds 5MB limit');
    }
  }
}
