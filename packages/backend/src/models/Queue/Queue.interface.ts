import type { ObjectID } from 'mongodb'
import type * as RTE from 'fp-ts/lib/ReaderTaskEither'

import type { WithId, DistributiveOmit } from 'types/app'
import type { ComicBookType, ComicSeriesDbObject } from 'types/graphql-schema'

export type Url = string
export type ComicSeriesId = ObjectID
export type ComicSeries = ComicSeriesDbObject

export enum TaskType {
  SCRAPCOMICBOOKLIST = 'SCRAP_COMIC_BOOK_LIST',
  SCRAPCOMICBOOK = 'SCRAP_COMIC_BOOK',
  UPDATECOMICBOOKRELEASE = 'UPDATE_COMIC_BOOK_RELEASE',
  UPDATECOMICSERIESPUBLISHER = 'UPDATE_COMIC_SERIES_PUBLISHER',
}

// TODO: Add a status to the Task type: 'Queued' | 'Error' | 'Done'
export type Task = WithId<
  | {
      type: TaskType.SCRAPCOMICBOOKLIST
      data: { url: Url; comicSeriesId: ComicSeriesId; type: ComicBookType }
    }
  | {
      type: TaskType.UPDATECOMICBOOKRELEASE
      data: { comicBookId: ObjectID }
    }
  | {
      type: TaskType.UPDATECOMICSERIESPUBLISHER
      data: { comicSeriesId: ComicSeriesId }
    }
  | {
      type: TaskType.SCRAPCOMICBOOK
      data: { comicBookUrl: Url }
    }
>

export type NewTask = DistributiveOmit<Task, '_id'>

export interface IQueueRepository<R, E extends Error = Error> {
  addTaskToQueue: (task: NewTask) => RTE.ReaderTaskEither<R, E, Task>
  addTasksToQueue: (tasks: NewTask[]) => RTE.ReaderTaskEither<R, E, Task[]>
}
