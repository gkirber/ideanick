import { env } from './env'

import { EOL } from 'os'

import { omit } from '@ideanick/shared/src/omit'
import { TRPCError } from '@trpc/server'
import debug from 'debug'
import _ from 'lodash'
import pc from 'picocolors'
import { serializeError } from 'serialize-error'
import { MESSAGE } from 'triple-beam'
import winston, { format } from 'winston'
import * as yaml from 'yaml'

import { deepMap } from '../utils/deepMap'

import { ExpectedError } from './error'
import { sentryCaptureException } from './sentry'

type TransformableInfo = {
  level: string
  message: string
  timestamp?: string
  logType?: string
  [key: string]: unknown
}

export const winstonLogger = winston.createLogger({
  level: 'debug',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.json()
  ),
  defaultMeta: { service: 'backend', hostEnv: env.HOST_ENV },
  transports: [
    new winston.transports.Console({
      format:
        env.HOST_ENV !== 'local'
          ? format.json()
          : format((infoRaw) => {
              const info = infoRaw as TransformableInfo

              const setColor =
                {
                  info: (str: string) => pc.blue(str),
                  error: (str: string) => pc.red(str),
                  debug: (str: string) => pc.cyan(str),
                }[info.level as 'info' | 'error' | 'debug'] || ((str: string) => str)

              const levelAndType = `${info.level} ${info.logType ?? ''}`.trim()
              const topMessage = `${setColor(levelAndType)} ${pc.green(info.timestamp ?? '')}${EOL}${info.message ?? ''}`

              const visibleMessageTags = omit(info, ['level', 'logType', 'timestamp', 'message', 'service', 'hostEnv'])

              const stringifiedMeta = _.trim(
                yaml.stringify(visibleMessageTags, (_k, v) => (_.isFunction(v) ? 'Function' : v))
              )

              return {
                ...info,
                message: info.message ?? '',
                [MESSAGE]:
                  [topMessage, Object.keys(visibleMessageTags).length > 0 ? `${EOL}${stringifiedMeta}` : '']
                    .filter(Boolean)
                    .join('') + EOL,
              }
            })(),
    }),
  ],
})

export type LoggerMetaData = Record<string, unknown> | undefined
const prettifyMeta = (meta: LoggerMetaData): LoggerMetaData => {
  return deepMap(meta, ({ key, value }) => {
    if (
      [
        'email',
        'password',
        'newPassword',
        'oldPassword',
        'token',
        'text',
        'description',
        'apiKey',
        'signature',
        'signedUrl',
      ].includes(key)
    ) {
      return '🙈'
    }
    return value
  })
}

export const logger = {
  info: (logType: string, message: string, meta?: LoggerMetaData) => {
    if (!debug.enabled(`ideanick:${logType}`)) {
      return
    }
    winstonLogger.info(message, { logType, ...prettifyMeta(meta) })
  },
  error: (logType: string, error: Error | unknown, meta?: LoggerMetaData) => {
    const isNativeExpectedError = error instanceof ExpectedError
    const isTrpcExpectedError = error instanceof TRPCError && error.cause instanceof ExpectedError
    const prettifiedMetaData = prettifyMeta(meta)
    if (!isNativeExpectedError && !isTrpcExpectedError) {
      sentryCaptureException(error as Error, prettifiedMetaData)
    }
    if (!debug.enabled(`ideanick:${logType}`)) {
      return
    }
    const serializedError = serializeError(error)
    winstonLogger.error(serializedError.message || 'Unknown error', {
      logType,
      error: error as Error,
      errorStack: serializedError.stack,
      ...prettifiedMetaData,
    })
  },
}
