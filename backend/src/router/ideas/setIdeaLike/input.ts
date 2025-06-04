import { zStringRequired } from '@ideanick/shared/src/zodSchemas'
import { z } from 'zod'

export const zSetIdeaLikeIdeaTrpcInput = z.object({
  ideaId: zStringRequired,
  isLikedByMe: z.boolean(),
})
