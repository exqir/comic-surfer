import { ObjectID } from 'mongodb'

import { Task, TaskType } from 'models/Queue/Queue.interface'
import { ComicBookType } from 'types/graphql-schema'

export const defaultScrapComicBookTask: Task = {
  _id: new ObjectID(),
  type: TaskType.UPDATECOMICBOOK,
  data: { comicBookUrl: '/url' },
}

export const defaultScrapCollectionsTask: Task = {
  _id: new ObjectID(),
  type: TaskType.SCRAPCOMICBOOKLIST,
  data: {
    comicSeriesId: new ObjectID(),
    url: '/collections',
    type: ComicBookType.COLLECTION,
  },
}

export const defaultScrapSingleIssuesTask: Task = {
  _id: new ObjectID(),
  type: TaskType.SCRAPCOMICBOOKLIST,
  data: {
    comicSeriesId: new ObjectID(),
    url: '/sinle-issues',
    type: ComicBookType.SINGLEISSUE,
  },
}

export const defaultUpdatePublisherTask: Task = {
  _id: new ObjectID(),
  type: TaskType.UPDATECOMICSERIESPUBLISHER,
  data: { comicSeriesId: new ObjectID() },
}

export const defaultUpdateComicBookTask: Task = {
  _id: new ObjectID(),
  type: TaskType.UPDATECOMICBOOKRELEASE,
  data: { comicBookId: new ObjectID() },
}
