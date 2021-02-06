import type { ObjectID } from 'mongodb'
import type * as RTE from 'fp-ts/lib/ReaderTaskEither'

import { ComicBookDbObject, ComicBookType } from 'types/server-schema'

export type ComicBookId = ObjectID
export type ComicSeriesId = ObjectID
export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

export interface IComicBookDetails {
  publisher: ObjectID | null
  coverImgUrl: string | null
  releaseDate: Date | null
  creators: { name: string }[]
  description: string | null
}

export interface IComicBookRepository<R, E extends Error = Error> {
  getById: (id: ComicBookId) => RTE.ReaderTaskEither<R, E, ComicBookDbObject>

  getByUrls: (urls: string[]) => RTE.ReaderTaskEither<R, E, ComicBookDbObject[]>

  getBySeriesAndReleaseInMonth: (
    series: ComicSeriesId[],
    month: Month,
    year: number,
    type: ComicBookType,
  ) => RTE.ReaderTaskEither<R, E, ComicBookDbObject[]>

  getByReleaseInMonth: (
    month: Month,
    year: number,
    type: ComicBookType,
  ) => RTE.ReaderTaskEither<R, E, ComicBookDbObject[]>

  getUpcomingReleasesNotUpated: (
    date: Date,
  ) => RTE.ReaderTaskEither<R, E, ComicBookDbObject[]>

  addComicBooks: (
    comicBooks: Omit<ComicBookDbObject, '_id' | 'lastModified'>[],
  ) => RTE.ReaderTaskEither<R, E, ComicBookDbObject[]>

  updateReleaseDate: (
    id: ComicBookId,
    newDate: Date,
  ) => RTE.ReaderTaskEither<R, E, ComicBookDbObject>

  updateComicBookDetails: (
    url: string,
    comicBookDetails: IComicBookDetails,
  ) => RTE.ReaderTaskEither<R, E, ComicBookDbObject>
}

export interface IComicBookModel<R, E extends Error = Error> {
  getById: (id: ComicBookId) => RTE.ReaderTaskEither<R, E, ComicBookDbObject>
}
