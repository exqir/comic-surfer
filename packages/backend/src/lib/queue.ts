import type { Db, MongoError } from 'mongodb'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'

import type {
  IQueueRepository,
  NewTask,
  Task,
} from 'models/Queue/Queue.interface'

export function enqueueTasks(
  repo: IQueueRepository<Db, Error | MongoError>,
): (tasks: NewTask[]) => RTE.ReaderTaskEither<Db, Error | MongoError, Task[]> {
  return repo.addTasksToQueue
}
