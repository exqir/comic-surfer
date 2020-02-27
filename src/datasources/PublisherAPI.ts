import { PublisherDbObject } from 'types/server-schema'
import { MongoDataSource } from './MongoDataSource'
import { ObjectID } from 'mongodb'

export const publisherCollection = 'publisher'
export class PublisherAPI extends MongoDataSource<PublisherDbObject> {
  public constructor() {
    super(publisherCollection)
  }

  public addComicSeries(id: ObjectID, comicSeriesId: ObjectID) {
    const { updateOne } = this.dataLayer!
    return this.execute(
      updateOne(
        this.collection,
        { _id: id },
        { $push: { series: comicSeriesId } },
      ),
    )
  }
}
