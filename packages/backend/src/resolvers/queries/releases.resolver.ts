import type { Db, MongoError } from 'mongodb'
import { flow, pipe } from 'fp-ts/lib/function'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'

import type { Resolver } from 'types/app'
import type {
  ComicBookDbObject,
  PullListDbObject,
  QueryReleasesArgs,
} from 'types/graphql-schema'
import { ComicBookType } from 'types/graphql-schema'
import { nullableField } from 'lib'
import { getUser } from 'lib/user'
import { getByOwner } from 'lib/pullList'
import {
  IComicBookRepository,
  Month,
} from 'models/ComicBook/ComicBook.interface'

export const releases: Resolver<ComicBookDbObject[], QueryReleasesArgs> = (
  _,
  {
    month = new Date().getMonth() + 1,
    year = new Date().getFullYear(),
    type = ComicBookType.SINGLEISSUE,
  },
  { dataSources, db, user },
) =>
  pipe(
    db,
    nullableField(
      pipe(
        getUser(user),
        RTE.chain(getByOwner(dataSources.pullList)),
        RTE.chain(
          getReleasesInMonthFromList(dataSources.comicBook)(
            // TODO: Validate month or use a GraphQL enum
            // @ts-ignore
            month ?? new Date().getMonth() + 1,
            year ?? new Date().getFullYear(),
            type ?? ComicBookType.SINGLEISSUE,
          ),
        ),
        RTE.orElse(() =>
          getReleasesInMonth(dataSources.comicBook)(
            // TODO: Validate month
            // @ts-ignore
            month ?? new Date().getMonth() + 1,
            year ?? new Date().getFullYear(),
            type ?? ComicBookType.SINGLEISSUE,
          ),
        ),
      ),
    ),
  )

function getReleasesInMonthFromList(
  repo: IComicBookRepository<Db, Error | MongoError>,
): (
  month: Month,
  year: number,
  type: ComicBookType,
) => ({
  list,
}: PullListDbObject) => RTE.ReaderTaskEither<
  Db,
  Error | MongoError,
  ComicBookDbObject[]
> {
  return (month, year, type) => ({ list }) =>
    repo.getBySeriesAndReleaseInMonth(list, month, year, type)
}

function getReleasesInMonth(
  repo: IComicBookRepository<Db, Error | MongoError>,
): (
  month: Month,
  year: number,
  type: ComicBookType,
) => RTE.ReaderTaskEither<Db, Error | MongoError, ComicBookDbObject[]> {
  return flow(repo.getByReleaseInMonth)
}
