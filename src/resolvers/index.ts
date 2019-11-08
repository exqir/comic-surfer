import { ComicQuery, ComicResolver } from './comicBookResolver'

export const resolvers = {
  Query: {
    ...ComicQuery,
  },
  ...ComicResolver,
}