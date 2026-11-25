import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';

import env from './config/env.js';
import globalErrorHandler from './middlewares/error.middleware.js';

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);

// route imports
import authRoutes from './routes/auth.route.js';

// routes
app.use('/api/v1/auth', authRoutes);

// global error handling
app.use(globalErrorHandler);

export default app;
