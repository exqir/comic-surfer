import { Db, MongoError } from 'mongodb';
import { run, ReaderTaskEither } from 'fp-ts/lib/ReaderTaskEither';

/**
 * Turns `run` from `fp-ts` into a curried function, taking a `Reader` as parameter
 * and returning a function expecting the dependency for the `Reader`. This can be useful
 * in conjunction with `pipe`.
 * @param reader
 */
export const partialRun = <T>(reader: ReaderTaskEither<Db, MongoError, T>) => (db: Db) => run(reader, db)
