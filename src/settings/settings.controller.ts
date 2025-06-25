import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { CreateSettingsDto } from './dto/create-settings.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { Settings } from './schemas/settings.schema';

@ApiTags('settings')
@Controller('settings')
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create user settings' })
  @ApiResponse({
    status: 201,
    description: 'Settings created successfully',
    type: Settings,
  })
  @ApiResponse({
    status: 400,
    description: 'Settings already exist or invalid data',
  })
  async create(
    @GetUser('sub') userId: string,
    @Body() createSettingsDto: CreateSettingsDto,
  ) {
    return this.settingsService.createSettings(userId, createSettingsDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get user settings' })
  @ApiResponse({ status: 200, description: 'Settings found', type: Settings })
  @ApiResponse({ status: 404, description: 'Settings not found' })
  async getSettings(@GetUser('sub') userId: string) {
    return this.settingsService.getSettings(userId);
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user settings' })
  @ApiResponse({
    status: 200,
    description: 'Settings updated successfully',
    type: Settings,
  })
  @ApiResponse({ status: 404, description: 'Settings not found' })
  async update(
    @GetUser('sub') userId: string,
    @Body() updateSettingsDto: UpdateSettingsDto,
  ) {
    return this.settingsService.updateSettings(userId, updateSettingsDto);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user settings' })
  @ApiResponse({ status: 204, description: 'Settings deleted successfully' })
  @ApiResponse({ status: 404, description: 'Settings not found' })
  async delete(@GetUser('sub') userId: string) {
    await this.settingsService.deleteSettings(userId);
  }
}
