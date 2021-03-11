import { Db, MongoError } from 'mongodb'

import type { ComicBookDbObject, ComicBookType } from 'types/graphql-schema'
import type {
  IComicBookRepository,
  ComicBookId,
  ComicSeriesId,
  Month,
  IComicBookDetails,
} from './ComicBook.interface'
import {
  MongoDataSource,
  IMongoDataSourceOptions,
  toObjectId,
} from 'datasources/MongoDataSource'

export const comicBookCollection = 'comicBook'
export class ComicBookRepository extends MongoDataSource<ComicBookDbObject>
  implements IComicBookRepository<Db, Error | MongoError> {
  public constructor({
    dataLayer,
    logger,
  }: {
    dataLayer: IMongoDataSourceOptions['dataLayer']
    logger: IMongoDataSourceOptions['logger']
  }) {
    super({ collection: comicBookCollection, dataLayer, logger })
  }

  public addComicBooks = (
    comicBooks: Omit<ComicBookDbObject, '_id' | 'lastModified'>[],
  ) =>
    this.insertMany(
      comicBooks.map((comicBook) => ({
        ...comicBook,
        lastModified: new Date(),
      })),
    )

  public updateReleaseDate = (id: ComicBookId, newDate: Date) =>
    this.updateOne(
      { _id: toObjectId(id) },
      {
        $set: { releaseDate: newDate },
        $currentDate: { lastModified: true },
      },
      { nonNullable: true },
    )

  public updateComicBookDetails = (
    id: ComicBookId,
    {
      publisher,
      coverImgUrl,
      releaseDate,
      creators,
      description,
    }: IComicBookDetails,
  ) =>
    this.updateOne(
      { _id: id },
      {
        $set: { publisher, coverImgUrl, releaseDate, creators, description },
        $currentDate: { lastModified: true },
      },
      { nonNullable: true },
    )

  public getById = (id: ComicBookId) =>
    this.findOne({ _id: id }, { nonNullable: true })

  public getByIds = (ids: ComicBookId[]) => this.findMany({ _id: { $in: ids } })

  public getByUrls = (urls: string[]) => this.findMany({ url: { $in: urls } })

  public getBySeriesAndReleaseInMonth = (
    series: ComicSeriesId[],
    month: Month,
    year: number,
    type: ComicBookType,
  ) =>
    this.findMany({
      $and: [
        { comicSeries: { $in: series } },
        {
          releaseDate: {
            $gte: new Date(year, month - 1, 1),
            $lt: new Date(year, month, 1),
          },
        },
        { type },
      ],
    })

  public getByReleaseInMonth = (
    month: Month,
    year: number,
    type: ComicBookType,
  ) =>
    this.findMany({
      $and: [
        {
          releaseDate: {
            $gte: new Date(year, month - 1, 1),
            $lt: new Date(year, month, 1),
          },
        },
        { type },
      ],
    })

  public getByReleaseBetweenAndLastUpdatedBefore = (
    releaseAfter: Date,
    releaseBefore: Date,
    updatedBefore: Date,
  ) =>
    this.findMany({
      $and: [
        {
          releaseDate: {
            $gte: releaseAfter,
            $lt: releaseBefore,
          },
        },
        {
          lastModified: {
            $lte: updatedBefore,
          },
        },
      ],
    })
}
