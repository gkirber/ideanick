/* eslint-disable node/no-process-env */
import fs from 'fs'
import path from 'path'

import { zEnvHost, zEnvNonemptyTrimmed, zEnvNonemptyTrimmedRequiredOnNotLocal } from '@ideanick/shared/src/zodSchemas'
import * as dotenv from 'dotenv'
import { z } from 'zod'

// __dirname is available in CommonJS
// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

const findEnvFilePath = (dir: string, pathPart: string): string | null => {
  const maybeEnvFilePath = path.join(dir, pathPart)
  if (fs.existsSync(maybeEnvFilePath)) {
    return maybeEnvFilePath
  }
  if (dir === '/') {
    return null
  }
  return findEnvFilePath(path.dirname(dir), pathPart)
}
const webappEnvFilePath = findEnvFilePath(__dirname, 'webapp/.env')
if (webappEnvFilePath) {
  dotenv.config({ path: webappEnvFilePath, override: true })
  dotenv.config({ path: `${webappEnvFilePath}.${process.env.NODE_ENV}`, override: true })
}
const backendEnvFilePath = findEnvFilePath(__dirname, 'backend/.env')
if (backendEnvFilePath) {
  dotenv.config({ path: backendEnvFilePath, override: true })
  dotenv.config({ path: `${backendEnvFilePath}.${process.env.NODE_ENV}`, override: true })
}

const zEnv = z.object({
  NODE_ENV: z.enum(['test', 'development', 'production']),
  PORT: zEnvNonemptyTrimmed,
  HOST_ENV: zEnvHost,
  DATABASE_URL: zEnvNonemptyTrimmed.refine((val) => {
    if (process.env.NODE_ENV !== 'test') {
      return true
    }
    const [databaseUrl] = val.split('?')
    const [databaseName] = databaseUrl.split('/').reverse()
    return databaseName.endsWith('-test')
  }, `Data base name should ends with "-test" on test environment`),
  JWT_SECRET: zEnvNonemptyTrimmed,
  PASSWORD_SALT: zEnvNonemptyTrimmed,
  INITIAL_ADMIN_PASSWORD: zEnvNonemptyTrimmed,
  WEBAPP_URL: zEnvNonemptyTrimmed,
  BREVO_API_KEY: zEnvNonemptyTrimmedRequiredOnNotLocal,
  FROM_EMAIL_NAME: zEnvNonemptyTrimmed,
  FROM_EMAIL_ADDRESS: zEnvNonemptyTrimmed,
  DEBUG: z.string().optional(),
  BACKEND_SENTRY_DSN: zEnvNonemptyTrimmedRequiredOnNotLocal,
  SOURCE_VERSION: zEnvNonemptyTrimmedRequiredOnNotLocal,
  CLOUDINARY_API_KEY: zEnvNonemptyTrimmedRequiredOnNotLocal,
  CLOUDINARY_API_SECRET: zEnvNonemptyTrimmedRequiredOnNotLocal,
  CLOUDINARY_CLOUD_NAME: zEnvNonemptyTrimmed,
  S3_ACCESS_KEY_ID: zEnvNonemptyTrimmedRequiredOnNotLocal,
  S3_SECRET_ACCESS_KEY: zEnvNonemptyTrimmedRequiredOnNotLocal,
  S3_BUCKET_NAME: zEnvNonemptyTrimmedRequiredOnNotLocal,
  S3_REGION: zEnvNonemptyTrimmedRequiredOnNotLocal,
  S3_URL: zEnvNonemptyTrimmed,
})

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
