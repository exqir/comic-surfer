import { pipe } from 'fp-ts/lib/pipeable'
import { toNullable } from 'fp-ts/lib/Option'
import { identity } from 'fp-ts/lib/function'
import { fold } from 'fp-ts/lib/Either'
import { GraphQLResolver } from 'types/app'
import { QueryGetComicBookArgs, ComicBook } from 'types/server-schema'
import { mapPromise } from 'lib'

interface ComicBookQuery {
  getComicBook: GraphQLResolver<any, QueryGetComicBookArgs>
}

interface ComicBookResolver {
  ComicBook: {
    creators: GraphQLResolver<ComicBook, any>
    publisher: GraphQLResolver<ComicBook, any>
    series: GraphQLResolver<ComicBook, any>
  }
}

export const ComicBookQuery: ComicBookQuery = {
  getComicBook: (_, { id }, { dataSources }) =>
    pipe(
      dataSources.comicBook.getById(id),
      mapPromise(fold(_ => null, identity)),
      toNullable,
    ),
}

export const ComicBookResolver: ComicBookResolver = {
  ComicBook: {
    creators: ({ creators }, _, {}) => [{}],
    publisher: ({ publisher }, _, {}) => ({}),
    series: ({ series }, _, {}) => ({}),
  },
}
