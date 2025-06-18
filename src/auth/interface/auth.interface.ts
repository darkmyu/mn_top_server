import { Provider } from '@prisma/client';

export interface OAuthUser {
  email?: string;
  provider: Provider;
  providerId: string;
  profileImage?: string;
}

export interface JwtPayload {
  sub: number;
  email: string;
  username: string;
}
