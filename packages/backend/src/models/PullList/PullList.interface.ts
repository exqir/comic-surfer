import type { ObjectID } from 'mongodb'
import type * as RTE from 'fp-ts/lib/ReaderTaskEither'

import type { PullListDbObject } from 'types/server-schema'

export type Owner = string
export type ComicSeriesId = ObjectID

export interface IPullListRepository<R, E extends Error = Error> {
  createPullList: (owner: Owner) => RTE.ReaderTaskEither<R, E, PullListDbObject>

  getOrCreatePullList: (
    owner: Owner,
  ) => RTE.ReaderTaskEither<R, E, PullListDbObject>

  getPullListByOwner: (
    owner: Owner,
  ) => RTE.ReaderTaskEither<R, E, PullListDbObject>

  addComicSeriesToPullList: (
    owner: Owner,
    comicSeriesId: ComicSeriesId,
  ) => RTE.ReaderTaskEither<R, E, PullListDbObject>

  removeComicSeriesFromPullList: (
    owner: Owner,
    comicSeriesId: ComicSeriesId,
  ) => RTE.ReaderTaskEither<R, E, PullListDbObject>
}
