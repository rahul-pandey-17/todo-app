import * as z from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  CORS_ORIGIN: z.url(),
  DATABASE_URI: z.url(),
  PORT: z.coerce.number(),
  ACCESS_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRY: z.coerce.number(),
  REFRESH_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_EXPIRY: z.coerce.number(),
});

const parsedSchema = envSchema.safeParse(process.env);

if (!parsedSchema.success) {
  console.error(`Invalid environment variables\n${z.prettifyError(parsedSchema.error)}`);
  process.exit(1);
}

const env = parsedSchema.data;

export default env;
