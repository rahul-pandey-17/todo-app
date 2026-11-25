import * as z from 'zod';

import ApiError from '../utils/error.js';

const validateInputs = (schema) => {
  return (req, _res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
      throw new ApiError({
        statusCode: 400,
        message: 'Missing or empty request body',
      });
    }

    const parsedBody = schema.safeParse(req.body);

    if (!parsedBody.success) {
      throw new ApiError({
        statusCode: 400,
        message: 'Invalid inputs',
        details: z.flattenError(parsedBody.error),
      });
    }

    req.validatedBody = parsedBody.data;

    next();
  };
};

export default validateInputs;
