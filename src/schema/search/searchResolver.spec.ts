import { ObjectID } from 'mongodb'
import {
  createMockConfig,
  createMockReaderWithReturnValue,
  createMockTaskWithReturnValue,
} from 'tests/_utils'
import { PublisherDbObject, SearchDbObject } from 'types/server-schema'
import { GraphQLResolveInfo } from 'graphql'
import { PublisherAPI } from 'datasources'
import { SearchResolver, SearchQuery } from './searchResolver'
import { ScrapeService } from 'services/ScrapeService'

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

const defaultSearch: SearchDbObject = {
  title: 'Comic',
  url: '/path',
  publisher: defaultPublisher._id,
}

describe('[Query.getSearch]', () => {
  const { context } = createMockConfig()
  context.dataSources.publisher = ({
    getByName: jest.fn(),
  } as unknown) as PublisherAPI
  context.services.scrape = ({
    getComicSeriesSearch: jest.fn(),
  } as unknown) as ScrapeService

  it('should call PublisherAPI and return null in case of Error', async () => {
    const { getByName } = context.dataSources.publisher
    ;(getByName as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue({}, true),
    )

    const res = await SearchQuery.getSearch(
      {},
      { q: 'query' },
      context,
      {} as GraphQLResolveInfo,
    )

    expect(getByName).toHaveBeenLastCalledWith('image')
    expect(res).toEqual(null)
  })

  it('should call ScrapeService and return null in case of Error', async () => {
    const mockPublisher = { ...defaultPublisher }
    // const mockSearch = { ...defaultSearch }
    const { getByName } = context.dataSources.publisher
    ;(getByName as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue(mockPublisher),
    )
    const { getComicSeriesSearch } = context.services.scrape
    ;(getComicSeriesSearch as jest.Mock).mockReturnValueOnce(
      createMockTaskWithReturnValue<SearchDbObject[]>([], true),
    )

    const res = await SearchQuery.getSearch(
      {},
      { q: 'query' },
      context,
      {} as GraphQLResolveInfo,
    )

    expect(getByName).toHaveBeenLastCalledWith('image')
    expect(getComicSeriesSearch).toHaveBeenLastCalledWith(
      mockPublisher,
      `q=query`,
    )
    expect(res).toEqual(null)
  })

  it('should call PublisherAPI and ScrapeService and return its result', async () => {
    const mockPublisher = { ...defaultPublisher }
    const mockSearch = { ...defaultSearch }
    const { getByName } = context.dataSources.publisher
    ;(getByName as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue<PublisherDbObject>(mockPublisher),
    )
    const { getComicSeriesSearch } = context.services.scrape
    ;(getComicSeriesSearch as jest.Mock).mockReturnValueOnce(
      createMockTaskWithReturnValue<SearchDbObject[]>([mockSearch]),
    )

    const res = await SearchQuery.getSearch(
      {},
      { q: 'query' },
      context,
      {} as GraphQLResolveInfo,
    )

    expect(getByName).toHaveBeenLastCalledWith('image')
    expect(getComicSeriesSearch).toHaveBeenLastCalledWith(
      mockPublisher,
      `q=query`,
    )
    expect(res).toMatchObject([mockSearch])
  })
})

describe('[Search.publisher]', () => {
  const { context } = createMockConfig()
  context.dataSources.publisher = ({
    getById: jest.fn(),
  } as unknown) as PublisherAPI

  it('should call PublisherAPI and return null in case of Error', async () => {
    const { getById } = context.dataSources.publisher
    ;(getById as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue({}, true),
    )

    const res = await SearchResolver.Search.publisher(
      { ...defaultSearch },
      {},
      context,
      {} as GraphQLResolveInfo,
    )

    expect(getById).toHaveBeenLastCalledWith(defaultSearch.publisher)
    expect(res).toEqual(null)
  })

  it('should call PublisherAPI and return its result', async () => {
    const mockPublisher = { ...defaultPublisher }
    const { getById } = context.dataSources.publisher
    ;(getById as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue<PublisherDbObject>(mockPublisher),
    )

    const res = await SearchResolver.Search.publisher(
      { ...defaultSearch },
      {},
      context,
      {} as GraphQLResolveInfo,
    )

    expect(getById).toHaveBeenLastCalledWith(defaultSearch.publisher)
    expect(res).toMatchObject(mockPublisher)
  })
})
