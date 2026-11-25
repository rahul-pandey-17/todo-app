import mongoose from 'mongoose';

import env from './env.js';

const connectDB = async () => {
  try {
    await mongoose.connect(env.DATABASE_URI);
    console.log('Database connected successfully');
  } catch (err) {
    throw new Error('Database connection error:', { cause: err });
  }
};

export default connectDB;
