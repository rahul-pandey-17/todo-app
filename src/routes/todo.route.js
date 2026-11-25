import { Router } from 'express';

import * as todoController from '../controllers/todo.controller.js';
import authenticateUser from '../middlewares/auth.middleware.js';
import validateInputs from '../middlewares/input.middleware.js';
import { createTodoSchema, updateTodoSchema } from '../types/todo.type.js';

const router = Router();

router
  .route('/')
  .post(authenticateUser, validateInputs(createTodoSchema), todoController.createTodo);

router.route('/').get(authenticateUser, todoController.getTodos);

router.route('/:id').get(authenticateUser, todoController.getTodo);

router
  .route('/:id')
  .patch(authenticateUser, validateInputs(updateTodoSchema), todoController.updateTodo);

export default router;
