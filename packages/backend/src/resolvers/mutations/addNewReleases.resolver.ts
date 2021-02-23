import type { Db, MongoError } from 'mongodb'
import { flow, pipe } from 'fp-ts/lib/function'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as A from 'fp-ts/lib/Array'

import type { ComicSeriesDbObject } from 'types/server-schema'
import type { Resolver } from 'types/app'
import type { IComicSeriesRepository } from 'models/ComicSeries/ComicSeries.interface'
import type {
  IQueueRepository,
  NewTask,
  Task,
} from 'models/Queue/Queue.interface'
import { TaskType } from 'models/Queue/Queue.interface'
import { nullableField } from 'lib'

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
  return (updateBefore) => repo.getLastUpdatedBefore(updateBefore)
}

function enqueueTasks(
  repo: IQueueRepository<Db, Error | MongoError>,
): (tasks: NewTask[]) => RTE.ReaderTaskEither<Db, Error | MongoError, Task[]> {
  return (tasks) => repo.addTasksToQueue(tasks)
}

function getNewReleaseTasks({
  _id,
  singleIssuesUrl,
  collectionsUrl,
}: ComicSeriesDbObject): NewTask[] {
  return [
    {
      type: TaskType.SCRAPSINGLEISSUELIST,
      data: { comicSeriesId: _id, url: singleIssuesUrl! },
    },
    {
      type: TaskType.SCRAPCOLLECTIONLIST,
      data: { comicSeriesId: _id, url: collectionsUrl! },
    },
  ]
}
