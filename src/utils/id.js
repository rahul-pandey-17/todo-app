import { isObjectIdOrHexString } from 'mongoose';

import ApiError from './error.js';

const isValidId = (id) => {
  if (!isObjectIdOrHexString(id)) {
    throw new ApiError({
      statusCode: 400,
      message: 'Invalid id',
    });
  }

  return id;
};

export default isValidId;
