import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';

import env from './config/env.js';

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

// routes

// global error handling

export default app;
