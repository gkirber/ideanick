import { type Idea, type User } from '@prisma/client'

import { type AppContext } from '../lib/ctx'
import { sendMostLikedIdeasEmail } from '../lib/emails'

export const notifyAboutMostLikedIdeas = async (ctx: AppContext) => {
  const mostLikedIdeas = await ctx.prisma.$queryRaw<
    Array<Pick<Idea, 'id' | 'nick' | 'name'> & { thisMonthLikesCount: number }>
  >`
    with "topIdeas" as (
      select id,
        nick,
        name,
        (
          select count(*)::int
          from "IdeaLike" il
          where il."ideaId" = i.id
            and il."createdAt" > now() - interval '1 month'
            and i."blockedAt" is null
        ) as "thisMonthLikesCount"
      from "topIdeas"
    where "thisMonthLikesCount" > 0
  `
  if (!mostLikedIdeas.length) {
    return
  }
  const users = await ctx.prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      nick: true,
      createdAt: true,
      permissions: true,
    },
  })
  for (const user of users) {
    await sendMostLikedIdeasEmail(user as User, mostLikedIdeas.length)
  }
}
