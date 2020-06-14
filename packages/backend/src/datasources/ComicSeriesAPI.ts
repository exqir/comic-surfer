import { ComicSeriesDbObject } from 'types/server-schema'
import { MongoDataSource, toObjectId } from './MongoDataSource'
import { ObjectID } from 'mongodb'
import { pipe } from 'fp-ts/lib/pipeable'

export const comicSeriesCollection = 'comicSeries'
export class ComicSeriesAPI extends MongoDataSource<ComicSeriesDbObject> {
  public constructor() {
    super(comicSeriesCollection)
  }

  public addComicBook = (id: ObjectID, comicBookId: ObjectID) => {
    const { updateOne } = this.dataLayer!
    return pipe(
      updateOne<ComicSeriesDbObject>(
        this.collection,
        { _id: toObjectId(id) },
        { $addToSet: { singleIssues: toObjectId(comicBookId) } },
      ),
      this.logError,
    )
  }
}
