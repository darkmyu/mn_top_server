import { Provider } from '@prisma/client';

export interface OAuthUser {
  email?: string;
  provider: Provider;
  providerId: string;
  profileImage?: string;
}

export interface TokenPayload {
  id: number;
  username: string;
}
