import type { Db, MongoError } from 'mongodb'
import { ApolloError } from 'apollo-server'
import { flow } from 'fp-ts/lib/function'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'

import type { PullListDbObject } from 'types/server-schema'
import { IPullListRepository } from 'models/PullList/PullList.interface'

export function getByOwner(
  repo: IPullListRepository<Db, Error | MongoError>,
): (
  owner: string,
) => RTE.ReaderTaskEither<Db, Error | MongoError, PullListDbObject> {
  return flow(
    repo.getPullListByOwner,
    RTE.mapLeft(
      () => new ApolloError('User has no PullList.', 'PULLLIST_NOT_FOUND'),
    ),
  )
}
