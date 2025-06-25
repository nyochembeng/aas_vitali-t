import {
  Controller,
  Get,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AppService } from './app.service';
import { AppConfigService } from './config/config.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { GetUser } from './common/decorators/get-user.decorator';
import { User } from './users/schemas/user.schema';
import { Public } from './common/decorators/public.decorator';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: AppConfigService,
  ) {}

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get hello message' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns hello message',
    schema: {
      type: 'string',
      example: 'Hello World!',
    },
  })
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get('config')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get application configuration' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns application configuration',
    schema: {
      type: 'object',
      properties: {
        nodeEnv: { type: 'string' },
        port: { type: 'number' },
        mongoUri: { type: 'string' },
        jwtSecret: { type: 'string' },
        jwtExpiresIn: { type: 'string' },
        mailerConfig: { type: 'object' },
      },
    },
  })
  getConfig() {
    return {
      nodeEnv: this.configService.nodeEnv,
      port: this.configService.port,
      mongoUri: this.configService.mongoUri,
      jwtSecret: this.configService.jwtSecret,
      jwtExpiresIn: this.configService.jwtExpiresIn,
      mailerConfig: this.configService.mailerConfig,
    };
  }

  @Public()
  @Get('test-sentry')
  @HttpCode(HttpStatus.INTERNAL_SERVER_ERROR)
  @ApiOperation({ summary: 'Test Sentry error reporting' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Throws an error for Sentry testing',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: { type: 'string', example: 'Test Sentry error' },
        error: { type: 'string', example: 'Internal Server Error' },
      },
    },
  })
  testSentry() {
    throw new Error('Test Sentry error');
  }
}

@ApiTags('Test')
@Controller('test')
export class TestController {
  @Get('protected')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get protected resource' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns user information for authenticated user',
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          description: 'User object',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid or missing JWT token',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  getProtected(@GetUser() user: User) {
    return { user };
  }
}
