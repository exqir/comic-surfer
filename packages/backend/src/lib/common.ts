import { Db, MongoError, ObjectID } from 'mongodb'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'

export function getById<T>(repo: {
  getById: (id: ObjectID) => RTE.ReaderTaskEither<Db, Error | MongoError, T>
}) {
  return (id: ObjectID) => repo.getById(id)
}
