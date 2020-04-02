import { pipe } from 'fp-ts/lib/pipeable'
import * as O from 'fp-ts/lib/Option'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as RT from 'fp-ts/lib/ReaderTask'
import { Maybe } from 'types/server-schema'
import { Logger } from 'types/app'
import { MongoError } from 'mongodb'

export const logError = (logger: Logger) => (err: MongoError) => {
  logger.error(err.message)
  return err
}

export const foldRTEtoNullable = <A, B, C>() =>
  RTE.fold<A, B, C, C | null>(() => RT.of(null), RT.of)

export const run = <T>(t: T) => <A>(rt: RT.ReaderTask<T, A>) => RT.run(rt, t)

export const runRTEtoNullable = <T, L, R>(
  rte: RTE.ReaderTaskEither<T, L, R>,
) => (t: T) => pipe(rte, foldRTEtoNullable(), run(t))

export const maybeToOption = <T>(maybe: Maybe<T>) => O.fromNullable(maybe)

export const chainMaybeToNullable = <T, R>(
  maybe: Maybe<T>,
  fn: (o: T) => O.Option<R>,
) => pipe(maybe, maybeToOption, O.chain(fn), O.toNullable)

export const mapOption = <T, R>(o: O.Option<T>, fn: (t: T) => R) =>
  pipe(o, O.map(fn))

export const mapOtoRTEnullable = <T, L, R, V>(
  o: O.Option<T>,
  fn: (v: V) => RTE.ReaderTaskEither<T, L, R>,
) => (v: V) => mapOption(o, runRTEtoNullable(fn(v)))
