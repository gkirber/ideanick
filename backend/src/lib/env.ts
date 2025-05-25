import { zEnvHost, zEnvNonemptyTrimmed, zEnvNonemptyTrimmedRequiredOnNotLocal } from '@ideanick/shared/src/zod'
import * as dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const zEnv = z.object({
  PORT: zEnvNonemptyTrimmed,
  HOST_ENV: zEnvHost,
  DATABASE_URL: zEnvNonemptyTrimmed,
  JWT_SECRET: zEnvNonemptyTrimmed,
  PASSWORD_SALT: zEnvNonemptyTrimmed,
  INITIAL_ADMIN_PASSWORD: zEnvNonemptyTrimmed,
  WEBAPP_URL: zEnvNonemptyTrimmed,
  BREVO_API_KEY: zEnvNonemptyTrimmedRequiredOnNotLocal,
  FROM_EMAIL_NAME: zEnvNonemptyTrimmed,
  FROM_EMAIL_ADDRESS: zEnvNonemptyTrimmed,
  DEBUG: zEnvNonemptyTrimmed.optional().default('false'),
  BACKEND_SENTRY_DSN: zEnvNonemptyTrimmedRequiredOnNotLocal,
  SOURCE_VERSION: zEnvNonemptyTrimmedRequiredOnNotLocal,
})

// eslint-disable-next-line node/no-process-env
export const env = zEnv.parse(process.env)

export interface Env {
  HOST_ENV: 'local' | 'production'
  PORT: string
  DATABASE_URL: string
  JWT_SECRET: string
  PASSWORD_SALT: string
  INITIAL_ADMIN_PASSWORD: string
  WEBAPP_URL: string
  FROM_EMAIL_NAME: string
  BREVO_API_KEY: string
  SOURCE_VERSION?: string
}
