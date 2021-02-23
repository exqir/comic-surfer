import { pipe } from 'fp-ts/lib/function'

import type { NonNullableResolver } from 'types/app'
import type { PullListDbObject, ComicSeriesDbObject } from 'types/server-schema'
import { nonNullableField } from 'lib'
import { getByIds } from 'lib/common'

interface PullListResolver {
  list: NonNullableResolver<ComicSeriesDbObject[], {}, PullListDbObject>
  [index: string]: any
}

export const PullList: PullListResolver = {
  list: ({ list }, _, { dataSources, db }) =>
    pipe(db, nonNullableField(pipe(list, getByIds(dataSources.comicSeries)))),
}
