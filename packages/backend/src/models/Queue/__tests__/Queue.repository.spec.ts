import { MongoError, ObjectID, Db } from 'mongodb'
import { pipe } from 'fp-ts/lib/pipeable'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'

import { dataLayer, logger } from '../../../__tests__/_mock'
import { Task, TaskType } from '../Queue.interface'

import {
  QueueRepository,
  queueCollection as collection,
} from '../Queue.repository'

const defaultTask: Task = {
  _id: new ObjectID(),
  type: TaskType.UPDATECOMICBOOK,
  data: { comicBookUrl: '/url' },
}

// TODO: type of options is lost, dataLayer and logger are any here
const repo = new QueueRepository({ dataLayer, logger })

describe('[QueueRepository.addTaskToQueue]', () => {
  it('should return RTE.left in case of Error', async () => {
    const { _id: _, ...mockTask } = defaultTask
    const { insertOne } = dataLayer
    ;(insertOne as jest.Mock).mockReturnValueOnce(
      RTE.left(new MongoError('Failed to create PullList')),
    )

    const res = repo.addTaskToQueue(mockTask)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(insertOne).toBeCalledWith(collection, mockTask, undefined)
    expect(logger.error).toBeCalledWith('Failed to create PullList')
    expect.assertions(3)
  })

  it('should insert Task using dataLayer and return right with result', async () => {
    const { _id, ...mockTask } = defaultTask
    const mockTaskWithId = { ...mockTask, _id }
    const { insertOne } = dataLayer
    ;(insertOne as jest.Mock).mockReturnValueOnce(RTE.right(mockTaskWithId))

    const res = repo.addTaskToQueue(mockTask)

    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject(mockTaskWithId)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(insertOne).toBeCalledWith(collection, mockTask, undefined)
    expect.assertions(2)
  })
})

describe('[QueueRepository.addTasksToQueue]', () => {
  it('should return RTE.left in case of Error', async () => {
    const { _id: _, ...mockTask } = defaultTask
    const tasks = [mockTask]
    const { insertMany } = dataLayer
    ;(insertMany as jest.Mock).mockReturnValueOnce(
      RTE.left(new MongoError('Failed to create PullList')),
    )

    const res = repo.addTasksToQueue(tasks)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(insertMany).toBeCalledWith(collection, tasks, undefined)
    expect(logger.error).toBeCalledWith('Failed to create PullList')
    expect.assertions(3)
  })

  it('should insert Task using dataLayer and return right with result', async () => {
    const { _id, ...mockTask } = defaultTask
    const mockTaskWithId = { ...mockTask, _id }
    const tasks = [mockTask]
    const { insertMany } = dataLayer
    ;(insertMany as jest.Mock).mockReturnValueOnce(RTE.right([mockTaskWithId]))

    const res = repo.addTasksToQueue(tasks)

    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject([mockTaskWithId])),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(insertMany).toBeCalledWith(collection, tasks, undefined)
    expect.assertions(2)
  })
})
