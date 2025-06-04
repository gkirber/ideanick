import { zStringRequired } from '@ideanick/shared/src/zodSchemas'

import { zCreateIdeaTrpcInput } from '../createIdea/input'

export const zUpdateIdeaTrpcInput = zCreateIdeaTrpcInput.extend({
  ideaId: zStringRequired,
})
