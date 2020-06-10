import { ObjectID } from 'mongodb'
import {
  createMockConfig,
  createMockReaderWithReturnValue,
  createMockTaskWithReturnValue,
} from 'tests/_utils'
import { ComicSeriesDbObject, PullListDbObject } from 'types/server-schema'
import { GraphQLResolveInfo } from 'graphql'
import { ComicSeriesAPI, PullListAPI } from 'datasources'
import {
  PullListResolver,
  PullListQuery,
  PullListMutation,
} from './pullListResolver'
import { ScrapeService } from 'services/ScrapeService'

const defaultPullList: PullListDbObject = {
  _id: new ObjectID(),
  owner: 'some-user-id',
  list: [],
}

describe('[Query.pullList]', () => {
  const { context } = createMockConfig()
  context.dataSources.pullList = ({
    getByUser: jest.fn(),
  } as unknown) as PullListAPI

  it('should call PullListAPI and return null in case of Error', async () => {
    const mockPullList = { ...defaultPullList }
    const { getByUser } = context.dataSources.pullList
    ;(getByUser as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue({}, true),
    )

    const res = await PullListQuery.pullList(
      {},
      {},
      { ...context, user: mockPullList.owner },
      {} as GraphQLResolveInfo,
    )

    expect(getByUser).toHaveBeenLastCalledWith(mockPullList.owner)
    expect(res).toEqual(null)
  })

  it('should call PullListAPI and return its result', async () => {
    const mockPullList = { ...defaultPullList }
    const { getByUser } = context.dataSources.pullList
    ;(getByUser as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue<PullListDbObject>(mockPullList),
    )

    const res = await PullListQuery.pullList(
      {},
      {},
      { ...context, user: mockPullList.owner },
      {} as GraphQLResolveInfo,
    )

    expect(getByUser).toHaveBeenLastCalledWith(mockPullList.owner)
    expect(res).toMatchObject(mockPullList)
  })
})

const defaultComicSeriesScrapResult = {
  title: 'Title',
  collectionsUrl: '/collections',
  singleIssuesUrl: '/isses',
}

const defaultComicSeries: ComicSeriesDbObject = {
  _id: new ObjectID(),
  title: 'Comic',
  url: '/path',
  collectionsUrl: null,
  collections: [],
  singleIssuesUrl: null,
  singleIssues: [],
  publisher: null,
}

describe('[Mutation.subscribeComicSeries]', () => {
  const { context } = createMockConfig()
  context.dataSources.pullList = ({
    addComicSeries: jest.fn(),
  } as unknown) as PullListAPI
  context.dataSources.comicSeries = ({
    insert: jest.fn().mockReturnValue(
      createMockReaderWithReturnValue({
        ...defaultComicSeries,
        ...defaultComicSeriesScrapResult,
      }),
    ),
  } as unknown) as ComicSeriesAPI
  context.services.scrape = ({
    getComicSeries: jest
      .fn()
      .mockReturnValue(
        createMockTaskWithReturnValue(defaultComicSeriesScrapResult),
      ),
  } as unknown) as ScrapeService

  it('should call PullListAPI and return null in case of Error', async () => {
    const mockPullList = { ...defaultPullList }
    const { addComicSeries } = context.dataSources.pullList
    ;(addComicSeries as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue({}, true),
    )

    const res = await PullListMutation.subscribeComicSeries(
      {},
      { comicSeriesUrl: '/series' },
      { ...context, user: mockPullList.owner },
      {} as GraphQLResolveInfo,
    )

    expect(addComicSeries).toHaveBeenLastCalledWith(
      mockPullList.owner,
      defaultComicSeries._id,
    )
    expect(res).toEqual(null)
  })
  // TODO: test call of service and insert if they use the provided url and create the right object
  it('should call PullListAPI and return its result', async () => {
    const mockPullList = { ...defaultPullList, list: [defaultComicSeries._id] }
    const { addComicSeries } = context.dataSources.pullList
    ;(addComicSeries as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue<PullListDbObject>(mockPullList),
    )

    const res = await PullListMutation.subscribeComicSeries(
      {},
      { comicSeriesUrl: '/series' },
      { ...context, user: mockPullList.owner },
      {} as GraphQLResolveInfo,
    )

    expect(addComicSeries).toHaveBeenLastCalledWith(
      mockPullList.owner,
      defaultComicSeries._id,
    )
    expect(res).toMatchObject(mockPullList)
  })
})

describe('[PullList.list]', () => {
  const { context } = createMockConfig()
  context.dataSources.comicSeries = ({
    getByIds: jest.fn(),
  } as unknown) as ComicSeriesAPI

  it('should call ComicSeriesAPI and return null in case of Error', async () => {
    const mockComicSeries = { ...defaultComicSeries }
    const { getByIds } = context.dataSources.comicSeries
    ;(getByIds as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue({}, true),
    )

    const res = await PullListResolver.PullList.list(
      { ...defaultPullList, list: [mockComicSeries._id] },
      {},
      context,
      {} as GraphQLResolveInfo,
    )

    expect(getByIds).toHaveBeenLastCalledWith([mockComicSeries._id])
    expect(res).toEqual(null)
  })

  it('should call PullListAPI and return its result', async () => {
    const mockComicSeries = { ...defaultComicSeries }
    const { getByIds } = context.dataSources.comicSeries
    ;(getByIds as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue<ComicSeriesDbObject>([mockComicSeries]),
    )

    const res = await PullListResolver.PullList.list(
      { ...defaultPullList, list: [mockComicSeries._id] },
      {},
      context,
      {} as GraphQLResolveInfo,
    )

    expect(getByIds).toHaveBeenLastCalledWith([mockComicSeries._id])
    expect(res).toMatchObject([mockComicSeries])
  })
})
