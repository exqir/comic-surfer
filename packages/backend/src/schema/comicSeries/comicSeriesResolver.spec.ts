import { ObjectID } from 'mongodb'
import { createMockConfig, createMockReaderWithReturnValue } from 'tests/_utils'
import { ComicSeriesQuery, ComicSeriesResolver } from './comicSeriesResolver'
import {
  ComicSeriesDbObject,
  ComicBookDbObject,
  PublisherDbObject,
} from 'types/server-schema'
import { ComicSeriesAPI } from 'datasources/ComicSeriesAPI'
import { GraphQLResolveInfo } from 'graphql'
import { ComicBookAPI, PublisherAPI } from 'datasources'

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

describe('[Query.comicSeries]', () => {
  const { context } = createMockConfig()
  context.dataSources.comicSeries = ({
    getById: jest.fn(),
  } as unknown) as ComicSeriesAPI

  it('should call ComicSeriesAPI and return null in case of Error', async () => {
    const mockComicSeries = { ...defaultComicSeries }
    const { getById } = context.dataSources.comicSeries
    ;(getById as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue({}, true),
    )

    const res = await ComicSeriesQuery.comicSeries(
      {},
      { id: mockComicSeries._id },
      context,
      {} as GraphQLResolveInfo,
    )

    expect(getById).toHaveBeenLastCalledWith(mockComicSeries._id)
    expect(res).toEqual(null)
  })

  it('should call ComicSeriesAPI and return its result', async () => {
    const mockComicSeries = { ...defaultComicSeries }
    const { getById } = context.dataSources.comicSeries
    ;(getById as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue<ComicSeriesDbObject>(mockComicSeries),
    )

    const res = await ComicSeriesQuery.comicSeries(
      {},
      { id: mockComicSeries._id },
      context,
      {} as GraphQLResolveInfo,
    )

    expect(getById).toHaveBeenLastCalledWith(mockComicSeries._id)
    expect(res).toMatchObject(mockComicSeries)
  })
})

const defaultComicBook: ComicBookDbObject = {
  _id: new ObjectID(),
  title: 'Comic',
  url: '/path',
  issueNo: null,
  creators: [],
  coverImgUrl: null,
  publisher: null,
  releaseDate: null,
  comicSeries: null,
}

describe('[ComicSeries.singleIssues]', () => {
  const { context } = createMockConfig()
  context.dataSources.comicBook = ({
    getByIds: jest.fn(),
  } as unknown) as ComicBookAPI

  it('should call ComicBookAPI and return null in case of Error', async () => {
    const mockComicBook = { ...defaultComicBook }
    const { getByIds } = context.dataSources.comicBook
    ;(getByIds as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue({}, true),
    )

    const res = await ComicSeriesResolver.ComicSeries.singleIssues(
      { ...defaultComicSeries, singleIssues: [mockComicBook._id] },
      {},
      context,
      {} as GraphQLResolveInfo,
    )

    expect(getByIds).toHaveBeenLastCalledWith([mockComicBook._id])
    expect(res).toEqual(null)
  })

  it('should call ComicBookAPI and return its result', async () => {
    const mockComicBook = { ...defaultComicBook }
    const { getByIds } = context.dataSources.comicBook
    ;(getByIds as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue<ComicBookDbObject>([mockComicBook]),
    )

    const res = await ComicSeriesResolver.ComicSeries.singleIssues(
      { ...defaultComicSeries, singleIssues: [mockComicBook._id] },
      {},
      context,
      {} as GraphQLResolveInfo,
    )

    expect(getByIds).toHaveBeenLastCalledWith([mockComicBook._id])
    expect(res).toMatchObject([mockComicBook])
  })
})

const defaultPublisher: PublisherDbObject = {
  _id: new ObjectID(),
  name: 'Image',
  iconUrl: null,
  url: null,
  cxUrl: null,
  comicSeries: [],
}

describe('[ComicSeries.publisher]', () => {
  const { context } = createMockConfig()
  context.dataSources.publisher = ({
    getById: jest.fn(),
  } as unknown) as PublisherAPI

  it('should call PublisherAPI and return null in case of Error', async () => {
    const mockPublisher = { ...defaultPublisher }
    const { getById } = context.dataSources.publisher
    ;(getById as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue({}, true),
    )

    const res = await ComicSeriesResolver.ComicSeries.publisher(
      { ...defaultComicSeries, publisher: mockPublisher._id },
      {},
      context,
      {} as GraphQLResolveInfo,
    )

    expect(getById).toHaveBeenLastCalledWith(mockPublisher._id)
    expect(res).toEqual(null)
  })

  it('should call PublisherAPI and return its result', async () => {
    const mockPublisher = { ...defaultPublisher }
    const { getById } = context.dataSources.publisher
    ;(getById as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue<PublisherDbObject>(mockPublisher),
    )

    const res = await ComicSeriesResolver.ComicSeries.publisher(
      { ...defaultComicSeries, publisher: mockPublisher._id },
      {},
      context,
      {} as GraphQLResolveInfo,
    )

    expect(getById).toHaveBeenLastCalledWith(mockPublisher._id)
    expect(res).toMatchObject(mockPublisher)
  })
})

describe('[ComicSeries.collections]', () => {
  const { context } = createMockConfig()
  context.dataSources.comicBook = ({
    getByIds: jest.fn(),
  } as unknown) as ComicBookAPI

  it('should call ComicBookAPI and return null in case of Error', async () => {
    const mockComicBook = { ...defaultComicBook }
    const { getByIds } = context.dataSources.comicBook
    ;(getByIds as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue({}, true),
    )

    const res = await ComicSeriesResolver.ComicSeries.collections(
      { ...defaultComicSeries, collections: [mockComicBook._id] },
      {},
      context,
      {} as GraphQLResolveInfo,
    )

    expect(getByIds).toHaveBeenLastCalledWith([mockComicBook._id])
    expect(res).toEqual(null)
  })

  it('should call ComicBookAPI and return its result', async () => {
    const mockComicBook = { ...defaultComicBook }
    const { getByIds } = context.dataSources.comicBook
    ;(getByIds as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue<ComicBookDbObject>([mockComicBook]),
    )

    const res = await ComicSeriesResolver.ComicSeries.collections(
      { ...defaultComicSeries, collections: [mockComicBook._id] },
      {},
      context,
      {} as GraphQLResolveInfo,
    )

    expect(getByIds).toHaveBeenLastCalledWith([mockComicBook._id])
    expect(res).toMatchObject([mockComicBook])
  })
})
