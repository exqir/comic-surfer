import type { Db, MongoError, ObjectID } from 'mongodb'
import { pipe, flow } from 'fp-ts/lib/function'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'

import type { NonNullableResolver } from 'types/app'
import type {
  PublisherDbObject,
  ComicSeriesDbObject,
} from 'types/server-schema'
import type { IComicSeriesRepository } from 'models/ComicSeries/ComicSeries.interface'
import { nonNullableField } from 'lib'

interface PublisherResolver {
  comicSeries: NonNullableResolver<ComicSeriesDbObject[], {}, PublisherDbObject>
}

export const Publisher: PublisherResolver = {
  comicSeries: ({ comicSeries }, _, { dataSources, db }) =>
    pipe(
      db,
      nonNullableField(pipe(comicSeries, getByIds(dataSources.comicSeries))),
    ),
}

export function getByIds(
  repo: IComicSeriesRepository<Db, Error | MongoError>,
): (
  ids: ObjectID[],
) => RTE.ReaderTaskEither<Db, Error | MongoError, ComicSeriesDbObject[]> {
  return flow(repo.getByIds)
}
