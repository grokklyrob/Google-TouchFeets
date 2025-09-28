import type { SubscriptionTier } from './types';

// IMPORTANT: Replace with your actual Stripe Publishable Key
export const STRIPE_PUBLISHABLE_KEY = 'pk_live_51S9IdwF1aEX7i16QgPOLc8vVyGiEjjfUiio6Qi3HltaIL3a60KVB05ph7Lk6pWhtIZF34LVlwBUrCusSXpe86Y8400hvnM920V';

// =======================================================================================
// CRITICAL CONFIGURATION:
// You MUST replace this placeholder URL with the URL of your deployed backend function
// (e.g., a Google Cloud Function) that creates a Stripe Checkout session.
// The payment flow WILL NOT WORK until this is updated.
// =======================================================================================
export const CREATE_CHECKOUT_SESSION_URL = 'https://us-central1-touchfeets.cloudfunctions.net/createStripeCheckout';

export const Tiers: { [key: string]: SubscriptionTier } = {
  FREE: {
    id: 'free',
    name: 'Pilgrim',
    price: 0,
    generations: 5,
    features: ['5 generations / month', 'Watermarked images'],
    priceId: '',
  },
  BASIC: {
    id: 'basic',
    name: 'Acolyte',
    price: 2,
    generations: 50,
    features: ['50 generations / month', 'No visible watermark', 'Priority support'],
    priceId: 'price_1S9bsoF1aEX7i16QuJ86DpFA',
  },
  PLUS: {
    id: 'plus',
    name: 'Cleric',
    price: 5,
    generations: 200,
    features: ['200 generations / month', 'No visible watermark', 'Priority support'],
    priceId: 'price_1S9bsoF1aEX7i16QwR9OjTLN',
  },
  PRO: {
    id: 'pro',
    name: 'Saint',
    price: 10,
    generations: 1000,
    features: ['1,000 generations / month', 'No visible watermark', 'Priority support'],
    priceId: 'price_1S9bsoF1aEX7i16QAEGszhjT',
  },
};

export const SYSTEM_PROMPT = `Modify the uploaded image to add Jesus Christ, in a reverent, artistic Byzantine style, gently touching the subject’s bare feet. Preserve the original lighting, background, perspective, and skin tone. Hands must align anatomically with the feet and cast natural shadows. Clothing should be traditional, with subtle halo or cyber-halo highlights. Do not alter the subject’s identity or facial features. Avoid distortions, extra limbs, or blur. Output at original resolution.`;