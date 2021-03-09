import type { Db, MongoError } from 'mongodb'
import { flow, pipe } from 'fp-ts/lib/function'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as A from 'fp-ts/lib/Array'

import { ComicBookType, ComicSeriesDbObject } from 'types/graphql-schema'
import type { Resolver } from 'types/app'
import type { IComicSeriesRepository } from 'models/ComicSeries/ComicSeries.interface'
import type { NewTask } from 'models/Queue/Queue.interface'
import { TaskType } from 'models/Queue/Queue.interface'
import { nullableField } from 'lib'
import { enqueueTasks } from 'lib/queue'

export const addNewReleases: Resolver<ComicSeriesDbObject[], {}> = (
  _,
  __,
  { dataSources, db },
) =>
  pipe(
    db,
    nullableField(
      pipe(
        getDateMonthAgo(1),
        getLastUpdatedBefore(dataSources.comicSeries),
        RTE.chainFirst(
          flow(
            A.map(getNewReleaseTasks),
            A.flatten,
            enqueueTasks(dataSources.queue),
          ),
        ),
      ),
    ),
  )

function getDateMonthAgo(monthsAgo: number): Date {
  const now = new Date(Date.now())
  return new Date(now.getFullYear(), now.getMonth() - monthsAgo, now.getDate())
}

function getLastUpdatedBefore(
  repo: IComicSeriesRepository<Db, Error | MongoError>,
): (
  updateBefore: Date,
) => RTE.ReaderTaskEither<Db, Error | MongoError, ComicSeriesDbObject[]> {
  return repo.getLastUpdatedBefore
}

function getNewReleaseTasks({
  _id: comicSeriesId,
  singleIssuesUrl,
  collectionsUrl,
}: ComicSeriesDbObject): NewTask[] {
  return [
    {
      type: TaskType.SCRAPCOMICBOOKLIST,
      data: {
        comicSeriesId,
        url: singleIssuesUrl!,
        type: ComicBookType.SINGLEISSUE,
      },
    },
    {
      type: TaskType.SCRAPCOMICBOOKLIST,
      data: {
        comicSeriesId,
        url: collectionsUrl!,
        type: ComicBookType.COLLECTION,
      },
    },
  ]
}
