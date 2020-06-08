import { ObjectID } from 'mongodb'
import { createMockConfig, createMockReaderWithReturnValue } from 'tests/_utils'
import { ComicSeriesDbObject, PullListDbObject } from 'types/server-schema'
import { GraphQLResolveInfo } from 'graphql'
import { ComicSeriesAPI, PullListAPI } from 'datasources'
import { PullListResolver, PullListQuery } from './pullListResolver'

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
