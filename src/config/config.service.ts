import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV')!;
  }

  get port(): number {
    return this.configService.get<number>('PORT')!;
  }

  get mongoUri(): string {
    return this.configService.get<string>('MONGO_URI')!;
  }

  get jwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET')!;
  }

  get jwtExpiresIn(): string {
    return this.configService.get<string>('JWT_EXPIRES_IN')!;
  }

  get mailerConfig(): {
    host: string;
    port: number;
    auth: { user: string; pass: string };
  } {
    return {
      host: this.configService.get<string>('MAILER_HOST')!,
      port: this.configService.get<number>('MAILER_PORT')!,
      auth: {
        user: this.configService.get<string>('MAILER_USER')!,
        pass: this.configService.get<string>('MAILER_PASS')!,
      },
    };
  }

  get sentryDsn(): string {
    return this.configService.get<string>('SENTRY_DSN')!;
  }

  get imgbbApiKey(): string {
    return this.configService.get<string>('IMGBB_API_KEY')!;
  }

  get imgbbAlbumId(): string {
    return this.configService.get<string>('IMGBB_ALBUM_ID')!;
  }
}
