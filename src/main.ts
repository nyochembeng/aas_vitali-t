import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './docs/swagger.config';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { RateLimiterMiddleware } from './common/middlewares/rate-limiter.middleware';
import { RequestIdMiddleware } from './common/middlewares/request-id.middleware';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as compression from 'compression';
import { AppConfigService } from './config/config.service';
import { setupSentry } from './instrument';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    // Set global prefix for API routes
    app.setGlobalPrefix('api');

    // Security and performance middleware
    app.use(helmet());
    app.use(compression());
    app.enableCors();

    // Sentry setup
    setupSentry(app);

    // Global pipes, filters, and interceptors
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.useGlobalFilters(new GlobalExceptionFilter());
    app.useGlobalInterceptors(new ResponseInterceptor());

    // Global middleware - bind methods to avoid unbound method issues
    const requestIdMiddleware = new RequestIdMiddleware();
    const rateLimiterMiddleware = new RateLimiterMiddleware();
    const loggerMiddleware = new LoggerMiddleware();

    app.use(requestIdMiddleware.use.bind(requestIdMiddleware));
    app.use(rateLimiterMiddleware.use.bind(rateLimiterMiddleware));
    app.use(loggerMiddleware.use.bind(loggerMiddleware));

    // Swagger setup
    setupSwagger(app);

    const configService = app.get(AppConfigService);
    const port = configService.port || 3001;
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}/docs`);
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
}

// Properly handle the promise
bootstrap().catch((error) => {
  console.error('Bootstrap failed:', error);
  process.exit(1);
});
