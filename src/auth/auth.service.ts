import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { PasswordUtils } from '../common/utils/password.utils';
import { v4 as uuidv4 } from 'uuid';
import { LoginDto } from '../users/dto/login.dto';
import { SignUpDto } from '../users/dto/signup.dto';
import { ForgotPasswordDto } from '../users/dto/forgot-password.dto';
import { ResetPasswordDto } from '../users/dto/reset-password.dto';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.usersService.findByEmail(email);
      if (
        user &&
        (await PasswordUtils.comparePassword(password, user.password))
      ) {
        const userObject = user.toObject ? (user.toObject() as User) : user;
        const { password: _, ...result } = userObject;
        return result as User;
      }
      return null;
    } catch (error) {
      throw new InternalServerErrorException('Error validating user');
    }
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ access_token: string; user: any }> {
    try {
      const user = await this.validateUser(loginDto.email, loginDto.password);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = { email: user.email, sub: user._id };
      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user._id,
          email: user.email,
          fullname: user.fullname,
        },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Error during login');
    }
  }

  async signup(
    signUpDto: SignUpDto,
  ): Promise<{ access_token: string; user: any }> {
    try {
      const existingUser = await this.usersService.findByEmail(signUpDto.email);
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      const hashedPassword = await PasswordUtils.hashPassword(
        signUpDto.password,
      );
      const user = await this.usersService.create({
        fullname: signUpDto.fullname,
        email: signUpDto.email,
        password: hashedPassword,
      });

      this.mailService
        .sendWelcomeEmail(user.email, user.fullname)
        .catch((error) => {
          console.error('Failed to send welcome email:', error);
        });

      const payload = { email: user.email, sub: user._id };
      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user._id,
          email: user.email,
          fullname: user.fullname,
        },
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Error during signup');
    }
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    try {
      const user = await this.usersService.findByEmail(forgotPasswordDto.email);
      if (!user) {
        return { message: 'If the email exists, a reset link has been sent' };
      }

      const token = uuidv4();
      const expires = new Date(Date.now() + 3600 * 1000); // 1 hour

      await this.usersService.update(user._id as string, {
        resetPasswordToken: token,
        resetPasswordExpires: expires,
      });

      this.mailService
        .sendResetPasswordEmail(user.email, user.fullname, token)
        .catch((error) => {
          console.error('Failed to send reset password email:', error);
        });

      return { message: 'If the email exists, a reset link has been sent' };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error processing forgot password request',
      );
    }
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    try {
      const user = await this.usersService.findByResetToken(
        resetPasswordDto.resetPasswordToken,
      );

      if (
        !user ||
        !user.resetPasswordExpires ||
        user.resetPasswordExpires < new Date()
      ) {
        throw new BadRequestException('Invalid or expired reset token');
      }

      const hashedPassword = await PasswordUtils.hashPassword(
        resetPasswordDto.password,
      );

      await this.usersService.update(user._id as string, {
        password: hashedPassword,
        resetPasswordToken: undefined,
        resetPasswordExpires: undefined,
      });

      return { message: 'Password has been reset successfully' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error resetting password');
    }
  }
}
