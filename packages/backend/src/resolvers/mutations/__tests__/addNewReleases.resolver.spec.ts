import type { GraphQLResolveInfo } from 'graphql'
import { Db, MongoError } from 'mongodb'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as O from 'fp-ts/lib/Option'

import type { GraphQLContext } from 'types/app'
import type { IComicSeriesRepository } from 'models/ComicSeries/ComicSeries.interface'
import type { IQueueRepository } from 'models/Queue/Queue.interface'
import { defaultComicSeries } from '__mocks__/ComicSeries.mock'
import {
  defaultScrapCollectionsTask,
  defaultScrapSingleIssuesTask,
} from '__mocks__/Queue.mock'

import { addNewReleases } from '../addNewReleases.resolver'

describe('[Mutation.addNewReleases]', () => {
  it('should return null in case of an Error while getting ComicSeries', async () => {
    getComicSeriesLastUpdatedBefore.mockReturnValueOnce(RTE.left(new Error()))

    const res = await addNewReleases(parent, args, context, info)

    expect(res).toBeNull()
  })

  it('should return null in case of an Error while enqueue Tasks', async () => {
    addTasksToQueue.mockReturnValueOnce(RTE.left(new Error()))

    const res = await addNewReleases(parent, args, context, info)

    expect(res).toBeNull()
  })

  it('should request ComicSeries not updated for a month', async () => {
    const mockNewDate = new Date(2020, 1, 1)
    const aMonthAgo = new Date(2020, 0, 1)
    jest
      .spyOn(global.Date, 'now')
      .mockImplementationOnce(() => mockNewDate.valueOf())

    await addNewReleases(parent, args, context, info)

    expect(getComicSeriesLastUpdatedBefore).toHaveBeenCalledWith(aMonthAgo)
  })

  it('should return ComicSeries for which to look for new releases', async () => {
    const res = await addNewReleases(parent, args, context, info)

    expect(res).toMatchObject([defaultComicSeries])
  })
})

const getComicSeriesLastUpdatedBefore = jest
  .fn()
  .mockReturnValue(RTE.right([defaultComicSeries]))
const comicSeriesRepository: IComicSeriesRepository<Db, Error | MongoError> = ({
  getLastUpdatedBefore: getComicSeriesLastUpdatedBefore,
} as unknown) as IComicSeriesRepository<Db, Error | MongoError>

const addTasksToQueue = jest
  .fn()
  .mockReturnValue(
    RTE.right([defaultScrapSingleIssuesTask, defaultScrapCollectionsTask]),
  )
const queueRepository: IQueueRepository<Db, Error | MongoError> = ({
  addTasksToQueue: addTasksToQueue,
} as unknown) as IQueueRepository<Db, Error | MongoError>

const context = {
  dataSources: {
    comicSeries: comicSeriesRepository,
    queue: queueRepository,
  },
  db: O.some({}),
} as GraphQLContext

const info = {} as GraphQLResolveInfo
const parent = {}
const args = {}
