import { pipe } from 'fp-ts/lib/pipeable'
import { toNullable, chain, map } from 'fp-ts/lib/Option'
import { Resolver } from 'types/app'
import {
  QueryGetComicBookArgs,
  ComicBookDbObject,
  CreatorDbObject,
  PublisherDbObject,
  ComicSeriesDbObject,
} from 'types/server-schema'
import { runRTEtoNullable, maybeToOption } from 'lib'

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
      pipe(
        creators,
        maybeToOption,
        chain(creatorIds =>
          pipe(
            db,
            map(runRTEtoNullable(dataSources.creator.getByIds(creatorIds))),
          ),
        ),
        toNullable,
      ),
    publisher: ({ publisher }, _, { dataSources, db }) =>
      pipe(
        publisher,
        maybeToOption,
        chain(publisherId =>
          pipe(
            db,
            map(runRTEtoNullable(dataSources.publisher.getById(publisherId))),
          ),
        ),
        toNullable,
      ),
    series: ({ series }, _, { dataSources, db }) =>
      pipe(
        series,
        maybeToOption,
        chain(seriesId =>
          pipe(
            db,
            map(runRTEtoNullable(dataSources.comicSeries.getById(seriesId))),
          ),
        ),
        toNullable,
      ),
  },
}
