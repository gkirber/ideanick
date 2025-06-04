import { zStringRequired } from '@ideanick/shared/src/zodSchemas'
import { z } from 'zod'

export const zSignInTrpcInput = z.object({
  nick: zStringRequired,
  password: zStringRequired,
})
