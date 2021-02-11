import type { Db, MongoError, ObjectID } from 'mongodb'
import { flow } from 'fp-ts/lib/function'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'

interface IRepoWithGetById<T> {
  getById: (id: ObjectID) => RTE.ReaderTaskEither<Db, Error | MongoError, T>
}

export function getById<T>(
  repo: IRepoWithGetById<T>,
): (id: ObjectID) => RTE.ReaderTaskEither<Db, Error | MongoError, T> {
  return flow(repo.getById)
}

interface IRepoWithGetByIds<T> {
  getByIds: (
    ids: ObjectID[],
  ) => RTE.ReaderTaskEither<Db, Error | MongoError, T[]>
}

export function getByIds<T>(
  repo: IRepoWithGetByIds<T>,
): (ids: ObjectID[]) => RTE.ReaderTaskEither<Db, Error | MongoError, T[]> {
  return flow(repo.getByIds)
}
