import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { LoginDto } from '../users/dto/login.dto';
import { SignUpDto } from '../users/dto/signup.dto';
import { ForgotPasswordDto } from '../users/dto/forgot-password.dto';
import { ResetPasswordDto } from '../users/dto/reset-password.dto';
import { UserSchema } from '../users/schemas/user.schema';
import { model } from 'mongoose';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  const User = model('User', UserSchema);

  const mockAuthService = {
    login: jest.fn(),
    signup: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return access token and user on successful login', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };
      const result = {
        access_token: 'jwt_token',
        user: { id: '123', email: 'test@example.com', fullname: 'John Doe' },
      };
      mockAuthService.login.mockResolvedValue(result);

      const response = await controller.login(loginDto);
      expect(response).toEqual(result);
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
      expect(mockAuthService.login).toHaveBeenCalledTimes(1);
    });

    it('should throw UnauthorizedException on invalid credentials', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrong',
      };
      mockAuthService.login.mockRejectedValue(
        new UnauthorizedException('Invalid credentials'),
      );

      await expect(controller.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
      expect(mockAuthService.login).toHaveBeenCalledTimes(1);
    });
  });

  describe('signup', () => {
    it('should return access token and user on successful registration', async () => {
      const signUpDto: SignUpDto = {
        fullname: 'John Doe',
        email: 'test@example.com',
        password: 'Password123!',
      };
      const result = {
        access_token: 'jwt_token',
        user: { id: '123', email: 'test@example.com', fullname: 'John Doe' },
      };
      mockAuthService.signup.mockResolvedValue(result);

      const response = await controller.signup(signUpDto);
      expect(response).toEqual(result);
      expect(mockAuthService.signup).toHaveBeenCalledWith(signUpDto);
      expect(mockAuthService.signup).toHaveBeenCalledTimes(1);
    });

    it('should throw ConflictException if email exists', async () => {
      const signUpDto: SignUpDto = {
        fullname: 'John Doe',
        email: 'test@example.com',
        password: 'Password123!',
      };
      mockAuthService.signup.mockRejectedValue(
        new ConflictException('Email already exists'),
      );

      await expect(controller.signup(signUpDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockAuthService.signup).toHaveBeenCalledWith(signUpDto);
      expect(mockAuthService.signup).toHaveBeenCalledTimes(1);
    });
  });

  describe('forgotPassword', () => {
    it('should return success message for password reset email', async () => {
      const forgotPasswordDto: ForgotPasswordDto = {
        email: 'test@example.com',
      };
      const result = {
        message: 'If the email exists, a reset link has been sent',
      };
      mockAuthService.forgotPassword.mockResolvedValue(result);

      const response = await controller.forgotPassword(forgotPasswordDto);
      expect(response).toEqual(result);
      expect(mockAuthService.forgotPassword).toHaveBeenCalledWith(
        forgotPasswordDto,
      );
      expect(mockAuthService.forgotPassword).toHaveBeenCalledTimes(1);
    });
  });

  describe('resetPassword', () => {
    it('should reset password successfully', async () => {
      const resetPasswordDto: ResetPasswordDto = {
        resetPasswordToken: 'reset_token',
        resetPasswordExpires: new Date(Date.now() + 3600000), // 1 hour from now
        password: 'NewPassword123!',
      };
      const result = { message: 'Password has been reset successfully' };
      mockAuthService.resetPassword.mockResolvedValue(result);

      const response = await controller.resetPassword(resetPasswordDto);
      expect(response).toEqual(result);
      expect(mockAuthService.resetPassword).toHaveBeenCalledWith(
        resetPasswordDto,
      );
      expect(mockAuthService.resetPassword).toHaveBeenCalledTimes(1);
    });

    it('should throw BadRequestException for invalid or expired token', async () => {
      const resetPasswordDto: ResetPasswordDto = {
        resetPasswordToken: 'invalid_token',
        resetPasswordExpires: new Date(Date.now() - 3600000), // 1 hour ago
        password: 'NewPassword123!',
      };
      mockAuthService.resetPassword.mockRejectedValue(
        new BadRequestException('Invalid or expired reset token'),
      );

      await expect(controller.resetPassword(resetPasswordDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockAuthService.resetPassword).toHaveBeenCalledWith(
        resetPasswordDto,
      );
      expect(mockAuthService.resetPassword).toHaveBeenCalledTimes(1);
    });
  });

  describe('getProfile', () => {
    it('should return user profile', () => {
      const user = new User({
        _id: '123',
        fullname: 'John Doe',
        email: 'test@example.com',
        password: 'hashedPassword',
        resetPasswordToken: null,
        resetPasswordExpires: null,
      });
      const result = controller.getProfile(user);
      expect(result).toEqual({ user });
    });
  });
});
