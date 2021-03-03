import type { Db, MongoError, ObjectID } from 'mongodb'
import { flow, pipe } from 'fp-ts/lib/function'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as A from 'fp-ts/lib/Array'

import type { ComicBookDbObject } from 'types/graphql-schema'
import type { Resolver } from 'types/app'
import type { IComicBookRepository } from 'models/ComicBook/ComicBook.interface'
import type { NewTask } from 'models/Queue/Queue.interface'
import { TaskType } from 'models/Queue/Queue.interface'
import { nullableField } from 'lib'
import { enqueueTasks } from 'lib/queue'

export const verifyUpcomingReleases: Resolver<ComicBookDbObject[], {}> = (
  _,
  __,
  { dataSources, db },
) =>
  pipe(
    db,
    nullableField(
      pipe(
        getDateDaysAgo(14),
        getNextMonthReleasesUpdatedBefore(dataSources.comicBook),
        RTE.chainFirst(
          flow(A.map(getUpdateReleaseTask), enqueueTasks(dataSources.queue)),
        ),
      ),
    ),
  )

function getDateDaysAgo(daysAgo: number): Date {
  const now = new Date(Date.now())
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysAgo)
}

function getDateInMonth(inMonth: number): Date {
  const now = new Date(Date.now())
  return new Date(now.getFullYear(), now.getMonth() + inMonth, now.getDate())
}

function getNextMonthReleasesUpdatedBefore(
  repo: IComicBookRepository<Db, Error | MongoError>,
): (
  updatedBefore: Date,
) => RTE.ReaderTaskEither<Db, Error | MongoError, ComicBookDbObject[]> {
  return (updatedBefore) =>
    repo.getByReleaseBetweenAndLastUpdatedBefore(
      new Date(Date.now()),
      getDateInMonth(1),
      updatedBefore,
    )
}

function getUpdateReleaseTask({
  _id: comicBookId,
}: ComicBookDbObject): NewTask {
  return {
    type: TaskType.UPDATECOMICBOOKRELEASE,
    data: { comicBookId },
  }
}
