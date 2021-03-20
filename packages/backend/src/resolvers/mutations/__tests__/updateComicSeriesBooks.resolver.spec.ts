import type { GraphQLResolveInfo } from 'graphql'
import { Db, MongoError, ObjectID } from 'mongodb'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as TE from 'fp-ts/lib/TaskEither'
import * as O from 'fp-ts/lib/Option'

import type { GraphQLContext } from 'types/app'
import type { IComicSeriesRepository } from 'models/ComicSeries/ComicSeries.interface'
import type { IComicBookRepository } from 'models/ComicBook/ComicBook.interface'
import type { IQueueRepository } from 'models/Queue/Queue.interface'
import type { IScraperService } from 'services/Scraper/Scraper.interface'
import { ComicBookType } from 'types/graphql-schema'
import { TaskType } from 'models/Queue/Queue.interface'
import { defaultComicSeries } from '__mocks__/ComicSeries.mock'
import { defaultComicBook } from '__mocks__/ComicBook.mock'
import { defaultComicBookListData } from '__mocks__/ComicBookListData.mock'
import { defaultScrapSingleIssuesTask } from '__mocks__/Queue.mock'

import { updateComicSeriesBooks } from '../updateComicSeriesBooks.resolver'

describe('[Mutation.updateComicSeriesBooks]', () => {
  it('should return null in case of an Error while getting ComicSeries', async () => {
    getComicSeriesById.mockReturnValueOnce(RTE.left(new Error()))

    const res = await updateComicSeriesBooks(parent, args, context, info)

    expect(res).toBeNull()
  })

  it('should return null in case of an Error during scraping ComicBook List', async () => {
    getComicBookList.mockReturnValueOnce(TE.left(new Error()))

    const res = await updateComicSeriesBooks(parent, args, context, info)

    expect(res).toBeNull()
  })

  it('should return null in case of an Error while getting existing ComicBook', async () => {
    getComicBookByUrls.mockReturnValueOnce(RTE.left(new Error('')))

    const res = await updateComicSeriesBooks(parent, args, context, info)

    expect(res).toBeNull()
  })

  it('should return null in case of an Error during enqueing Tasks', async () => {
    addTasksToQueue.mockReturnValueOnce(RTE.left(new Error()))

    const res = await updateComicSeriesBooks(parent, args, context, info)

    expect(res).toBeNull()
  })

  it('should return null in case of an Error during saving new ComicBooks', async () => {
    insertComicBooks.mockReturnValueOnce(RTE.left(new Error()))

    const res = await updateComicSeriesBooks(parent, args, context, info)

    expect(res).toBeNull()
  })

  it('should return null in case of an Error during adding ComicBooks to ComicSeries', async () => {
    addComicBooksToSeries.mockReturnValueOnce(RTE.left(new Error()))

    const res = await updateComicSeriesBooks(parent, args, context, info)

    expect(res).toBeNull()
  })

  it('should scrap ComicBook List from ComicSeries singleIssuesUrl when type is SINGLEISSUE and path was not defined', async () => {
    await updateComicSeriesBooks(parent, args, context, info)

    expect(getComicBookList).toHaveBeenCalledWith(
      defaultComicSeries.singleIssuesUrl,
    )
  })

  it('should scrap ComicBook List from ComicSeries collectionsUrl when type is COLLECTION and path was not defined', async () => {
    await updateComicSeriesBooks(
      parent,
      { ...args, comicBookType: ComicBookType.COLLECTION },
      context,
      info,
    )

    expect(getComicBookList).toHaveBeenCalledWith(
      defaultComicSeries.collectionsUrl,
    )
  })

  it('should scrap ComicBook List from path when defined', async () => {
    const path = '/next-page'
    await updateComicSeriesBooks(
      parent,
      { ...args, comicBookListPath: '/next-page' },
      context,
      info,
    )

    expect(getComicBookList).toHaveBeenCalledWith(path)
  })

  it('should only insert new ComicBooks based on the exisitence of their url', async () => {
    getComicBookList.mockReturnValueOnce(
      TE.right({
        ...defaultComicBookListData,
        comicBookList: [
          {
            ...defaultComicBookListData.comicBookList[0],
            url: O.some('/comic-book1'),
          },
          {
            ...defaultComicBookListData.comicBookList[0],
            url: O.some('/comic-book2'),
          },
        ],
      }),
    )
    getComicBookByUrls.mockReturnValueOnce(
      RTE.right([
        {
          ...defaultComicBook,
          url: '/comic-book2',
        },
        {
          ...defaultComicBook,
          url: '/comic-book3',
        },
      ]),
    )

    await updateComicSeriesBooks(parent, args, context, info)

    expect(insertComicBooks).toHaveBeenCalledWith([
      {
        ...defaultComicBookListData.comicBookList[0],
        comicSeries: args.comicSeriesId,
        type: args.comicBookType,
        url: '/comic-book1',
        issueNo: (defaultComicBookListData.comicBookList[0].issueNo as O.Some<
          number
        >).value,
        // TODO: Remove the null values once the repo accepts partials
        creators: [],
        publisher: null,
        coverImgUrl: null,
        releaseDate: null,
        description: null,
      },
    ])
  })

  it('should insert ComicBook with comicSeriesId and ComicBookType from arguments', async () => {
    const comicSeriesId = new ObjectID()

    await updateComicSeriesBooks(
      parent,
      { ...args, comicSeriesId, comicBookType: ComicBookType.COLLECTION },
      context,
      info,
    )

    expect(insertComicBooks).toHaveBeenCalledWith([
      expect.objectContaining({
        comicSeries: comicSeriesId,
        type: ComicBookType.COLLECTION,
      }),
    ])
  })

  it('should add new ComicBooks to ComicSeries', async () => {
    await updateComicSeriesBooks(parent, args, context, info)

    expect(addComicBooksToSeries).toHaveBeenCalledWith(
      defaultComicSeries._id,
      [defaultComicBook._id],
      args.comicBookType,
    )
  })

  it('should enqueue next ComicBooks List page to be scraped', async () => {
    await updateComicSeriesBooks(parent, args, context, info)

    expect(addTasksToQueue).toHaveBeenCalledWith([
      {
        type: TaskType.SCRAPCOMICBOOKLIST,
        data: {
          comicSeriesId: args.comicSeriesId,
          type: args.comicBookType,
          url: (defaultComicBookListData.nextPage as O.Some<string>).value,
        },
      },
    ])
  })

  it('should not enqueue next ComicBooks List page to be scraped when no next page was found', async () => {
    getComicBookList.mockReturnValueOnce(
      TE.right({ ...defaultComicBookListData, nextPage: O.none }),
    )

    await updateComicSeriesBooks(parent, args, context, info)

    expect(addTasksToQueue).not.toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          type: TaskType.SCRAPCOMICBOOKLIST,
        }),
      ]),
    )
  })

  it('should not enqueue next ComicBooks List page to be scraped when the List contains known ComicBooks', async () => {
    getComicBookList.mockReturnValueOnce(
      TE.right({
        ...defaultComicBookListData,
        comicBookList: [
          {
            ...defaultComicBookListData.comicBookList[0],
            url: '/comic-book1',
          },
        ],
      }),
    )
    getComicBookByUrls.mockReturnValueOnce(
      RTE.right([
        {
          ...defaultComicBook,
          url: '/comic-book1',
        },
      ]),
    )

    await updateComicSeriesBooks(parent, args, context, info)

    expect(addTasksToQueue).not.toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          type: TaskType.SCRAPCOMICBOOKLIST,
        }),
      ]),
    )
  })

  it('should enqueue new ComicBooks from List to be scraped', async () => {
    await updateComicSeriesBooks(parent, args, context, info)

    expect(addTasksToQueue).toHaveBeenCalledWith([
      {
        type: TaskType.SCRAPCOMICBOOK,
        data: {
          comicBookUrl: '/new-path',
        },
      },
    ])
  })

  it('should return new ComicBooks', async () => {
    const res = await updateComicSeriesBooks(parent, args, context, info)

    expect(res).toMatchObject([defaultComicBook])
  })
})

const getComicBookList = jest.fn().mockReturnValue(
  TE.right({
    ...defaultComicBookListData,
    comicBookList: [
      // Set a different url to ensure a new ComicBook is part of the data
      { ...defaultComicBookListData.comicBookList[0], url: '/new-path' },
    ],
  }),
)
const scrape: IScraperService = ({
  getComicBookList,
} as unknown) as IScraperService

const getComicSeriesById = jest
  .fn()
  .mockReturnValue(RTE.right(defaultComicSeries))
const addComicBooksToSeries = jest
  .fn()
  .mockReturnValue(RTE.right(defaultComicSeries))
const comicSeriesRepository: IComicSeriesRepository<Db, Error | MongoError> = ({
  getById: getComicSeriesById,
  addComicBooks: addComicBooksToSeries,
} as unknown) as IComicSeriesRepository<Db, Error | MongoError>

const getComicBookByUrls = jest
  .fn()
  .mockReturnValue(RTE.right([defaultComicBook]))
const insertComicBooks = jest
  .fn()
  .mockReturnValue(RTE.right([defaultComicBook]))
const comicBookRepository: IComicBookRepository<Db, Error | MongoError> = ({
  getByUrls: getComicBookByUrls,
  addComicBooks: insertComicBooks,
} as unknown) as IComicBookRepository<Db, Error | MongoError>

const addTasksToQueue = jest
  .fn()
  .mockReturnValue(RTE.right([defaultScrapSingleIssuesTask]))
const queueRepository: IQueueRepository<Db, Error | MongoError> = ({
  addTasksToQueue: addTasksToQueue,
} as unknown) as IQueueRepository<Db, Error | MongoError>

const context = {
  dataSources: {
    comicSeries: comicSeriesRepository,
    comicBook: comicBookRepository,
    queue: queueRepository,
  },
  services: { scrape },
  db: O.some({}),
} as GraphQLContext

const info = {} as GraphQLResolveInfo
const parent = {}
const args = {
  comicSeriesId: defaultComicSeries._id,
  comicBookType: ComicBookType.SINGLEISSUE,
  comicBookListPath: null,
}
