import { pipe } from 'fp-ts/lib/pipeable'
import { toNullable } from 'fp-ts/lib/Option'
import { identity, constNull } from 'fp-ts/lib/function'
import { fold } from 'fp-ts/lib/Either'
import { Resolver } from 'types/app'
import {
  QueryGetComicBookArgs,
  ComicBookDbObject,
  CreatorDbObject,
  PublisherDbObject,
  ComicSeriesDbObject,
} from 'types/server-schema'
import { mapPromise } from 'lib'

interface ComicBookQuery {
  getComicBook: Resolver<ComicBookDbObject, QueryGetComicBookArgs>
}

interface ComicBookResolver {
  ComicBook: {
    creators: Resolver<CreatorDbObject[], {}, ComicBookDbObject>
    publisher: Resolver<PublisherDbObject, {}, ComicBookDbObject>
    series: Resolver<ComicSeriesDbObject, {}, ComicBookDbObject>
  }
}

export const ComicBookQuery: ComicBookQuery = {
  getComicBook: (_, { id }, { dataSources }) =>
    pipe(
      dataSources.comicBook.getById(id),
      mapPromise(fold(constNull, identity)),
      toNullable,
    ) as Promise<ComicBookDbObject | null> | null,
}

export const ComicBookResolver: ComicBookResolver = {
  ComicBook: {
    creators: ({ creators }, _, {}) => [{}] as CreatorDbObject[],
    publisher: ({ publisher }, _, {}) => ({} as PublisherDbObject),
    series: ({ series }, _, { dataSources }) =>
      pipe(
        // TODO: change getById type to ObjectID
        // @ts-ignore
        dataSources.comicSeries.getById(series),
        mapPromise(fold(constNull, identity)),
        toNullable,
      ) as Promise<ComicSeriesDbObject | null> | null,
  },
}
