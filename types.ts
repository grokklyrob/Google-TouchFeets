export interface SubscriptionTier {
  id: 'free' | 'basic' | 'plus' | 'pro';
  name: string;
  price: number;
  generations: number;
  features: string[];
  priceId: string;
}

export interface User {
  googleId: string;
  name:string;
  email: string;
  picture: string;
  tier: SubscriptionTier;
  generationsLeft: number;
}

export interface GoogleJwtPayload {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  nbf: number;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  iat: number;
  exp: number;
  jti: string;
  nonce?: string;
}