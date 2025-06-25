import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';

@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
  private limiter = new RateLimiterMemory({
    points: 100, // 100 requests
    duration: 60, // per minute
  });

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      await this.limiter.consume(req.ip || '');
      next();
    } catch (error) {
      res.status(HttpStatus.TOO_MANY_REQUESTS).json({
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        message: 'Too many requests, please try again later.',
      });
    }
  }
}
