import { mongo } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user.model.js';
import ApiError from '../utils/error.js';
import apiResponse from '../utils/success.js';
import asyncHandler from '../utils/async.js';
import generateAccessAndRefreshTokens from '../utils/token.js';
import env from '../config/env.js';
import { COOKIE_OPTIONS } from '../constants.js';

export const signupUser = asyncHandler(async (req, res) => {
  try {
    const { fullName, email, password } = req.validatedBody;

    const newUser = await User.create({
      fullName,
      email,
      password,
    });

    return apiResponse(res, {
      statusCode: 201,
      message: 'User signed up',
      data: {
        id: newUser._id.toString(),
        name: newUser.fullName,
        email: newUser.email,
      },
    });
  } catch (err) {
    if (err instanceof mongo.MongoServerError && err.code === 11000) {
      throw new ApiError({
        statusCode: 409,
        message: 'User with this email already exists',
      });
    }

    throw err;
  }
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.validatedBody;

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new ApiError({
      statusCode: 404,
      message: 'User not found',
    });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw new ApiError({
      statusCode: 400,
      message: 'Incorrect password',
    });
  }

  const { accessToken, refreshToken } = generateAccessAndRefreshTokens(user);

  const hashedRefreshToken = await bcrypt.hash(refreshToken, 12);

  user.refreshToken = hashedRefreshToken;
  await user.save();

  res
    .cookie('accessToken', accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: env.ACCESS_TOKEN_EXPIRY,
    })
    .cookie('refreshToken', refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: env.REFRESH_TOKEN_EXPIRY,
    });

  return apiResponse(res, {
    message: 'User logged in',
    data: {
      id: user._id.toString(),
      name: user.fullName,
      email: user.email,
    },
  });
});

export const rotateTokens = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError({
      statusCode: 401,
      message: 'Unauthorized',
      internalMessage: 'Refresh token is missing from cookie',
    });
  }

  let decoded;

  try {
    decoded = jwt.verify(incomingRefreshToken, env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    throw new ApiError({
      statusCode: 401,
      message: 'Unauthorized',
      internalMessage: 'Refresh token verification failed',
    });
  }

  const user = await User.findById(decoded.id);

  if (!user) {
    throw new ApiError({
      statusCode: 401,
      message: 'Unauthorized',
      internalMessage: 'User not found',
    });
  }

  if (!user.refreshToken) {
    throw new ApiError({
      statusCode: 401,
      message: 'Unauthorized',
      internalMessage: 'User does not have a refresh token stored in database',
    });
  }

  const doesTokenMatch = await bcrypt.compare(incomingRefreshToken, user.refreshToken);

  if (!doesTokenMatch) {
    user.refreshToken = undefined;
    await user.save();

    throw new ApiError({
      statusCode: 401,
      message: 'Unauthorized',
      internalMessage: 'Incoming refresh token does not match with the token stored in database',
    });
  }

  const { accessToken, refreshToken } = generateAccessAndRefreshTokens(user);

  const hashedRefreshToken = await bcrypt.hash(refreshToken, 12);

  user.refreshToken = hashedRefreshToken;
  await user.save();

  res
    .cookie('accessToken', accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: env.ACCESS_TOKEN_EXPIRY,
    })
    .cookie('refreshToken', refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: env.REFRESH_TOKEN_EXPIRY,
    });

  return apiResponse(res, {
    message: 'Tokens rotated successfully',
  });
});

export const logoutUser = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET);
      await User.findByIdAndUpdate(decoded.id, {
        $unset: { refreshToken: '' },
      });
    } catch (err) {
      console.warn('Ignoring invalid refresh token on logout:', err.message);
    }
  }

  res.clearCookie('accessToken', COOKIE_OPTIONS).clearCookie('refreshToken', COOKIE_OPTIONS);

  return apiResponse(res, {
    message: 'User logged out',
  });
});
