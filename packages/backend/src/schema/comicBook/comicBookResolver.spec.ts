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
  PublisherDbObject,
  ComicSeriesDbObject,
  ComicBookType,
} from 'types/server-schema'
import { GraphQLResolveInfo } from 'graphql'
import {
  ComicBookAPI,
  PublisherAPI,
  ComicSeriesAPI,
  QueueRepository,
} from 'datasources'
import { TaskType } from 'datasources/QueueRepository'
import { IScraper } from 'services/ScrapeService'

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
  type: ComicBookType.SINGLEISSUE,
  lastModified: new Date(),
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

const defaultComicBookListScrapResult = {
  nextPage: '/next',
  comicBookList: [
    {
      title: 'Title',
      url: '/issue-1',
      issueNo: '1',
    },
    {
      title: 'Title',
      url: '/issue-2',
      issueNo: '2',
    },
  ],
}

const defaultComicBookScrapResult = {
  publisher: { url: '/image', name: 'Image' },
  coverImgUrl: '/image',
  releaseDate: new Date(),
  creators: [{ name: 'John Rambo' }],
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
  lastModified: new Date(),
}

const defaultPublisher: PublisherDbObject = {
  _id: new ObjectID(),
  name: 'Image',
  iconUrl: null,
  url: null,
  cxUrl: null,
  comicSeries: [],
}

describe('[Mutation.scrapComicBook]', () => {
  const { context } = createMockConfig()
  context.dataSources.comicBook = ({
    enhanceWithScrapResult: jest.fn(),
  } as unknown) as ComicBookAPI
  context.dataSources.publisher = ({
    getByUrl: jest
      .fn()
      .mockReturnValue(createMockReaderWithReturnValue(defaultPublisher)),
  } as unknown) as PublisherAPI
  context.services.scrape = ({
    getComicBook: jest
      .fn()
      .mockReturnValue(
        createMockTaskWithReturnValue(defaultComicBookScrapResult),
      ),
  } as unknown) as IScraper

  it('should call ComicBookAPI and return null in case of Error', async () => {
    const mockComicBook = { ...defaultComicBook }
    const { enhanceWithScrapResult } = context.dataSources.comicBook
    ;(enhanceWithScrapResult as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue({}, true),
    )

    const res = await ComicBookMutation.scrapComicBook(
      {},
      { comicBookUrl: mockComicBook.url },
      context,
      {} as GraphQLResolveInfo,
    )

    expect(context.services.scrape.getComicBook).toHaveBeenCalledWith(
      mockComicBook.url,
    )
    expect(enhanceWithScrapResult).toHaveBeenLastCalledWith(mockComicBook.url, {
      ...defaultComicBookScrapResult,
      publisher: defaultPublisher._id,
    })
    expect(res).toEqual(null)
  })

  it('should call ComicBookAPI and return its result', async () => {
    const mockComicBook = { ...defaultComicBook }
    const { enhanceWithScrapResult } = context.dataSources.comicBook
    ;(enhanceWithScrapResult as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue<ComicBookDbObject>(mockComicBook),
    )

    const res = await ComicBookMutation.scrapComicBook(
      {},
      { comicBookUrl: mockComicBook.url },
      context,
      {} as GraphQLResolveInfo,
    )
    expect(context.services.scrape.getComicBook).toHaveBeenCalledWith(
      mockComicBook.url,
    )
    expect(enhanceWithScrapResult).toHaveBeenLastCalledWith(mockComicBook.url, {
      ...defaultComicBookScrapResult,
      publisher: defaultPublisher._id,
    })
    expect(res).toMatchObject(mockComicBook)
  })
})

describe('[Mutation.scrapSingleIssuesList]', () => {
  const { context } = createMockConfig()
  context.dataSources.comicBook = ({
    insertMany: jest.fn(),
    getByUrls: jest.fn().mockReturnValue(
      createMockReaderWithReturnValue<ComicBookDbObject[]>([
        {
          ...defaultComicBook,
          url: defaultComicBookListScrapResult.comicBookList[1].url,
        },
      ]),
    ),
  } as unknown) as ComicBookAPI
  context.dataSources.comicSeries = ({
    addComicBooks: jest.fn(),
  } as unknown) as ComicSeriesAPI
  context.dataSources.queue = ({
    insert: jest.fn().mockReturnValue(createMockReaderWithReturnValue({})),
  } as unknown) as QueueRepository
  context.services.scrape = ({
    getComicBookList: jest
      .fn()
      .mockReturnValue(
        createMockTaskWithReturnValue(defaultComicBookListScrapResult),
      ),
  } as unknown) as IScraper

  it('should call ComicBookAPI and return null in case of Error', async () => {
    const { insertMany } = context.dataSources.comicBook
    ;(insertMany as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue({}, true),
    )

    const res = await ComicBookMutation.scrapSingleIssuesList(
      {},
      { comicSeriesId: defaultComicSeries._id, comicBookListUrl: '/issues' },
      context,
      {} as GraphQLResolveInfo,
    )

    expect(insertMany).toHaveBeenLastCalledWith([
      {
        ...defaultComicBookListScrapResult.comicBookList[0],
        comicSeries: defaultComicSeries._id,
        creators: [],
        publisher: null,
        coverImgUrl: null,
        releaseDate: null,
        type: ComicBookType.SINGLEISSUE,
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
    const { addComicBooks } = context.dataSources.comicSeries
    ;(addComicBooks as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue({}),
    )

    const res = await ComicBookMutation.scrapSingleIssuesList(
      {},
      { comicSeriesId: defaultComicSeries._id, comicBookListUrl: '/issues' },
      context,
      {} as GraphQLResolveInfo,
    )

    expect(insertMany).toHaveBeenLastCalledWith([
      {
        ...defaultComicBookListScrapResult.comicBookList[0],
        comicSeries: defaultComicSeries._id,
        creators: [],
        publisher: null,
        coverImgUrl: null,
        releaseDate: null,
        type: ComicBookType.SINGLEISSUE,
      },
    ])
    expect(addComicBooks).toHaveBeenLastCalledWith(defaultComicSeries._id, [
      mockComicBook._id,
    ])
    expect(res).toMatchObject([mockComicBook])
  })

  it('should call QueueRepository and return its result', async () => {
    const mockComicBook = { ...defaultComicBook }
    const { insertMany, getByUrls } = context.dataSources.comicBook
    ;(insertMany as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue<ComicBookDbObject[]>([
        mockComicBook,
        mockComicBook,
      ]),
    )
    ;(getByUrls as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue<ComicBookDbObject[]>([]),
    )
    const { addComicBooks } = context.dataSources.comicSeries
    ;(addComicBooks as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue({}),
    )

    const res = await ComicBookMutation.scrapSingleIssuesList(
      {},
      { comicSeriesId: defaultComicSeries._id, comicBookListUrl: '/issues' },
      context,
      {} as GraphQLResolveInfo,
    )

    expect(context.dataSources.queue.insert).toHaveBeenCalledWith({
      type: TaskType.SCRAPSINGLEISSUELIST,
      data: {
        url: defaultComicBookListScrapResult.nextPage,
        comicSeriesId: defaultComicSeries._id,
      },
    })
    expect(res).toMatchObject([mockComicBook, mockComicBook])
  })
})

describe('[Mutation.scrapCollectionsList]', () => {
  const { context } = createMockConfig()
  context.dataSources.comicBook = ({
    insertMany: jest.fn(),
    getByUrls: jest.fn().mockReturnValue(
      createMockReaderWithReturnValue<ComicBookDbObject[]>([
        {
          ...defaultComicBook,
          url: defaultComicBookListScrapResult.comicBookList[1].url,
        },
      ]),
    ),
  } as unknown) as ComicBookAPI
  context.dataSources.comicSeries = ({
    addComicBookCollections: jest.fn(),
  } as unknown) as ComicSeriesAPI
  context.dataSources.queue = ({
    insert: jest.fn().mockReturnValue(createMockReaderWithReturnValue({})),
  } as unknown) as QueueRepository
  context.services.scrape = ({
    getComicBookList: jest
      .fn()
      .mockReturnValue(
        createMockTaskWithReturnValue(defaultComicBookListScrapResult),
      ),
  } as unknown) as IScraper

  it('should call ComicBookAPI and return null in case of Error', async () => {
    const { insertMany } = context.dataSources.comicBook
    ;(insertMany as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue({}, true),
    )

    const res = await ComicBookMutation.scrapCollectionsList(
      {},
      { comicSeriesId: defaultComicSeries._id, comicBookListUrl: '/issues' },
      context,
      {} as GraphQLResolveInfo,
    )

    expect(insertMany).toHaveBeenLastCalledWith([
      {
        ...defaultComicBookListScrapResult.comicBookList[0],
        comicSeries: defaultComicSeries._id,
        creators: [],
        publisher: null,
        coverImgUrl: null,
        releaseDate: null,
        type: ComicBookType.COLLECTION,
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
    const { addComicBookCollections } = context.dataSources.comicSeries
    ;(addComicBookCollections as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue({}),
    )

    const res = await ComicBookMutation.scrapCollectionsList(
      {},
      { comicSeriesId: defaultComicSeries._id, comicBookListUrl: '/issues' },
      context,
      {} as GraphQLResolveInfo,
    )

    expect(insertMany).toHaveBeenLastCalledWith([
      {
        ...defaultComicBookListScrapResult.comicBookList[0],
        comicSeries: defaultComicSeries._id,
        creators: [],
        publisher: null,
        coverImgUrl: null,
        releaseDate: null,
        type: ComicBookType.COLLECTION,
      },
    ])
    expect(
      addComicBookCollections,
    ).toHaveBeenLastCalledWith(defaultComicSeries._id, [mockComicBook._id])
    expect(res).toMatchObject([mockComicBook])
  })

  it('should call QueueRepository and return its result', async () => {
    const mockComicBook = { ...defaultComicBook }
    const { insertMany, getByUrls } = context.dataSources.comicBook
    ;(insertMany as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue<ComicBookDbObject[]>([
        mockComicBook,
        mockComicBook,
      ]),
    )
    ;(getByUrls as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue<ComicBookDbObject[]>([]),
    )
    const { addComicBookCollections } = context.dataSources.comicSeries
    ;(addComicBookCollections as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue({}),
    )

    const res = await ComicBookMutation.scrapCollectionsList(
      {},
      { comicSeriesId: defaultComicSeries._id, comicBookListUrl: '/issues' },
      context,
      {} as GraphQLResolveInfo,
    )

    expect(context.dataSources.queue.insert).toHaveBeenCalledWith({
      type: TaskType.SCRAPCOLLECTIONLIST,
      data: {
        url: defaultComicBookListScrapResult.nextPage,
        comicSeriesId: defaultComicSeries._id,
      },
    })
    expect(res).toMatchObject([mockComicBook, mockComicBook])
  })
})

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
