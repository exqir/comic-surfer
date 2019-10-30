import { Db, MongoError } from 'mongodb';
import { run, ReaderTaskEither } from 'fp-ts/lib/ReaderTaskEither';

export const partialRun = <T>(reader: ReaderTaskEither<Db, MongoError, T>) => (db: Db) => run(reader, db) 