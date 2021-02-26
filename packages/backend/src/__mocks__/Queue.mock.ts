import { ObjectID } from 'mongodb'

import { Task, TaskType } from 'models/Queue/Queue.interface'

export const defaultScrapComicBookTask: Task = {
  _id: new ObjectID(),
  type: TaskType.SCRAPCOMICBOOK,
  data: { comicBookUrl: '/url' },
}

export const defaultScrapCollectionsTask: Task = {
  _id: new ObjectID(),
  type: TaskType.SCRAPCOLLECTIONLIST,
  data: { comicSeriesId: new ObjectID(), url: '/collections' },
}

export const defaultScrapSingleIssuesTask: Task = {
  _id: new ObjectID(),
  type: TaskType.SCRAPSINGLEISSUELIST,
  data: { comicSeriesId: new ObjectID(), url: '/collections' },
}

export const defaultUpdatePublisherTask: Task = {
  _id: new ObjectID(),
  type: TaskType.UPDATECOMICSERIESPUBLISHER,
  data: { comicSeriesId: new ObjectID() },
}
