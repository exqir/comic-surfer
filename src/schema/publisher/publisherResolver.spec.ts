import { ObjectID } from 'mongodb'
import { createMockConfig, createMockReaderWithReturnValue } from 'tests/_utils'
import { ComicSeriesDbObject, PublisherDbObject } from 'types/server-schema'
import { GraphQLResolveInfo } from 'graphql'
import { PublisherAPI, ComicSeriesAPI } from 'datasources'
import { PublisherResolver, PublisherQuery } from './publisherResolver'

const defaultPublisher: PublisherDbObject = {
  _id: new ObjectID(),
  name: 'Image',
  iconUrl: null,
  url: null,
  basePath: null,
  searchPath: null,
  searchPathSeries: null,
  series: null,
  seriesPath: null,
}

describe('[Query.getPublishers]', () => {
  const { context } = createMockConfig()
  context.dataSources.publisher = ({
    getByNames: jest.fn(),
  } as unknown) as PublisherAPI

  it('should call PublisherAPI and return null in case of Error', async () => {
    const mockPublisher = { ...defaultPublisher }
    const { getByNames } = context.dataSources.publisher
    ;(getByNames as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue({}, true),
    )

    const res = await PublisherQuery.getPublishers(
      {},
      { names: [mockPublisher.name] },
      context,
      {} as GraphQLResolveInfo,
    )

    expect(getByNames).toHaveBeenLastCalledWith([mockPublisher.name])
    expect(res).toEqual(null)
  })

  it('should call PublisherAPI and return its result', async () => {
    const mockPublisher = { ...defaultPublisher }
    const { getByNames } = context.dataSources.publisher
    ;(getByNames as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue<PublisherDbObject>([mockPublisher]),
    )

    const res = await PublisherQuery.getPublishers(
      {},
      { names: [mockPublisher.name] },
      context,
      {} as GraphQLResolveInfo,
    )

    expect(getByNames).toHaveBeenLastCalledWith([mockPublisher.name])
    expect(res).toMatchObject([mockPublisher])
  })
})

describe('[Query.getPublisher]', () => {
  const { context } = createMockConfig()
  context.dataSources.publisher = ({
    getByName: jest.fn(),
  } as unknown) as PublisherAPI

  it('should call PublisherAPI and return null in case of Error', async () => {
    const mockPublisher = { ...defaultPublisher }
    const { getByName } = context.dataSources.publisher
    ;(getByName as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue({}, true),
    )

    const res = await PublisherQuery.getPublisher(
      {},
      { name: mockPublisher.name },
      context,
      {} as GraphQLResolveInfo,
    )

    expect(getByName).toHaveBeenLastCalledWith(mockPublisher.name)
    expect(res).toEqual(null)
  })

  it('should call PublisherAPI and return its result', async () => {
    const mockPublisher = { ...defaultPublisher }
    const { getByName } = context.dataSources.publisher
    ;(getByName as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue<PublisherDbObject>(mockPublisher),
    )

    const res = await PublisherQuery.getPublisher(
      {},
      { name: mockPublisher.name },
      context,
      {} as GraphQLResolveInfo,
    )

    expect(getByName).toHaveBeenLastCalledWith(mockPublisher.name)
    expect(res).toMatchObject(mockPublisher)
  })
})

const defaultComicSeries: ComicSeriesDbObject = {
  _id: new ObjectID(),
  title: 'Comic',
  url: '/path',
  collectionsUrl: null,
  collections: null,
  issuesUrl: null,
  issues: null,
  publisher: null,
}

describe('[Publisher.series]', () => {
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

    const res = await PublisherResolver.Publisher.series(
      { ...defaultPublisher, series: [mockComicSeries._id] },
      {},
      context,
      {} as GraphQLResolveInfo,
    )

    expect(getByIds).toHaveBeenLastCalledWith([mockComicSeries._id])
    expect(res).toEqual(null)
  })

  it('should call ComicSeriesAPI and return its result', async () => {
    const mockComicSeries = { ...defaultComicSeries }
    const { getByIds } = context.dataSources.comicSeries
    ;(getByIds as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue<ComicSeriesDbObject>([mockComicSeries]),
    )

    const res = await PublisherResolver.Publisher.series(
      { ...defaultPublisher, series: [mockComicSeries._id] },
      {},
      context,
      {} as GraphQLResolveInfo,
    )

    expect(getByIds).toHaveBeenLastCalledWith([mockComicSeries._id])
    expect(res).toMatchObject([mockComicSeries])
  })
})