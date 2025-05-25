export const getNewIdeaRoute = ({ abs }: { abs: boolean }) => {
  return abs ? 'http://localhost:3000/ideas/new' : '/ideas/new'
}
