import { zStringRequired } from '@ideanick/shared/src/zodSchemas'
import { z } from 'zod'

export const zPrepareS3UploadTrpcInput = z.object({
  fileName: zStringRequired,
  fileType: zStringRequired,
  fileSize: z.number().int().positive(),
})
