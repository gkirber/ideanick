/* eslint-disable node/no-process-env */
import { z } from 'zod'

import { zEnvNonemptyTrimmed } from './zodSchemas'

const sharedEnvRaw = {
  CLOUDINARY_CLOUD_NAME:
    process.env.VITE_CLOUDINARY_CLOUD_NAME ||
    process.env.CLOUDINARY_CLOUD_NAME ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  S3_URL: process.env.VITE_S3_URL || process.env.S3_URL,
  WEBAPP_URL: process.env.VITE_WEBAPP_URL || process.env.WEBAPP_URL,
}

const zEnv = z.object({
  WEBAPP_URL: zEnvNonemptyTrimmed,
  CLOUDINARY_CLOUD_NAME: zEnvNonemptyTrimmed,
  S3_URL: zEnvNonemptyTrimmed,
})

export const sharedEnv = zEnv.parse(sharedEnvRaw)

export type SharedEnv = typeof sharedEnv
