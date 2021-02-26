import type { Db } from 'mongodb'
import { AuthenticationError } from 'apollo-server'
import { flow } from 'fp-ts/lib/function'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as O from 'fp-ts/lib/Option'

export const getUser: (
  user: O.Option<string>,
) => RTE.ReaderTaskEither<unknown, AuthenticationError, string> = flow(
  RTE.fromOption(() => new AuthenticationError('Unauthenticated user.')),
)
