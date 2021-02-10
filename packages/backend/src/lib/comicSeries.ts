import type { Db, MongoError, ObjectID } from 'mongodb'
import { flow } from 'fp-ts/lib/function'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'

import type { ComicSeriesDbObject } from 'types/server-schema'
import type { IComicSeriesRepository } from 'models/ComicSeries/ComicSeries.interface'

export function getByIds(
  repo: IComicSeriesRepository<Db, Error | MongoError>,
): (
  ids: ObjectID[],
) => RTE.ReaderTaskEither<Db, Error | MongoError, ComicSeriesDbObject[]> {
  return flow(repo.getByIds)
}
