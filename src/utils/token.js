import jwt from 'jsonwebtoken';

import ApiError from './error.js';
import env from '../config/env.js';

const generateAccessAndRefreshTokens = (user) => {
  const accessTokenPayload = {
    id: user._id,
    name: user.fullName,
    email: user.email,
  };

  const refreshTokenPayload = {
    id: user._id,
  };

  try {
    const accessToken = jwt.sign(accessTokenPayload, env.ACCESS_TOKEN_SECRET, {
      expiresIn: env.ACCESS_TOKEN_EXPIRY,
    });
    const refreshToken = jwt.sign(refreshTokenPayload, env.REFRESH_TOKEN_SECRET, {
      expiresIn: env.REFRESH_TOKEN_EXPIRY,
    });

    return { accessToken, refreshToken };
  } catch (err) {
    throw new ApiError({
      internalMessage: 'Cannot generate access and refresh tokens',
    });
  }
};

export default generateAccessAndRefreshTokens;
