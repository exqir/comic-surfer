import { ComicSeriesDbObject } from 'types/server-schema'
import { MongoDataSource } from './MongoDataSource'
import { ObjectID } from 'mongodb'

export const comicSeriesCollection = 'comicSeries'
export class ComicSeriesAPI extends MongoDataSource<ComicSeriesDbObject> {
  public constructor() {
    super(comicSeriesCollection)
  }

  public addComicBook(id: ObjectID, comicBookId: ObjectID) {
    const { updateOne } = this.dataLayer!
    return this.execute(
      updateOne(
        this.collection,
        { _id: id },
        { $push: { issues: comicBookId } },
      ),
    )
  }
}
