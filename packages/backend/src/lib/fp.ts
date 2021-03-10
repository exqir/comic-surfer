import { pipe } from 'fp-ts/lib/pipeable'
import * as O from 'fp-ts/lib/Option'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as RT from 'fp-ts/lib/ReaderTask'
import * as R from 'fp-ts/lib/Reader'
import * as TE from 'fp-ts/lib/TaskEither'
import * as T from 'fp-ts/lib/Task'
import { Maybe } from 'types/graphql-schema'
import { Logger } from 'types/app'
import { Db, MongoError } from 'mongodb'
import { constNull, flow, identity } from 'fp-ts/lib/function'

export const logError = (logger: Logger) => (err: MongoError) => {
  logger.error(err.message)
  return err
}

export const runRT = <T, A>(rte: RT.ReaderTask<T, A>) => (t: T) =>
  RT.run(rte, t)

export const foldTEtoNullable = <A, B>() =>
  TE.fold<A, B, B | null>(() => T.of(null), T.of)

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

export const filterMaybe = <T>(m: Maybe<T>[]): T[] =>
  m.filter((mm): mm is T => mm !== null)

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////

const getOrThrow = flow(
  RTE.fold((error) => {
    throw error
  }, RT.of),
)

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////

// TODO: Log error
export const nullableField = <L, R>(
  rte: RTE.ReaderTaskEither<Db, L, Maybe<R>>,
): ((db: O.Option<Db>) => Promise<Maybe<R>> | null) => {
  return flow(O.map(runRTEtoNullable(rte)), O.toNullable)
}

// TODO: Prevent MongoError from being thrown to not leak
// internal error messages, only Apollo and AuthenticationErrors
// should be allowed to be thrown.
export const nonNullableField = <L, R>(
  rte: RTE.ReaderTaskEither<Db, L, R>,
): ((db: O.Option<Db>) => Promise<R>) => {
  return flow(
    O.map(flow(runRT(getOrThrow(rte)))),
    O.fold(() => {
      throw new Error('Connection error.')
    }, identity),
  )
}
