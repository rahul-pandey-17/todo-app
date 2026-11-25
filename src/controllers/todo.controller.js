import Todo from '../models/todo.model.js';
import apiResponse from '../utils/success.js';
import asyncHandler from '../utils/async.js';
import isValidId from '../utils/id.js';
import ApiError from '../utils/error.js';

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

export const getTodo = asyncHandler(async (req, res) => {
  const todoId = isValidId(req.params.id);

  const todo = await Todo.findOne({
    _id: todoId,
    userId: req.user.id,
  });

  if (!todo) {
    throw new ApiError({
      statusCode: 404,
      message: 'Todo not found',
    });
  }

  return apiResponse(res, {
    message: 'Todo fetched successfully',
    data: todo,
  });
});

export const updateTodo = asyncHandler(async (req, res) => {
  const { title, description } = req.validatedBody;
  const todoId = isValidId(req.params.id);

  const updates = {};

  if (title !== undefined) {
    updates.title = title;
  }

  if (description !== undefined) {
    updates.description = description;
  }

  const updatedTodo = await Todo.findOneAndUpdate(
    {
      _id: todoId,
      userId: req.user.id,
    },
    {
      $set: updates,
    },
    {
      returnDocument: 'after',
      runValidators: true,
    }
  );

  if (!updatedTodo) {
    throw new ApiError({
      statusCode: 404,
      message: 'Todo not found',
    });
  }

  return apiResponse(res, {
    message: 'Todo updated successfully',
    data: updatedTodo,
  });
});
