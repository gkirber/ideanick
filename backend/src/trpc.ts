import { initTRPC } from '@trpc/server'

const ideas = [
  { nick: 'cool-idea-nick-1', name: 'Idea 1', description: 'Idea 1 description...' },
  { nick: 'cool-idea-nick-2', name: 'Idea 2', description: 'Idea 2 description...' },
  { nick: 'cool-idea-nick-3', name: 'Idea 3', description: 'Idea 3 description...' },
  { nick: 'cool-idea-nick-4', name: 'Idea 4', description: 'Idea 4 description...' },
  { nick: 'cool-idea-nick-5', name: 'Idea 5', description: 'Idea 5 description...' },
]

const x: number = 'hello'

const trpc = initTRPC.create()

export const trpcRouter = trpc.router({
  getIdeas: trpc.procedure.query(() => {
    return { ideas }
  }),
})

export type TrpcRouter = typeof trpcRouter
