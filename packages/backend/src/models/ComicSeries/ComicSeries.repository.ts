import { Db, MongoError } from 'mongodb'

import type { ComicSeriesDbObject } from 'types/server-schema'
import { ComicBookType } from 'types/server-schema'
import type {
  IComicSeriesRepository,
  ComicSeriesId,
  ComicBookId,
  PartialSeries,
  PublisherId,
} from './ComicSeries.interface'
import {
  MongoDataSource,
  MongoDataSourceOptions,
  toObjectId,
} from '../../datasources/MongoDataSource'

export const comicSeriesCollection = 'comicSeries'
export class ComicSeriesRepository extends MongoDataSource<ComicSeriesDbObject>
  implements IComicSeriesRepository<Db, Error | MongoError> {
  public constructor({
    dataLayer,
    logger,
  }: {
    dataLayer: MongoDataSourceOptions['dataLayer']
    logger: MongoDataSourceOptions['logger']
  }) {
    super({ collection: comicSeriesCollection, dataLayer, logger })
  }

  addComicBook = (
    id: ComicSeriesId,
    comicBookId: ComicBookId,
    type: ComicBookType,
  ) => {
    const field =
      type === ComicBookType.SINGLEISSUE ? 'singleIssues' : 'collections'
    return this.updateOne(
      { _id: toObjectId(id) },
      {
        $addToSet: { [field]: toObjectId(comicBookId) },
        $currentDate: { lastModified: true },
      },
      { nonNullable: true },
    )
  }

  addComicBooks = (
    id: ComicSeriesId,
    comicBookIds: ComicBookId[],
    type: ComicBookType,
  ) => {
    const field =
      type === ComicBookType.SINGLEISSUE ? 'singleIssues' : 'collections'
    return this.updateOne(
      { _id: toObjectId(id) },
      {
        $addToSet: { [field]: { $each: comicBookIds.map(toObjectId) } },
        $currentDate: { lastModified: true },
      },
      { nonNullable: true },
    )
  }

  getOrCreate = (series: PartialSeries) =>
    this.updateOne(
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
      { upsert: true, nonNullable: true },
    )

  getLastUpdatedBefore = (date: Date) =>
    this.findMany({
      // lastModified more then a month ago
      lastModified: {
        $lte: new Date(date.getFullYear(), date.getMonth() - 1, date.getDate()),
      },
    })

  setPublisher = (id: ComicSeriesId, publisherId: PublisherId) =>
    this.updateOne(
      { _id: toObjectId(id) },
      {
        $set: {
          publisher: toObjectId(publisherId),
        },
      },
      { nonNullable: true },
    )
}
