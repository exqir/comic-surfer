import type { GraphQLResolveInfo } from 'graphql'
import { Db, MongoError } from 'mongodb'
import { AuthenticationError } from 'apollo-server'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as TE from 'fp-ts/lib/TaskEither'
import * as O from 'fp-ts/lib/Option'

import type { GraphQLContext } from 'types/app'
import type { IComicSeriesRepository } from 'models/ComicSeries/ComicSeries.interface'
import type { IPullListRepository } from 'models/PullList/PullList.interface'
import type { IQueueRepository } from 'models/Queue/Queue.interface'
import type { IScraper } from 'services/ScrapeService'
import { defaultComicSeries } from '__mocks__/ComicSeries.mock'
import { defaultPullList } from '__mocks__/PullList.mock'
import {
  defaultScrapCollectionsTask,
  defaultScrapSingleIssuesTask,
  defaultUpdatePublisherTask,
} from '__mocks__/Queue.mock'
import { defaultComicSeriesData } from '__mocks__/ComicSeriesData.mock'

import { addToPullList } from '../addToPullList.resolver'

describe('[Mutation.addToPullList]', () => {
  it('should throw an AuthenticationError when no valid user is in context', async () => {
    const execute = () =>
      addToPullList(parent, args, { ...context, user: O.none }, info)

    await expect(execute).rejects.toThrowError(AuthenticationError)
  })

  it('should return null in case of an Error during scraping', async () => {
    getComicSeries.mockReturnValueOnce(TE.left(new Error()))

    const res = await addToPullList(parent, args, context, info)

    expect(res).toBeNull()
  })

  it('should return null in case of an Error while getting ComicSeries', async () => {
    getOrCreateComicSeries.mockReturnValueOnce(RTE.left(new Error()))

    const res = await addToPullList(parent, args, context, info)

    expect(res).toBeNull()
  })

  it('should return null in case of an Error while enqueue Tasks', async () => {
    addTasksToQueue.mockReturnValueOnce(RTE.left(new Error()))

    const res = await addToPullList(parent, args, context, info)

    expect(res).toBeNull()
  })

  it('should return null in case of an Error while adding ComicSeries', async () => {
    addComicSeriesToPullList.mockReturnValueOnce(RTE.left(new Error()))

    const res = await addToPullList(parent, args, context, info)

    expect(res).toBeNull()
  })

  it('should return updated PullList', async () => {
    const res = await addToPullList(parent, args, context, info)

    expect(res).toMatchObject(defaultPullList)
  })
})

const getComicSeries = jest
  .fn()
  .mockReturnValue(TE.right(defaultComicSeriesData))
const scrape: IScraper = ({
  getComicSeries,
} as unknown) as IScraper

const getOrCreateComicSeries = jest
  .fn()
  .mockReturnValue(RTE.right(defaultComicSeries))
const comicSeriesRepository: IComicSeriesRepository<Db, Error | MongoError> = ({
  getOrCreate: getOrCreateComicSeries,
} as unknown) as IComicSeriesRepository<Db, Error | MongoError>

const addComicSeriesToPullList = jest
  .fn()
  .mockReturnValue(RTE.right(defaultPullList))
const pullListRepository: IPullListRepository<Db, Error | MongoError> = ({
  addComicSeriesToPullList,
} as unknown) as IPullListRepository<Db, Error | MongoError>

const addTasksToQueue = jest
  .fn()
  .mockReturnValue(
    RTE.right([
      defaultUpdatePublisherTask,
      defaultScrapSingleIssuesTask,
      defaultScrapCollectionsTask,
    ]),
  )
const queueRepository: IQueueRepository<Db, Error | MongoError> = ({
  addTasksToQueue: addTasksToQueue,
} as unknown) as IQueueRepository<Db, Error | MongoError>

const context = {
  dataSources: {
    comicSeries: comicSeriesRepository,
    pullList: pullListRepository,
    queue: queueRepository,
  },
  services: { scrape },
  db: O.some({}),
  user: O.some('user'),
} as GraphQLContext

const info = {} as GraphQLResolveInfo
const parent = {}
const args = { comicSeriesUrl: defaultComicSeries.url }
