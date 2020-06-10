import { ObjectID } from 'mongodb'
import {
  createMockConfig,
  createMockReaderWithReturnValue,
  createMockTaskWithReturnValue,
} from 'tests/_utils'
import {
  ComicBookQuery,
  ComicBookResolver,
  ComicBookMutation,
} from './comicBookResolver'
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
import { ScrapeService } from 'services/ScrapeService'

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

describe('[Query.comicBook]', () => {
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

    const res = await ComicBookQuery.comicBook(
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

    const res = await ComicBookQuery.comicBook(
      {},
      { id: mockComicBook._id },
      context,
      {} as GraphQLResolveInfo,
    )

    expect(getById).toHaveBeenLastCalledWith(mockComicBook._id)
    expect(res).toMatchObject(mockComicBook)
  })
})

const defaultComicBookListScrapResult = [
  {
    title: 'Title',
    url: '/issue',
    issueNo: '1',
  },
]

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

describe('[Mutation.scrapComicBookList]', () => {
  const { context } = createMockConfig()
  context.dataSources.comicBook = ({
    insertMany: jest.fn(),
  } as unknown) as ComicBookAPI
  context.services.scrape = ({
    getComicBookList: jest
      .fn()
      .mockReturnValue(
        createMockTaskWithReturnValue(defaultComicBookListScrapResult),
      ),
  } as unknown) as ScrapeService

  it('should call ComicBookAPI and return null in case of Error', async () => {
    const { insertMany } = context.dataSources.comicBook
    ;(insertMany as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue({}, true),
    )

    const res = await ComicBookMutation.scrapComicBookList(
      {},
      { comicSeriesId: defaultComicSeries._id, comicBookListUrl: '/issues' },
      context,
      {} as GraphQLResolveInfo,
    )

    expect(insertMany).toHaveBeenLastCalledWith([
      {
        ...defaultComicBookListScrapResult[0],
        comicSeries: defaultComicSeries._id,
        creators: [],
        publisher: null,
        coverImgUrl: null,
        releaseDate: null,
      },
    ])
    expect(res).toEqual(null)
  })

  it('should call ComicBookAPI and return its result', async () => {
    const mockComicBook = { ...defaultComicBook }
    const { insertMany } = context.dataSources.comicBook
    ;(insertMany as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue<ComicBookDbObject[]>([mockComicBook]),
    )

    const res = await ComicBookMutation.scrapComicBookList(
      {},
      { comicSeriesId: defaultComicSeries._id, comicBookListUrl: '/issues' },
      context,
      {} as GraphQLResolveInfo,
    )

    expect(insertMany).toHaveBeenLastCalledWith([
      {
        ...defaultComicBookListScrapResult[0],
        comicSeries: defaultComicSeries._id,
        creators: [],
        publisher: null,
        coverImgUrl: null,
        releaseDate: null,
      },
    ])
    expect(res).toMatchObject([mockComicBook])
  })
})

const defaultCreator: CreatorDbObject = {
  _id: new ObjectID(),
  firstname: 'John',
  lastname: 'Rambo',
  comicSeries: [],
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
  cxUrl: null,
  comicSeries: [],
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

describe('[ComicBook.comicSeries]', () => {
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

    const res = await ComicBookResolver.ComicBook.comicSeries(
      { ...defaultComicBook, comicSeries: mockComicSeries._id },
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

    const res = await ComicBookResolver.ComicBook.comicSeries(
      { ...defaultComicBook, comicSeries: mockComicSeries._id },
      {},
      context,
      {} as GraphQLResolveInfo,
    )

    expect(getById).toHaveBeenLastCalledWith(mockComicSeries._id)
    expect(res).toMatchObject(mockComicSeries)
  })
})
