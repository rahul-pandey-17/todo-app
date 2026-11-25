import { mongo } from 'mongoose';
import bcrypt from 'bcryptjs';

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
