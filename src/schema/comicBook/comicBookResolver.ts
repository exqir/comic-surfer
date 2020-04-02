import { pipe } from 'fp-ts/lib/pipeable'
import { toNullable, map } from 'fp-ts/lib/Option'
import { Resolver } from 'types/app'
import {
  QueryGetComicBookArgs,
  ComicBookDbObject,
  CreatorDbObject,
  PublisherDbObject,
  ComicSeriesDbObject,
} from 'types/server-schema'
import { runRTEtoNullable, mapOtoRTEnullable, chainMaybeToNullable } from 'lib'

interface ComicBookQuery {
  // TODO: This actually returns a ComicBook but this is not what the function returns
  // but what is returned once all field resolvers are done
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
  getComicBook: (_, { id }, { dataSources, db }) =>
    pipe(
      db,
      map(runRTEtoNullable(dataSources.comicBook.getById(id))),
      toNullable,
    ),
}

export const ComicBookResolver: ComicBookResolver = {
  ComicBook: {
    creators: ({ creators }, _, { dataSources, db }) =>
      chainMaybeToNullable(
        creators,
        mapOtoRTEnullable(db, dataSources.creator.getByIds),
      ),
    publisher: ({ publisher }, _, { dataSources, db }) =>
      chainMaybeToNullable(
        publisher,
        mapOtoRTEnullable(db, dataSources.publisher.getById),
      ),
    series: ({ series }, _, { dataSources, db }) =>
      chainMaybeToNullable(
        series,
        mapOtoRTEnullable(db, dataSources.comicSeries.getById),
      ),
  },
}
