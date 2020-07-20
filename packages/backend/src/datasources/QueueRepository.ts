import { ObjectID, WithId } from 'mongodb'
import { MongoDataSource } from './MongoDataSource'
import { pipe } from 'fp-ts/lib/pipeable'

export enum TaskType {
  SCRAPSINGLEISSUELIST = 'SCRAP_SINGLE_ISSUE_LIST',
  SCRAPCOLLECTIONLIST = 'SCRAP_COLLECTION_LIST',
  SCRAPCOMICBOOK = 'SCRAP_COMIC_BOOK',
}

type Queue = WithId<
  | {
      type: TaskType.SCRAPSINGLEISSUELIST | TaskType.SCRAPCOLLECTIONLIST
      data: { url: string; comicSeriesId: ObjectID }
    }
  | { type: TaskType.SCRAPCOMICBOOK; data: { url: string } }
>

export const queueCollection = 'queue'
export class QueueRepository extends MongoDataSource<Queue> {
  public constructor() {
    super(queueCollection)
  }

  public insertMany = (documents: Omit<Queue, '_id'>[]) => {
    const { insertMany } = this.dataLayer!
    return pipe(
      insertMany<Omit<Queue, '_id'>>(this.collection, documents),
      this.logError,
    )
  }
}
