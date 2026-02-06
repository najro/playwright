import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { z } from 'zod';

/**
 * Loads .env files in a predictable order:
 *   1) .env                          (base; optional)
 *   2) .env.<PW_ENV>                 (env-specific; optional)
 *   3) .env.local                    (developer machine override; optional)
 *
 * If you run in CI, you typically set variables in the pipeline and don't need files.
 */
export function loadDotenv() {
  const cwd = process.cwd();
  const envName = process.env.PW_ENV ?? 'local';

  const candidates = [
    path.join(cwd, '.env'),
    path.join(cwd, `.env.${envName}`),
    path.join(cwd, '.env.local'),
  ];

  for (const file of candidates) {
    if (fs.existsSync(file)) {
      dotenv.config({ path: file, override: true });
    }
  }
}

/**
 * Central place for env validation.
 * Keep required values to what you truly need to run tests.
 * You can make per-project values optional and conditionally include projects in the config.
 */
const EnvSchema = z.object({
  PW_ENV: z.string().default('local'),

  BASE_URL_PORTAL: z.string().url().optional(),
  BASE_URL_ADMIN: z.string().url().optional(),

  POST_LOGIN_PATH_PORTAL: z.string().optional(),
  POST_LOGIN_PATH_ADMIN: z.string().optional(),

  ENTRA_USERNAME: z.string().min(1, 'ENTRA_USERNAME is required'),
  ENTRA_PASSWORD: z.string().min(1, 'ENTRA_PASSWORD is required'),
  ENTRA_TOTP_SECRET: z.string().optional(),

  ENTRA_STAY_SIGNED_IN: z
    .string()
    .optional()
    .transform(v => (v ?? 'false').toLowerCase() === 'true'),

  CI: z
    .string()
    .optional()
    .transform(v => (v ?? 'false').toLowerCase() === 'true'),
});

loadDotenv();

export const env = (() => {
  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    // Make errors easier to read in CI logs
    // eslint-disable-next-line no-console
    console.error('❌ Environment validation failed:\n', parsed.error.format());
    throw new Error('Environment validation failed. Check your .env or pipeline variables.');
  }
  return parsed.data;
})();
