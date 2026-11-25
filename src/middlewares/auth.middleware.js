import jwt from 'jsonwebtoken';

import ApiError from '../utils/error.js';
import env from '../config/env.js';

const authenticateUser = (req, _res, next) => {
  const accessToken = req.cookies?.accessToken;

  if (!accessToken) {
    throw new ApiError({
      statusCode: 401,
      message: 'Unauthorized',
      internalMessage: 'Missing access token',
    });
  }

  let decoded;

  try {
    decoded = jwt.verify(accessToken, env.ACCESS_TOKEN_SECRET);
  } catch {
    throw new ApiError({
      statusCode: 401,
      message: 'Unauthorized',
      internalMessage: 'Access token verification failed',
    });
  }

  req.user = decoded;

  next();
};

export default authenticateUser;
