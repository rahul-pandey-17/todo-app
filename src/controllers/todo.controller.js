import Todo from '../models/todo.model.js';
import apiResponse from '../utils/success.js';
import asyncHandler from '../utils/async.js';

export const createTodo = asyncHandler(async (req, res) => {
  const { title, description } = req.validatedBody;
  const userId = req.user.id;

  const newTodo = await Todo.create({
    title,
    description,
    userId,
  });

  return apiResponse(res, {
    statusCode: 201,
    message: 'Todo created successfully',
    data: {
      id: newTodo._id.toString(),
      title: newTodo.title,
      description: newTodo.description,
      isCompleted: newTodo.isCompleted,
    },
  });
});

export const getTodos = asyncHandler(async (req, res) => {
  const todos = await Todo.find({ userId: req.user.id });

  return apiResponse(res, {
    message: 'Todos fetched successfully',
    data: todos,
  });
});
