import { pipe } from 'fp-ts/lib/pipeable'
import { toNullable, chain, map } from 'fp-ts/lib/Option'
import { Resolver } from 'types/app'
import {
  QueryGetComicBookArgs,
  ComicBookDbObject,
  PublisherDbObject,
  ComicSeriesDbObject,
} from 'types/server-schema'
import { runRTEtoNullable, maybeToOption } from 'lib'

interface ComicSeriesQuery {
  // TODO: This actually returns a ComicSeries but this is not what the function returns
  // but what is returned once all field resolvers are done
  getComicSeries: Resolver<ComicSeriesDbObject, QueryGetComicBookArgs>
}

interface ComicSeriesResolver {
  ComicSeries: {
    issues: Resolver<ComicBookDbObject[], {}, ComicSeriesDbObject>
    publisher: Resolver<PublisherDbObject, {}, ComicSeriesDbObject>
    collections: Resolver<ComicBookDbObject[], {}, ComicSeriesDbObject>
  }
}

export const ComicSeriesQuery: ComicSeriesQuery = {
  getComicSeries: (_, { id }, { dataSources, db }) =>
    pipe(
      db,
      map(runRTEtoNullable(dataSources.comicSeries.getById(id))),
      toNullable,
    ),
}

export const ComicSeriesResolver: ComicSeriesResolver = {
  ComicSeries: {
    issues: ({ issues }, _, { dataSources, db }) =>
      pipe(
        issues,
        maybeToOption,
        chain(comicBookIds =>
          pipe(
            db,
            map(runRTEtoNullable(dataSources.comicBook.getByIds(comicBookIds))),
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
    collections: ({ collections }, _, { dataSources, db }) =>
      pipe(
        collections,
        maybeToOption,
        chain(collectionIds =>
          pipe(
            db,
            map(
              runRTEtoNullable(dataSources.comicBook.getByIds(collectionIds)),
            ),
          ),
        ),
        toNullable,
      ),
  },
}
