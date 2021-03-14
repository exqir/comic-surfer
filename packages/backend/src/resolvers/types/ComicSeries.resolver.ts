import type { Db } from 'mongodb'
import { pipe, constNull } from 'fp-ts/lib/function'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as A from 'fp-ts/lib/Array'

import type { Resolver, NonNullableResolver } from 'types/app'
import type {
  ComicBookDbObject,
  PublisherDbObject,
  ComicSeriesDbObject,
} from 'types/graphql-schema'
import {
  mapOtoRTEnullable,
  chainMaybeToNullable,
  nonNullableField,
  nullableField,
} from 'lib'
import { getById, getByIds } from 'functions/common'

interface ComicSeriesResolver {
  singleIssues: NonNullableResolver<
    ComicBookDbObject[],
    {},
    ComicSeriesDbObject
  >
  collections: NonNullableResolver<ComicBookDbObject[], {}, ComicSeriesDbObject>
  publisher: Resolver<PublisherDbObject, {}, ComicSeriesDbObject>
  coverImgUrl: Resolver<string, {}, ComicSeriesDbObject>
  singleIssuesNumber: NonNullableResolver<number, {}, ComicSeriesDbObject>
  collectionsNumber: NonNullableResolver<number, {}, ComicSeriesDbObject>
  [index: string]: any
}

export const ComicSeries: ComicSeriesResolver = {
  singleIssues: ({ singleIssues }, _, { dataSources, db }) =>
    pipe(
      db,
      nonNullableField(pipe(singleIssues, getByIds(dataSources.comicBook))),
    ),
  collections: ({ collections }, _, { dataSources, db }) =>
    pipe(
      db,
      nonNullableField(pipe(collections, getByIds(dataSources.comicBook))),
    ),
  publisher: ({ publisher }, _, { dataSources, db }) =>
    chainMaybeToNullable(
      publisher,
      mapOtoRTEnullable(db, getById(dataSources.publisher)),
    ),
  coverImgUrl: ({ singleIssues, collections }, _, { dataSources, db }) =>
    pipe(
      db,
      nullableField(
        pipe(
          getFirstOrNull(singleIssues),
          RTE.orElse(() => getFirstOrNull(collections)),
          RTE.chainW(getById(dataSources.comicBook)),
          RTE.map(({ coverImgUrl }) => coverImgUrl),
        ),
      ),
    ),
  singleIssuesNumber: ({ singleIssues }) => singleIssues.length,
  collectionsNumber: ({ collections }) => collections.length,
}

function getFirstOrNull<T>(list: T[]): RTE.ReaderTaskEither<Db, null, T> {
  return pipe(A.head(list), RTE.fromOption(constNull))
}
