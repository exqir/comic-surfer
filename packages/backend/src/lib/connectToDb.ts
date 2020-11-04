import { Db } from 'mongodb'
import { connect, getDb } from 'mongad'
import { pipe } from 'fp-ts/lib/pipeable'
import * as TE from 'fp-ts/lib/TaskEither'
import * as T from 'fp-ts/lib/Task'
import * as O from 'fp-ts/lib/Option'
import { Logger } from 'types/app'

import { logError } from 'lib/fp'

const dbConnectionString = process.env.MONGO_URL || 'mongodb://mongo:27017'
const dbName = process.env.DB_NAME || 'riddler'

export const createConnectToDb = (logger: Logger): T.Task<O.Option<Db>> => {
  let dbO: O.Option<Db> = O.none

  return () =>
    O.isSome(dbO)
      ? Promise.resolve(dbO)
      : pipe(
          connect(dbConnectionString),
          TE.map(getDb(dbName)),
          TE.mapLeft(logError(logger)),
          TE.fold(
            () => {
              dbO = O.none
              return T.of(dbO)
            },
            (db) => {
              dbO = O.some(db)
              return T.of(dbO)
            },
          ),
        )()
}
