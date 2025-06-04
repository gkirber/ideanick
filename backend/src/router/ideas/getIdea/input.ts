import { zStringRequired } from '@ideanick/shared/src/zodSchemas'
import { z } from 'zod'

export const zGetIdeaTrpcInput = z.object({
  ideaNick: zStringRequired,
})
