import { ObjectID } from 'mongodb'
import { createMockConfig, createMockReaderWithReturnValue } from 'tests/_utils'
import { ComicBookQuery, ComicBookResolver } from './comicBookResolver'
import {
  ComicBookDbObject,
  CreatorDbObject,
  PublisherDbObject,
  ComicSeriesDbObject,
} from 'types/server-schema'
import { GraphQLResolveInfo } from 'graphql'
import {
  CreatorAPI,
  ComicBookAPI,
  PublisherAPI,
  ComicSeriesAPI,
} from 'datasources'

const defaultComicBook: ComicBookDbObject = {
  _id: new ObjectID(),
  title: 'Comic',
  url: '/path',
  issue: null,
  creators: null,
  coverUrl: null,
  publisher: null,
  releaseDate: null,
  series: null,
}

describe('[Query.getComicBook]', () => {
  const { context } = createMockConfig()
  context.dataSources.comicBook = ({
    getById: jest.fn(),
  } as unknown) as ComicBookAPI

  it('should call ComicBookAPI and return null in case of Error', async () => {
    const mockComicBook = { ...defaultComicBook }
    const { getById } = context.dataSources.comicBook
    ;(getById as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue({}, true),
    )

    const res = await ComicBookQuery.getComicBook(
      {},
      { id: mockComicBook._id },
      context,
      {} as GraphQLResolveInfo,
    )

    expect(getById).toHaveBeenLastCalledWith(mockComicBook._id)
    expect(res).toEqual(null)
  })

  it('should call ComicBookAPI and return its result', async () => {
    const mockComicBook = { ...defaultComicBook }
    const { getById } = context.dataSources.comicBook
    ;(getById as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue<ComicBookDbObject>(mockComicBook),
    )

    const res = await ComicBookQuery.getComicBook(
      {},
      { id: mockComicBook._id },
      context,
      {} as GraphQLResolveInfo,
    )

    expect(getById).toHaveBeenLastCalledWith(mockComicBook._id)
    expect(res).toMatchObject(mockComicBook)
  })
})

const defaultCreator: CreatorDbObject = {
  _id: new ObjectID(),
  firstname: 'John',
  lastname: 'Rambo',
  series: null,
}

describe('[ComicBook.creators]', () => {
  const { context } = createMockConfig()
  context.dataSources.creator = ({
    getByIds: jest.fn(),
  } as unknown) as CreatorAPI

  it('should call CreatorAPI and return null in case of Error', async () => {
    const mockCreator = { ...defaultCreator }
    const { getByIds } = context.dataSources.creator
    ;(getByIds as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue({}, true),
    )

    const res = await ComicBookResolver.ComicBook.creators(
      { ...defaultComicBook, creators: [mockCreator._id] },
      {},
      context,
      {} as GraphQLResolveInfo,
    )

    expect(getByIds).toHaveBeenLastCalledWith([mockCreator._id])
    expect(res).toEqual(null)
  })

  it('should call CreatorAPI and return its result', async () => {
    const mockCreator = { ...defaultCreator }
    const { getByIds } = context.dataSources.creator
    ;(getByIds as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue<CreatorDbObject>([mockCreator]),
    )

    const res = await ComicBookResolver.ComicBook.creators(
      { ...defaultComicBook, creators: [mockCreator._id] },
      {},
      context,
      {} as GraphQLResolveInfo,
    )

    expect(getByIds).toHaveBeenLastCalledWith([mockCreator._id])
    expect(res).toMatchObject([mockCreator])
  })
})

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

describe('[ComicBook.publisher]', () => {
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

    const res = await ComicBookResolver.ComicBook.publisher(
      { ...defaultComicBook, publisher: mockPublisher._id },
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

    const res = await ComicBookResolver.ComicBook.publisher(
      { ...defaultComicBook, publisher: mockPublisher._id },
      {},
      context,
      {} as GraphQLResolveInfo,
    )

    expect(getById).toHaveBeenLastCalledWith(mockPublisher._id)
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

describe('[ComicBook.series]', () => {
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

    const res = await ComicBookResolver.ComicBook.series(
      { ...defaultComicBook, series: mockComicSeries._id },
      {},
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

    const res = await ComicBookResolver.ComicBook.series(
      { ...defaultComicBook, series: mockComicSeries._id },
      {},
      context,
      {} as GraphQLResolveInfo,
    )

    expect(getById).toHaveBeenLastCalledWith(mockComicSeries._id)
    expect(res).toMatchObject(mockComicSeries)
  })
})
