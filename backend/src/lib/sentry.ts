import { RewriteFrames } from '@sentry/integrations'
import * as Sentry from '@sentry/node'

import { env } from './env'
import { type LoggerMetaData } from './logger'

// Використовуємо process.cwd() як базовий шлях
const rootPath = process.cwd()

if (env.BACKEND_SENTRY_DSN) {
  Sentry.init({
    dsn: env.BACKEND_SENTRY_DSN,
    environment: env.HOST_ENV,
    release: env.SOURCE_VERSION,
    normalizeDepth: 10,
    integrations: [
      new RewriteFrames({
        root: rootPath,
      }),
    ],
  })
}

export const sentryCaptureException = (error: Error, prettifiedMetaData?: LoggerMetaData) => {
  if (env.BACKEND_SENTRY_DSN) {
    Sentry.captureException(error, prettifiedMetaData)
  }
}
