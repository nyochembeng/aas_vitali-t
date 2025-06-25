import { INestApplication } from '@nestjs/common';
import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { AppConfigService } from './config/config.service';

export function setupSentry(app: INestApplication) {
  const configService = app.get(AppConfigService);

  // Ensure to call this before requiring any other modules!
  Sentry.init({
    dsn: configService.sentryDsn || 'your_sentry_dsn_here',
    environment: configService.nodeEnv,
    integrations: [
      // Add our Profiling integration
      nodeProfilingIntegration(),
    ],
    // Add Tracing by setting tracesSampleRate
    // We recommend adjusting this value in production
    tracesSampleRate: configService.nodeEnv === 'production' ? 0.2 : 1.0,
    // Set sampling rate for profiling
    // This is relative to tracesSampleRate
    profilesSampleRate: configService.nodeEnv === 'production' ? 0.2 : 1.0,
    debug: configService.nodeEnv === 'development',
  });
}
