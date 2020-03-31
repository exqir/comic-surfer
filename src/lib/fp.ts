import { pipe } from 'fp-ts/lib/pipeable'
import * as O from 'fp-ts/lib/Option'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as RT from 'fp-ts/lib/ReaderTask'
import { ObjectID, Db, MongoError } from 'mongodb'
import { Maybe } from 'types/server-schema'

export const mapPromise = <T, B>(f: (f: T) => B) => (
  op: O.Option<Promise<T>>,
) => O.map<Promise<T>, Promise<B>>(p => p.then(f))(op)

export const foldRTEtoNullable = <A, B, C>() =>
  RTE.fold<A, B, C, C | null>(() => RT.of(null), RT.of)

export const run = (db: Db) => <A>(rt: RT.ReaderTask<Db, A>) => RT.run(rt, db)

export const runRTEtoNullable = <A>(
  rte: RTE.ReaderTaskEither<Db, MongoError, A>,
) => (db: Db) => pipe(rte, foldRTEtoNullable(), run(db))

export const maybeToOption = <T>(maybe: Maybe<T>) => O.fromNullable(maybe)
