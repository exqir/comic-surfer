import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import { ObjectID } from 'mongodb'

import { WithId, DistributiveOmit } from 'types/app'
import { ComicSeriesDbObject } from 'types/server-schema'

type Url = string
type ComicSeriesId = ObjectID
type ComicSeries = ComicSeriesDbObject

export enum TaskType {
  SCRAPSINGLEISSUELIST = 'SCRAP_SINGLE_ISSUE_LIST',
  SCRAPCOLLECTIONLIST = 'SCRAP_COLLECTION_LIST',
  SCRAPCOMICBOOK = 'SCRAP_COMIC_BOOK',
  UPDATECOMICBOOKRELEASE = 'UPDATE_COMIC_BOOK_RELEASE',
  UPDATECOMICSERIESPUBLISHER = 'UPDATE_COMIC_SERIES_PUBLISHER',
}

// TODO: Add a status to the Task type: 'Queued' | 'Error' | 'Done'
export type Task = WithId<
  | {
      type: TaskType.SCRAPSINGLEISSUELIST | TaskType.SCRAPCOLLECTIONLIST
      data: { url: Url; comicSeriesId: ObjectID }
    }
  | {
      type: TaskType.UPDATECOMICBOOKRELEASE
      data: { url: Url; comicBookId: ObjectID }
    }
  | {
      type: TaskType.UPDATECOMICSERIESPUBLISHER
      data: { comicSeriesId: ObjectID }
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

interface QueueModelOptions<R, E extends Error> {
  queueRepository: IQueueRepository<R, E>
}

export function PullListModel<R, E extends Error>({
  queueRepository,
}: QueueModelOptions<R, E>) {
  return {
    enqueueScrapingComicBooks: (comicBookUrls: Url[]) =>
      queueRepository.addTasksToQueue(
        comicBookUrls.map((comicBookUrl) => ({
          type: TaskType.SCRAPCOMICBOOK,
          data: { comicBookUrl },
        })),
      ),
    enqueueSettingComicSeriesPublisher: (comicSeriesId: ComicSeriesId) =>
      queueRepository.addTaskToQueue({
        type: TaskType.UPDATECOMICSERIESPUBLISHER,
        data: { comicSeriesId },
      }),
    enqueueInitializeComicSeries: (comicSeries: ComicSeries) =>
      queueRepository.addTasksToQueue([
        {
          type: TaskType.UPDATECOMICSERIESPUBLISHER,
          data: {
            comicSeriesId: comicSeries._id,
          },
        },
        {
          type: TaskType.SCRAPSINGLEISSUELIST,
          data: {
            comicSeriesId: comicSeries._id,
            url: comicSeries.singleIssuesUrl!,
          },
        },
        {
          type: TaskType.SCRAPCOLLECTIONLIST,
          data: {
            comicSeriesId: comicSeries._id,
            url: comicSeries.collectionsUrl!,
          },
        },
      ]),
  }
}
