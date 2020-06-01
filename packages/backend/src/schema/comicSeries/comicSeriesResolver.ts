import { pipe } from 'fp-ts/lib/pipeable'
import { toNullable, map } from 'fp-ts/lib/Option'
import { Resolver } from 'types/app'
import {
  QueryComicSeriesArgs,
  ComicBookDbObject,
  PublisherDbObject,
  ComicSeriesDbObject,
} from 'types/server-schema'
import { runRTEtoNullable, chainMaybeToNullable, mapOtoRTEnullable } from 'lib'

interface ComicSeriesQuery {
  // TODO: This actually returns a ComicSeries but this is not what the function returns
  // but what is returned once all field resolvers are done
  comicSeries: Resolver<ComicSeriesDbObject, QueryComicSeriesArgs>
}

interface ComicSeriesResolver {
  ComicSeries: {
    singleIssues: Resolver<ComicBookDbObject[], {}, ComicSeriesDbObject>
    publisher: Resolver<PublisherDbObject, {}, ComicSeriesDbObject>
    collections: Resolver<ComicBookDbObject[], {}, ComicSeriesDbObject>
  }
}

export const ComicSeriesQuery: ComicSeriesQuery = {
  comicSeries: (_, { id }, { dataSources, db }) =>
    pipe(
      db,
      map(runRTEtoNullable(dataSources.comicSeries.getById(id))),
      toNullable,
    ),
}

export const ComicSeriesResolver: ComicSeriesResolver = {
  ComicSeries: {
    singleIssues: ({ singleIssues }, _, { dataSources, db }) =>
      pipe(
        db,
        map(runRTEtoNullable(dataSources.comicBook.getByIds(singleIssues))),
        toNullable,
      ),
    publisher: ({ publisher }, _, { dataSources, db }) =>
      chainMaybeToNullable(
        publisher,
        mapOtoRTEnullable(db, dataSources.publisher.getById),
      ),
    collections: ({ collections }, _, { dataSources, db }) =>
      pipe(
        db,
        map(runRTEtoNullable(dataSources.comicBook.getByIds(collections))),
        toNullable,
      ),
  },
}
