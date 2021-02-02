import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import { ObjectID } from 'mongodb'

import type {
  IQueueRepository,
  ComicSeries,
  ComicSeriesId,
  Url,
} from './Queue.interface'
import { TaskType } from './Queue.interface'

interface QueueModelOptions<R, E extends Error> {
  queueRepository: IQueueRepository<R, E>
}

export function QueueModel<R, E extends Error>({
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
