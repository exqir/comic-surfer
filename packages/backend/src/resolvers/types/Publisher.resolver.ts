import { pipe } from 'fp-ts/lib/function'

import type { NonNullableResolver } from 'types/app'
import type {
  PublisherDbObject,
  ComicSeriesDbObject,
} from 'types/server-schema'
import { nonNullableField } from 'lib'
import { getByIds } from 'lib/common'

interface PublisherResolver {
  comicSeries: NonNullableResolver<ComicSeriesDbObject[], {}, PublisherDbObject>
}

export const Publisher: PublisherResolver = {
  comicSeries: ({ comicSeries }, _, { dataSources, db }) =>
    pipe(
      db,
      nonNullableField(pipe(comicSeries, getByIds(dataSources.comicSeries))),
    ),
}
