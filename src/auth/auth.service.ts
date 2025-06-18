import { EnvironmentVariables } from '@/common/interface/config.interface';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { OAuthUser } from './interface/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnvironmentVariables, true>,
  ) {}

  async findUserById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async validateOAuthUser(socialUser: OAuthUser): Promise<User> {
    let user = await this.prisma.user.findUnique({
      where: {
        provider: socialUser.provider,
        providerId: socialUser.providerId,
      },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: socialUser,
      });
    }

    return user;
  }
}
