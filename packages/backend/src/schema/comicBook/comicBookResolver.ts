import { pipe } from 'fp-ts/lib/pipeable'
import { toNullable, map } from 'fp-ts/lib/Option'
import { Resolver } from 'types/app'
import {
  QueryComicBookArgs,
  ComicBookDbObject,
  CreatorDbObject,
  PublisherDbObject,
  ComicSeriesDbObject,
} from 'types/server-schema'
import { runRTEtoNullable, mapOtoRTEnullable, chainMaybeToNullable } from 'lib'

interface ComicBookQuery {
  // TODO: This actually returns a ComicBook but this is not what the function returns
  // but what is returned once all field resolvers are done
  comicBook: Resolver<ComicBookDbObject, QueryComicBookArgs>
}

interface ComicBookResolver {
  ComicBook: {
    creators: Resolver<CreatorDbObject[], {}, ComicBookDbObject>
    publisher: Resolver<PublisherDbObject, {}, ComicBookDbObject>
    comicSeries: Resolver<ComicSeriesDbObject, {}, ComicBookDbObject>
  }
}

export const ComicBookQuery: ComicBookQuery = {
  comicBook: (_, { id }, { dataSources, db }) =>
    pipe(
      db,
      map(runRTEtoNullable(dataSources.comicBook.getById(id))),
      toNullable,
    ),
}

export const ComicBookResolver: ComicBookResolver = {
  ComicBook: {
    creators: ({ creators }, _, { dataSources, db }) =>
      pipe(
        db,
        map(runRTEtoNullable(dataSources.creator.getByIds(creators))),
        toNullable,
      ),
    publisher: ({ publisher }, _, { dataSources, db }) =>
      chainMaybeToNullable(
        publisher,
        mapOtoRTEnullable(db, dataSources.publisher.getById),
      ),
    comicSeries: ({ comicSeries }, _, { dataSources, db }) =>
      chainMaybeToNullable(
        comicSeries,
        mapOtoRTEnullable(db, dataSources.comicSeries.getById),
      ),
  },
}
