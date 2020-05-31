import { PublisherDbObject } from 'types/server-schema'
import { MongoDataSource, toObjectId } from './MongoDataSource'
import { ObjectID } from 'mongodb'
import { pipe } from 'fp-ts/lib/pipeable'

export const publisherCollection = 'publisher'
export class PublisherAPI extends MongoDataSource<PublisherDbObject> {
  public constructor() {
    super(publisherCollection)
  }

  public getByName = (name: string) => {
    const { findOne } = this.dataLayer!
    return pipe(
      findOne<PublisherDbObject>(this.collection, { name }),
      this.logError,
    )
  }

  public getByNames = (names: string[]) => {
    const { findMany } = this.dataLayer!
    return pipe(
      findMany<PublisherDbObject>(this.collection, { name: { $in: names } }),
      this.logError,
    )
  }

  public addComicSeries = (id: ObjectID, comicSeriesId: ObjectID) => {
    const { updateOne } = this.dataLayer!
    return pipe(
      updateOne<PublisherDbObject>(
        this.collection,
        { _id: toObjectId(id) },
        { $push: { series: toObjectId(comicSeriesId) } },
      ),
      this.logError,
    )
  }
}
