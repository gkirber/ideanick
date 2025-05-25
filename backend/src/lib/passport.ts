import { env } from 'process'

import { type Express } from 'express'
import { Passport } from 'passport'
import { ExtractJwt, Strategy as JWTStrategy, type VerifiedCallback } from 'passport-jwt'
import { Strategy as LocalStrategy } from 'passport-local'

import { getPasswordHash } from '../utils/getPasswordHash'

import { type AppContext } from './ctx'
import { logger } from './logger'
import { prisma } from './prisma'

type JWTPayload = {
  id: string
}

interface DoneCallback {
  (error: Error | null, user?: Express.User | false, options?: { message: string }): void
}

interface _AuthenticateCallback {
  (err: Error | null, user?: Express.User | false, info?: { message: string }): void
}

export const applyPassportToExpressApp = (expressApp: Express, ctx: AppContext): void => {
  const jwtSecret = env.JWT_SECRET
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in environment variables')
  }

  const passport = new Passport()

  passport.use(
    new JWTStrategy(
      {
        secretOrKey: jwtSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
      },
      async (jwtPayload: JWTPayload, done: VerifiedCallback) => {
        try {
          const user = await ctx.prisma.user.findUnique({
            where: { id: jwtPayload.id },
            select: {
              id: true,
              email: true,
              nick: true,
              name: true,
              createdAt: true,
              permissions: true,
            },
          })

          if (!user) {
            return done(null, false)
          }

          return done(null, user)
        } catch (error) {
          return done(error, false)
        }
      }
    )
  )

  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (email, password, done: DoneCallback) => {
        try {
          const user = await prisma.user.findUnique({
            where: { email },
            select: {
              id: true,
              email: true,
              nick: true,
              name: true,
              createdAt: true,
              permissions: true,
              password: true,
            },
          })

          if (!user) {
            return done(null, false, { message: 'Incorrect email or password' })
          }

          const passwordHash = await getPasswordHash(password)

          if (passwordHash !== user.password) {
            return done(null, false, { message: 'Incorrect email or password' })
          }

          return done(null, user)
        } catch (error) {
          logger.error('passport', error as Error)
          return done(error as Error)
        }
      }
    )
  )

  expressApp.use((req, res, next) => {
    if (!req.headers.authorization) {
      return next()
    }
    passport.authenticate('jwt', { session: false }, (err: Error | null, user?: Express.User | false) => {
      req.user = user || undefined
      next()
    })(req, res, next)
  })
}
