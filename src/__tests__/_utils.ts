import { MongoError, Db } from 'mongodb'
import { some, map, Option } from 'fp-ts/lib/Option'
import { right, left, Either, fold, } from 'fp-ts/lib/Either'
import { DataSources } from 'types/app'
import { NextApiRequest } from 'next'
import { KeyValueCache } from 'apollo-server-core'

/**
 * Creates a `ReaderTaskEither<Db, MongoError, T>` that returns `value` as right
 * side or a `MongoError` as left side in case of `isFailure`.
 * @param value {T} Value to be returned when the Task is executed.
 * @param isFailure {boolean} Defines if a success or failure should be mocked.
 * @returns reader {ReaderTaskEither<Db, MongoError, T>}
 */
export function createMockReaderWithReturnValue<T>(value: T, isFailure?: boolean): (db: Db) => () => Promise<Either<MongoError, T>>
export function createMockReaderWithReturnValue<T>(value: T[], isFailure?: boolean): (db: Db) => () => Promise<Either<MongoError, T[]>>
export function createMockReaderWithReturnValue<T>(value: T | T[], isFailure?: boolean) {
  return (db: Db) => () => new Promise<Either<MongoError, T | T[]>>((resolve, reject) => {
    const either = isFailure ? left(new MongoError('TestError')) : right(value)
    resolve(either)
  })
}

/**
 * Fold for a Type of `Option<Promise<Either<MongoError, T>>>`.
 * @param res 
 * @param onLeft 
 * @param onRight 
 */
export const foldOptionPromise = <T>(res: Option<Promise<Either<MongoError, T>>>, onLeft: (l: MongoError) => void, onRight: (r: T) => void) =>
  map<Promise<Either<MongoError, T>>, {}>(promise => promise.then(fold(onLeft, onRight)))(res)

export function createMockOptionWithReturnValue<T>(value: T, isFailure?: boolean): Option<Promise<Either<MongoError, T>>>
export function createMockOptionWithReturnValue<T>(value: T[], isFailure?: boolean): Option<Promise<Either<MongoError, T[]>>>
export function createMockOptionWithReturnValue<T>(value: T | T[], isFailure?: boolean) {
  return some(new Promise<Either<MongoError, T | T[]>>((resolve, reject) => {
    const either = isFailure ? left(new MongoError('TestError')) : right(value)
    resolve(either)
  }))
}


const mockLogger = {
  error: jest.fn(),
  info: jest.fn(),
  log: jest.fn(),
}
const mockDataLayer = {
  findOne: jest.fn(),
  findMany: jest.fn(),
  insertOne: jest.fn(),
  insertMany: jest.fn(),
  updateOne: jest.fn(),
  updateMany: jest.fn(),
  deleteOne: jest.fn(),
  deleteMany: jest.fn(),
}

/**
 * Creates a config object to initialize DataSources.
 */
export const createMockConfig = () => ({
  context: {
    req: {} as NextApiRequest,
    dataLayer: mockDataLayer,
    dataSources: {} as DataSources,
    logger: mockLogger,
    db: some({} as Db)
  },
  cache: {} as KeyValueCache,
})