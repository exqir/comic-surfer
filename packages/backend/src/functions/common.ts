import type { Db, MongoError, ObjectID } from 'mongodb'
import { AuthenticationError } from 'apollo-server'
import { flow } from 'fp-ts/lib/function'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'

import type { IWithUrl } from 'types/common'

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

export function throwOnAuthenticationError<E extends Error>(error: E) {
  if (error instanceof AuthenticationError) {
    throw error
  }
  return error
}

export function getUrl<T extends IWithUrl>({ url }: T) {
  return url
}
