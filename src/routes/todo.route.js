import { Router } from 'express';

import * as todoController from '../controllers/todo.controller.js';
import authenticateUser from '../middlewares/auth.middleware.js';
import validateInputs from '../middlewares/input.middleware.js';
import { createTodoSchema } from '../types/todo.type.js';

const router = Router();

router
  .route('/')
  .post(authenticateUser, validateInputs(createTodoSchema), todoController.createTodo);

router.route('/').get(authenticateUser, todoController.getTodos);

export default router;
