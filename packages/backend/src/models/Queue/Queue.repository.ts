import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import { Db, MongoError } from 'mongodb'
import {
  MongoDataSource,
  IMongoDataSourceOptions,
} from 'datasources/MongoDataSource'

import type { Task, NewTask, IQueueRepository } from './Queue.interface'

export const queueCollection = 'queue'
export class QueueRepository extends MongoDataSource<Task>
  implements IQueueRepository<Db, Error | MongoError> {
  public constructor({
    dataLayer,
    logger,
  }: Omit<IMongoDataSourceOptions, 'collection'>) {
    super({ collection: queueCollection, dataLayer, logger })
  }

  // TODO: Fix WithId type in mongad
  public addTaskToQueue = (task: NewTask) =>
    this.insertOne(task) as RTE.ReaderTaskEither<Db, Error | MongoError, Task>
  public addTasksToQueue = (tasks: NewTask[]) =>
    this.insertMany(tasks) as RTE.ReaderTaskEither<
      Db,
      Error | MongoError,
      Task[]
    >
}
