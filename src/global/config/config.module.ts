import { Global, Module } from '@nestjs/common';
import { ConfigService, ConfigModule as NestConfig } from '@nestjs/config';
import * as Joi from 'joi';
import config from 'src/config/config';

@Global()
@Module({
  imports: [
    NestConfig.forRoot({
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        NODE_ENV: Joi.string().required(),
        JWT_ACCESS: Joi.string().required(),
        JWT_REFRESH: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USER: Joi.string().required(),
        DB_PASS: Joi.string().required(),
      }),
      load: [config],
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
