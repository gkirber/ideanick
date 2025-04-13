import { z } from 'zod'
import { trpc } from '../../lib/trpc'
import { ideas } from '../../lib/ideas'
import _ from 'lodash'

export const getIdeasTrpcRoute = trpc.procedure.query(() => {
  return { ideas: ideas.map((idea) => _.pick(idea, ['nick', 'name', 'description'])) }
})
