import { Db, MongoError } from 'mongodb'

import type { PublisherDbObject } from 'types/graphql-schema'
import type {
  IPublisherRepository,
  PublisherId,
  ComicSeriesId,
} from './Publisher.interface'
import {
  MongoDataSource,
  MongoDataSourceOptions,
  toObjectId,
} from '../../datasources/MongoDataSource'

export const publisherCollection = 'publisher'
export class PublisherRepository extends MongoDataSource<PublisherDbObject>
  implements IPublisherRepository<Db, Error | MongoError> {
  public constructor({
    dataLayer,
    logger,
  }: {
    dataLayer: MongoDataSourceOptions['dataLayer']
    logger: MongoDataSourceOptions['logger']
  }) {
    super({ collection: publisherCollection, dataLayer, logger })
  }

  public getById = (id: PublisherId) =>
    this.findOne({ _id: toObjectId(id) }, { nonNullable: true })

  public getByUrl = (url: string) =>
    this.findOne({ cxUrl: url }, { nonNullable: true })

  public addComicSeries = (id: PublisherId, comicSeriesId: ComicSeriesId) =>
    this.updateOne(
      { _id: toObjectId(id) },
      { $addToSet: { comicSeries: toObjectId(comicSeriesId) } },
      { nonNullable: true },
    )
}
