import * as z from 'zod';

const fullNameSchema = z
  .string()
  .trim()
  .min(2, 'Full name must be at least 2 characters')
  .max(100, 'Full name cannot exceed 100 characters')
  .regex(/^[\p{L}\s'.-]+$/u, 'Full name contains invalid characters');

const emailSchema = z
  .email('Invalid email address')
  .trim()
  .toLowerCase()
  .max(254, 'Email cannot exceed 254 characters');

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(72, 'Password cannot exceed 72 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const signupSchema = z.strictObject({
  fullName: fullNameSchema,
  email: emailSchema,
  password: passwordSchema,
});
