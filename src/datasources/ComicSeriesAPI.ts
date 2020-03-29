import { ComicSeriesDbObject } from 'types/server-schema'
import { MongoDataSource } from './MongoDataSource'
import { ObjectID } from 'mongodb'

export const comicSeriesCollection = 'comicSeries'
export class ComicSeriesAPI extends MongoDataSource<ComicSeriesDbObject> {
  public constructor() {
    super(comicSeriesCollection)
  }

  // TODO: check if comic book is already in comic series
  // e.g. list: { $ne: comicSeriesId }
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
