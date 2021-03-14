import { pipe } from 'fp-ts/lib/function'

import type { NonNullableResolver } from 'types/app'
import type {
  PublisherDbObject,
  ComicSeriesDbObject,
} from 'types/graphql-schema'
import { nonNullableField } from 'lib'
import { getByIds } from 'functions/common'

interface PublisherResolver {
  comicSeries: NonNullableResolver<ComicSeriesDbObject[], {}, PublisherDbObject>
  [index: string]: any
}

export const Publisher: PublisherResolver = {
  comicSeries: ({ comicSeries }, _, { dataSources, db }) =>
    pipe(
      db,
      nonNullableField(pipe(comicSeries, getByIds(dataSources.comicSeries))),
    ),
}
