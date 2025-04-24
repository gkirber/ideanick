import { env } from 'process'
import { type Express } from 'express'
import { Passport } from 'passport'
import { ExtractJwt, Strategy as JWTStrategy, type VerifiedCallback } from 'passport-jwt'
import { type AppContext } from './ctx'

type JWTPayload = {
  id: string
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

  expressApp.use((req, res, next) => {
    if (!req.headers.authorization) {
      return next()
    }
    passport.authenticate('jwt', { session: false })(req, res, next)
  })
}
