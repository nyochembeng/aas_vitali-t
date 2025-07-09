import * as Joi from 'joi';

export const configSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),
  MONGO_URI: Joi.string().uri().required(),
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default('1h'),
  MAILER_HOST: Joi.string().hostname().required(),
  MAILER_PORT: Joi.number().port().required(),
  MAILER_USER: Joi.string().email().required(),
  MAILER_PASS: Joi.string().required(),
  SENTRY_DSN: Joi.string().uri().required(),
  IMGBB_API_KEY: Joi.string().required(),
  IMGBB_ALBUM_ID: Joi.string().required(),
  KAFKA_BROKER: Joi.string().uri().default('localhost:9092'),
  KAFKA_CLIENT_ID: Joi.string().required(),
  KAFKA_AAS_TOPIC: Joi.string().default('user-parameters'),
});
