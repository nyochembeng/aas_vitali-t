import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../config/config.service';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: Transporter;

  constructor(private configService: AppConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.mailerConfig.host,
      port: this.configService.mailerConfig.port,
      auth: this.configService.mailerConfig.auth,
    });
  }

  async sendWelcomeEmail(to: string, username: string): Promise<void> {
    await this.transporter.sendMail({
      from: `"Vitali-T" <${this.configService.mailerConfig.auth.user}>`,
      to,
      subject: 'Welcome to Vitali-T!',
      html: `
        <h1>Welcome, ${username}!</h1>
        <p>Thank you for registering with Vitali-T.</p>
        <p>We're excited to have you on board!</p>
      `,
    });
  }

  async sendResetPasswordEmail(
    to: string,
    username: string,
    token: string,
  ): Promise<void> {
    await this.transporter.sendMail({
      from: `"Vitali-T" <${this.configService.mailerConfig.auth.user}>`,
      to,
      subject: 'Reset Your Password',
      html: `
        <h1>Password Reset Request</h1>
        <p>Hi ${username},</p>
        <p>You requested to reset your password. Use the following token to reset it:</p>
        <p><strong>${token}</strong></p>
        <p>This token is valid for 1 hour.</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    });
  }
}
