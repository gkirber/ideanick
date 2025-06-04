import { zStringRequired } from '@ideanick/shared/src/zodSchemas'
import { z } from 'zod'

export const zBlockIdeaTrpcInput = z.object({
  ideaId: zStringRequired,
})
