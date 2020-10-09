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
        {
          $addToSet: { singleIssues: toObjectId(comicBookId) },
          $currentDate: { lastModified: true },
        },
      ),
      this.logError,
    )
  }

  public addComicBooks = (id: ObjectID, comicBookIds: ObjectID[]) => {
    const { updateOne } = this.dataLayer!
    return pipe(
      updateOne<ComicSeriesDbObject>(
        this.collection,
        { _id: toObjectId(id) },
        {
          $addToSet: { singleIssues: { $each: comicBookIds.map(toObjectId) } },
          $currentDate: { lastModified: true },
        },
      ),
      this.logError,
    )
  }

  public addComicBookCollections = (id: ObjectID, comicBookIds: ObjectID[]) => {
    const { updateOne } = this.dataLayer!
    return pipe(
      updateOne<ComicSeriesDbObject>(
        this.collection,
        { _id: toObjectId(id) },
        {
          $addToSet: {
            collections: { $each: comicBookIds.map(toObjectId) },
          },
          $currentDate: { lastModified: true },
        },
      ),
      this.logError,
    )
  }

  public insertIfNotExisting = (
    series: Omit<
      ComicSeriesDbObject,
      '_id' | 'singleIssues' | 'collections' | 'publisher' | 'lastModified'
    >,
  ) => {
    const { updateOne } = this.dataLayer!
    return pipe(
      updateOne<ComicSeriesDbObject>(
        this.collection,
        { url: series.url },
        {
          $setOnInsert: {
            ...series,
            publisher: null,
            singleIssues: [],
            collections: [],
            lastModified: new Date(),
          },
        },
        { upsert: true },
      ),
      this.logError,
    )
  }

  public getLeastUpdated = () => {
    const { findMany } = this.dataLayer!
    const date = new Date()
    return pipe(
      findMany<ComicSeriesDbObject>(this.collection, {
        // lastModified more then a month ago
        lastModified: {
          $lte: new Date(
            date.getFullYear(),
            date.getMonth() - 1,
            date.getDate(),
          ),
        },
      }),
      this.logError,
    )
  }

  public updatePublisher = (id: ObjectID, publisher: ObjectID) => {
    const { updateOne } = this.dataLayer!
    return pipe(
      updateOne<ComicSeriesDbObject>(
        this.collection,
        { _id: id },
        {
          $set: {
            publisher,
          },
        },
      ),
      this.logError,
    )
  }
}
