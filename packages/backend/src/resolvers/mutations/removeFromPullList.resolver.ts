import type { Db, MongoError, ObjectId } from 'mongodb'
import { AuthenticationError } from 'apollo-server'
import { pipe } from 'fp-ts/lib/function'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'

import type {
  PullListDbObject,
  MutationRemoveFromPullListArgs,
} from 'types/graphql-schema'
import type { Resolver } from 'types/app'
import { IPullListRepository } from 'models/PullList/PullList.interface'
import { nullableField } from 'lib'
import { getUser } from 'lib/user'

export const removeFromPullList: Resolver<
  PullListDbObject,
  MutationRemoveFromPullListArgs
> = (_, { comicSeriesId }, { dataSources, db, user }) =>
  pipe(
    db,
    nullableField(
      pipe(
        getUser(user),
        RTE.chain(
          pipe(
            comicSeriesId,
            removeComicSeriesFromPullList(dataSources.pullList),
          ),
        ),
        RTE.mapLeft((error) => {
          if (error instanceof AuthenticationError) {
            throw error
          }
          return error
        }),
      ),
    ),
  )

function removeComicSeriesFromPullList(
  repo: IPullListRepository<Db, Error | MongoError>,
): (
  comicSeriesId: ObjectId,
) => (
  owner: string,
) => RTE.ReaderTaskEither<
  Db,
  AuthenticationError | Error | MongoError,
  PullListDbObject
> {
  return (comicSeriesId) => (owner) =>
    repo.removeComicSeriesFromPullList(owner, comicSeriesId)
}
