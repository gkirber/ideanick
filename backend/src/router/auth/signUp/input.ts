import { zEmailRequired, zNickRequired, zStringRequired } from '@ideanick/shared/src/zodSchemas'
import { z } from 'zod'

export const zSignUpTrpcInput = z.object({
  nick: zNickRequired,
  email: zEmailRequired,
  password: zStringRequired,
})
