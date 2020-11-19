import { ObjectID } from 'mongodb'
import { MongoDataSource } from './MongoDataSource'

export enum TaskType {
  SCRAPSINGLEISSUELIST = 'SCRAP_SINGLE_ISSUE_LIST',
  SCRAPCOLLECTIONLIST = 'SCRAP_COLLECTION_LIST',
  SCRAPCOMICBOOK = 'SCRAP_COMIC_BOOK',
  UPDATECOMICBOOKRELEASE = 'UPDATE_COMIC_BOOK_RELEASE',
  UPDATECOMICSERIESPUBLISHER = 'UPDATE_COMIC_SERIES_PUBLISHER',
}

// TODO: Add a status to the Task type: 'Queued' | 'Error' | 'Done'
type Task =
  | {
      _id: ObjectID
      type: TaskType.SCRAPSINGLEISSUELIST | TaskType.SCRAPCOLLECTIONLIST
      data: { url: string; comicSeriesId: ObjectID }
    }
  | {
      _id: ObjectID
      type: TaskType.UPDATECOMICBOOKRELEASE
      data: { comicBookId: ObjectID; url: string }
    }
  | {
      _id: ObjectID
      type: TaskType.UPDATECOMICSERIESPUBLISHER
      data: { comicSeriesId: ObjectID }
    }
  | {
      _id: ObjectID
      type: TaskType.SCRAPCOMICBOOK
      data: { comicBookUrl: string }
    }

export const queueCollection = 'queue'
export class QueueRepository extends MongoDataSource<Task> {
  public constructor() {
    super(queueCollection)
  }

  public enqueueTask = (task: Task) => this.insertOne(task)
  public enqueueTasks = (tasks: Task[]) => this.insertMany(tasks)
}
