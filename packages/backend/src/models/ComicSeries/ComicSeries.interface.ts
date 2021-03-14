import type { ObjectID } from 'mongodb'
import type * as RTE from 'fp-ts/lib/ReaderTaskEither'

import { ComicSeriesDbObject, ComicBookType } from 'types/graphql-schema'

export type ComicSeriesId = ObjectID
export type ComicBookId = ObjectID
export type PublisherId = ObjectID
export type PartialSeries = Omit<
  ComicSeriesDbObject,
  '_id' | 'singleIssues' | 'collections' | 'publisher' | 'lastModified'
>

export interface IComicSeriesRepository<R, E extends Error = Error> {
  getById: (
    id: ComicSeriesId,
  ) => RTE.ReaderTaskEither<R, E, ComicSeriesDbObject>

  getByIds: (
    ids: ComicSeriesId[],
  ) => RTE.ReaderTaskEither<R, E, ComicSeriesDbObject[]>

  addComicBook: (
    id: ComicSeriesId,
    comicBookId: ComicBookId,
    type: ComicBookType,
  ) => RTE.ReaderTaskEither<R, E, ComicSeriesDbObject>

  addComicBooks: (
    id: ComicSeriesId,
    comicBookIds: ComicBookId[],
    type: ComicBookType,
  ) => RTE.ReaderTaskEither<R, E, ComicSeriesDbObject>

  getOrCreate: (
    series: PartialSeries,
  ) => RTE.ReaderTaskEither<R, E, ComicSeriesDbObject>

  getLastUpdatedBefore: (
    date: Date,
  ) => RTE.ReaderTaskEither<R, E, ComicSeriesDbObject[]>

  setPublisher: (
    id: ComicSeriesId,
    publisherId: PublisherId,
  ) => RTE.ReaderTaskEither<R, E, ComicSeriesDbObject>
}
