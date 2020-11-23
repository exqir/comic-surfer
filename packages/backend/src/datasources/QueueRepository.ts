import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import { Db, MongoError } from 'mongodb'
import { MongoDataSource, MongoDataSourceOptions } from './MongoDataSource'

import { Task, NewTask, IQueueRepository } from '../models/Queue/QueueModel'

export const queueCollection = 'queue'
export class QueueRepository extends MongoDataSource<Task>
  implements IQueueRepository<Db, Error | MongoError> {
  public constructor({
    dataLayer,
    logger,
  }: Omit<MongoDataSourceOptions, 'collection'>) {
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
