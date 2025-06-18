import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import * as Joi from 'joi';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      skipProcessEnv: true,
      validationSchema: Joi.object({
        PORT: Joi.number().default(4000),
        DATABASE_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        GOOGLE_CLIENT_ID: Joi.string().required(),
        GOOGLE_CLIENT_SECRET: Joi.string().required(),
        GOOGLE_CALLBACK_URL: Joi.string().required(),
        NAVER_CLIENT_ID: Joi.string().required(),
        NAVER_CLIENT_SECRET: Joi.string().required(),
        NAVER_CALLBACK_URL: Joi.string().required(),
        KAKAO_CLIENT_ID: Joi.string().required(),
        KAKAO_CLIENT_SECRET: Joi.string().required(),
        KAKAO_CALLBACK_URL: Joi.string().required(),
      }),
    }),
    PrismaModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
