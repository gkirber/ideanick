import { type Idea, type User } from '@prisma/client'
import _ from 'lodash'

import { createAppContext } from '../lib/ctx'
import { getTrpcContext } from '../lib/trpc'
import { trpcRouter } from '../router'
import { deepMap, type Value } from '../utils/deepMap'
import { getPasswordHash } from '../utils/getPasswordHash'
import { type ExpressRequest } from '../utils/types'

export const appContext = createAppContext()

afterAll(appContext.stop)

beforeEach(async () => {
  await appContext.prisma.ideaLike.deleteMany()
  await appContext.prisma.idea.deleteMany()
  await appContext.prisma.user.deleteMany()
})

export const getTrpcCaller = (user?: User) => {
  const req = { user } as ExpressRequest
  return trpcRouter.createCaller(getTrpcContext({ appContext, req }))
}
export const withoutNoize = <T extends Value>(input: T): T => {
  const idMap = new Map<string, string>()
  let counter = 1

  return deepMap<T>(input, ({ value }) => {
    if (_.isObject(value) && !_.isArray(value)) {
      return _.entries(value).reduce((acc, [objectKey, objectValue]: [string, unknown]) => {
        if ([/Id$/, /At$/].some((regex) => regex.test(objectKey)) && objectKey !== 'id') {
          return acc
        }
        if (objectKey === 'id' && typeof objectValue === 'string') {
          if (!idMap.has(objectValue)) {
            idMap.set(objectValue, `test-id-${counter++}`)
          }
          return {
            ...acc,
            [objectKey]: idMap.get(objectValue),
          }
        }
        return {
          ...acc,
          [objectKey]: objectValue,
        }
      }, {})
    }
    return value
  })
}

export const createUser = async ({ user = {}, number = 1 }: { user?: Partial<User>; number?: number } = {}) => {
  return await appContext.prisma.user.create({
    data: {
      nick: `user${number}`,
      email: `user${number}@example.com`,
      password: getPasswordHash(user.password || '1234'),
      ..._.omit(user, ['password']),
    },
  })
}

export const createIdea = async ({
  idea = {},
  author,
  number = 1,
}: {
  idea?: Partial<Idea>
  author: Pick<User, 'id'>
  number?: number
}) => {
  return await appContext.prisma.idea.create({
    data: {
      nick: `idea${number}`,
      authorId: author.id,
      name: `Idea ${number}`,
      description: `Idea ${number} description`,
      text: `Idea ${number} text text text text text text text text text text text text text text text text text text text text text`,
      ...idea,
    },
  })
}

export const createIdeaWithAuthor = async ({
  author,
  idea,
  number,
}: {
  author?: Partial<User>
  idea?: Partial<Idea>
  number?: number
} = {}) => {
  const createdUser = await createUser({ user: author, number })
  const createdIdea = await createIdea({ idea, author: createdUser, number })
  return {
    author: createdUser,
    idea: createdIdea,
  }
}

export const createIdeaLike = async ({
  idea,
  liker,
  createdAt,
}: {
  idea: Pick<Idea, 'id'>
  liker: Pick<User, 'id'>
  createdAt?: Date
}) => {
  return await appContext.prisma.ideaLike.create({
    data: {
      ideaId: idea.id,
      userId: liker.id,
      createdAt,
    },
  })
}
