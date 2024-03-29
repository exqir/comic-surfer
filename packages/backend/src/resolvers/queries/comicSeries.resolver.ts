import { pipe } from 'fp-ts/lib/function'

import type { Resolver } from 'types/app'
import type {
  QueryComicSeriesArgs,
  ComicSeriesDbObject,
} from 'types/graphql-schema'
import { nullableField } from 'lib'
import { getById } from 'functions/common'

export const comicSeries: Resolver<
  ComicSeriesDbObject,
  QueryComicSeriesArgs
> = (_, { id }, { dataSources, db }) =>
  pipe(db, nullableField(pipe(id, getById(dataSources.comicSeries))))
