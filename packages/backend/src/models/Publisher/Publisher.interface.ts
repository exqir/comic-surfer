import type { ObjectID } from 'mongodb'
import type * as RTE from 'fp-ts/lib/ReaderTaskEither'

import { PublisherDbObject } from 'types/server-schema'

export type PublisherId = ObjectID
export type ComicSeriesId = ObjectID

export interface IPublisherRepository<R, E extends Error = Error> {
  getById: (id: PublisherId) => RTE.ReaderTaskEither<R, E, PublisherDbObject>

  getByUrl: (url: string) => RTE.ReaderTaskEither<R, E, PublisherDbObject>

  addComicSeries: (
    id: PublisherId,
    comicSeriesId: ComicSeriesId,
  ) => RTE.ReaderTaskEither<R, E, PublisherDbObject>
}
