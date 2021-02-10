import type { Db, MongoError, ObjectID } from 'mongodb'
import { flow } from 'fp-ts/lib/function'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'

interface RepoWithGetById<T> {
  getById: (id: ObjectID) => RTE.ReaderTaskEither<Db, Error | MongoError, T>
}

export function getById<T>(
  repo: RepoWithGetById<T>,
): (id: ObjectID) => RTE.ReaderTaskEither<Db, Error | MongoError, T> {
  return flow(repo.getById)
}
