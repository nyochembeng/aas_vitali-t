import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { AppController, TestController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigService } from './config/config.service';
import { User } from './users/schemas/user.schema';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;
  let configService: AppConfigService;

  const mockAppService = {
    getHello: jest.fn().mockReturnValue('Hello World!'),
  };

  const mockConfigService = {
    nodeEnv: 'test',
    port: 3000,
    mongoUri: 'mongodb://localhost:27017/test',
    jwtSecret: 'test-secret',
    jwtExpiresIn: '1h',
    mailerConfig: { host: 'localhost', port: 587 },
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
        {
          provide: AppConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
    configService = app.get<AppConfigService>(AppConfigService);
  });

  describe('getHello', () => {
    it('should return "Hello World!"', () => {
      const result = appController.getHello();
      expect(result).toBe('Hello World!');
      expect(() => appService.getHello()).toHaveBeenCalled();
    });
  });

  describe('getConfig', () => {
    it('should return application configuration', () => {
      const result = appController.getConfig();
      expect(result).toEqual({
        nodeEnv: 'test',
        port: 3000,
        mongoUri: 'mongodb://localhost:27017/test',
        jwtSecret: 'test-secret',
        jwtExpiresIn: '1h',
        mailerConfig: { host: 'localhost', port: 587 },
      });
    });
  });

  describe('testSentry', () => {
    it('should throw an error', () => {
      expect(() => appController.testSentry()).toThrow('Test Sentry error');
    });
  });
});

describe('TestController', () => {
  let testController: TestController;

  const mockJwtAuthGuard = {
    canActivate: jest.fn().mockReturnValue(true),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TestController],
      providers: [],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    testController = app.get<TestController>(TestController);
  });

  describe('getProtected', () => {
    it('should return user object when authenticated', () => {
      const mockUser = new User({
        _id: '123',
        fullname: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
        resetPasswordToken: null,
        resetPasswordExpires: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = testController.getProtected(mockUser);
      expect(result).toEqual({ user: mockUser });
    });
  });
});
