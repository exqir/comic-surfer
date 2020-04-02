import { PublisherDbObject } from 'types/server-schema'
import { MongoDataSource } from './MongoDataSource'
import { ObjectID } from 'mongodb'
import { pipe } from 'fp-ts/lib/pipeable'

export const publisherCollection = 'publisher'
export class PublisherAPI extends MongoDataSource<PublisherDbObject> {
  public constructor() {
    super(publisherCollection)
  }

  public addComicSeries(id: ObjectID, comicSeriesId: ObjectID) {
    const { updateOne } = this.dataLayer!
    return pipe(
      updateOne<PublisherDbObject>(
        this.collection,
        { _id: id },
        { $push: { series: comicSeriesId } },
      ),
      this.logError,
    )
  }
}
