import env from './config/env.js';

export const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: env.NODE_ENV === 'production' ? 'strict' : 'lax',
  secure: env.NODE_ENV === 'production',
  path: '/',
};
