import * as z from 'zod';

const titleSchema = z
  .string()
  .trim()
  .min(3, 'Title must be at least 3 characters')
  .max(120, 'Title cannot exceed 120 characters');

const descriptionSchema = z
  .string()
  .trim()
  .max(2000, 'Description cannot exceed 2000 characters')
  .optional();

export const createTodoSchema = z.strictObject({
  title: titleSchema,
  description: descriptionSchema,
});
