import { env } from '../lib/env'

import jwt from 'jsonwebtoken'

export const signJWT = (userId: string): string => {
  return jwt.sign({ id: userId }, env.JWT_SECRET)
}
