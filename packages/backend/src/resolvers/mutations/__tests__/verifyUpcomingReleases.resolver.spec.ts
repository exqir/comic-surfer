import type { GraphQLResolveInfo } from 'graphql'
import { Db, MongoError } from 'mongodb'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as O from 'fp-ts/lib/Option'

import type { GraphQLContext } from 'types/app'
import type { IComicBookRepository } from 'models/ComicBook/ComicBook.interface'
import type { IQueueRepository } from 'models/Queue/Queue.interface'
import { defaultComicBook } from '__mocks__/ComicBook.mock'
import { defaultUpdateComicBookReleaseTask } from '__mocks__/Queue.mock'

import { verifyUpcomingReleases } from '../verifyUpcomingReleases.resolver'

describe('[Mutation.verifyUpcomingReleases]', () => {
  it('should return null in case of an Error while getting ComicSeries', async () => {
    getComicBookBetweenAndLastUpdatedBefore.mockReturnValueOnce(
      RTE.left(new Error()),
    )

    const res = await verifyUpcomingReleases(parent, args, context, info)

    expect(res).toBeNull()
  })

  it('should return null in case of an Error while enqueue Tasks', async () => {
    addTasksToQueue.mockReturnValueOnce(RTE.left(new Error()))

    const res = await verifyUpcomingReleases(parent, args, context, info)

    expect(res).toBeNull()
  })

  it('should request ComicBooks with releases in the next month and not updated for two weeks', async () => {
    const now = new Date(2020, 1, 15)
    const inOneMonth = new Date(2020, 2, 15)
    const twoWeeksAgo = new Date(2020, 1, 1)
    jest.spyOn(global.Date, 'now').mockImplementation(() => now.valueOf())

    await verifyUpcomingReleases(parent, args, context, info)

    expect(getComicBookBetweenAndLastUpdatedBefore).toHaveBeenCalledWith(
      now,
      inOneMonth,
      twoWeeksAgo,
    )
  })

  it('should return ComicBooks to be verified', async () => {
    const res = await verifyUpcomingReleases(parent, args, context, info)

    expect(res).toMatchObject([defaultComicBook])
  })
})

const getComicBookBetweenAndLastUpdatedBefore = jest
  .fn()
  .mockReturnValue(RTE.right([defaultComicBook]))
const comicBookRepository: IComicBookRepository<Db, Error | MongoError> = ({
  getByReleaseBetweenAndLastUpdatedBefore: getComicBookBetweenAndLastUpdatedBefore,
} as unknown) as IComicBookRepository<Db, Error | MongoError>

const addTasksToQueue = jest
  .fn()
  .mockReturnValue(RTE.right([defaultUpdateComicBookReleaseTask]))
const queueRepository: IQueueRepository<Db, Error | MongoError> = ({
  addTasksToQueue: addTasksToQueue,
} as unknown) as IQueueRepository<Db, Error | MongoError>

const context = {
  dataSources: {
    comicBook: comicBookRepository,
    queue: queueRepository,
  },
  db: O.some({}),
} as GraphQLContext

const info = {} as GraphQLResolveInfo
const parent = {}
const args = {}
