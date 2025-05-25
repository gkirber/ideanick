import jwt from 'jsonwebtoken'

import { env } from '../lib/env'

export const signJWT = (userId: string): string => {
  return jwt.sign({ id: userId }, env.JWT_SECRET)
}
