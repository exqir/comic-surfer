import { Db, MongoError } from 'mongodb'

import type { ComicSeriesDbObject } from 'types/graphql-schema'
import { ComicBookType } from 'types/graphql-schema'
import type {
  IComicSeriesRepository,
  ComicSeriesId,
  ComicBookId,
  PartialSeries,
  PublisherId,
} from './ComicSeries.interface'
import {
  MongoDataSource,
  IMongoDataSourceOptions,
  toObjectId,
} from 'datasources/MongoDataSource'

export const comicSeriesCollection = 'comicSeries'
export class ComicSeriesRepository extends MongoDataSource<ComicSeriesDbObject>
  implements IComicSeriesRepository<Db, Error | MongoError> {
  public constructor({
    dataLayer,
    logger,
  }: {
    dataLayer: IMongoDataSourceOptions['dataLayer']
    logger: IMongoDataSourceOptions['logger']
  }) {
    super({ collection: comicSeriesCollection, dataLayer, logger })
  }

  public getById = (id: ComicSeriesId) =>
    this.findOne({ _id: id }, { nonNullable: true })

  public getByIds = (ids: ComicSeriesId[]) =>
    this.findMany({ _id: { $in: ids } })

  public addComicBook = (
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

  public addComicBooks = (
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

  public getOrCreate = (series: PartialSeries) =>
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

  public getLastUpdatedBefore = (date: Date) =>
    this.findMany({
      lastModified: {
        $lte: date,
      },
    })

  public setPublisher = (id: ComicSeriesId, publisherId: PublisherId) =>
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
