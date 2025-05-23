import { EOL } from 'os'
import _ from 'lodash'
import pc from 'picocolors'
import { serializeError } from 'serialize-error'
import { MESSAGE } from 'triple-beam'
import winston, { format } from 'winston'
import * as yaml from 'yaml'
import { env } from './env'


type TransformableInfo = {
  level: string
  message: string
  timestamp?: string
  logType?: string
  [key: string]: any
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

              const setColor = {
                info: (str: string) => pc.blue(str),
                error: (str: string) => pc.red(str),
                debug: (str: string) => pc.cyan(str),
              }[info.level as 'info' | 'error' | 'debug'] || ((str: string) => str)

              const levelAndType = `${info.level} ${info.logType ?? ''}`.trim()
              const topMessage = `${setColor(levelAndType)} ${pc.green(info.timestamp ?? '')}${EOL}${info.message ?? ''}`

              const visibleMessageTags = _.omit(info, [
                'level',
                'logType',
                'timestamp',
                'message',
                'service',
                'hostEnv',
              ])

              const stringifiedMeta = _.trim(
                yaml.stringify(visibleMessageTags, (_k, v) => (_.isFunction(v) ? 'Function' : v))
              )

              return {
                ...info,
                message: info.message ?? '', // важливо для сумісності з Winston
                [MESSAGE]: [topMessage, Object.keys(visibleMessageTags).length > 0 ? `${EOL}${stringifiedMeta}` : '']
                  .filter(Boolean)
                  .join('') + EOL,
              }
            })(),
    }),
  ],
})

export const logger = {
  info: (logType: string, message: string, meta?: Record<string, any>) => {
    winstonLogger.info(message, { logType, ...meta })
  },
  error: (logType: string, error: unknown, meta?: Record<string, any>) => {
    const serializedError = serializeError(error)
    winstonLogger.error(serializedError.message || 'Unknown error', {
      logType,
      error,
      errorStack: serializedError.stack,
      ...meta,
    })
  },
}
