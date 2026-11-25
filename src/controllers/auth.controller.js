import { mongo } from 'mongoose';

import User from '../models/user.model.js';
import ApiError from '../utils/error.js';
import apiResponse from '../utils/success.js';
import asyncHandler from '../utils/async.js';

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
