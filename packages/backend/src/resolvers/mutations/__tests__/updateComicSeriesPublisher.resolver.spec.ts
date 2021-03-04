import type { GraphQLResolveInfo } from 'graphql'
import { Db, MongoError } from 'mongodb'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as TE from 'fp-ts/lib/TaskEither'
import * as O from 'fp-ts/lib/Option'

import type { GraphQLContext } from 'types/app'
import type { IComicSeriesRepository } from 'models/ComicSeries/ComicSeries.interface'
import type { IPublisherRepository } from 'models/Publisher/Publisher.interface'
import type { IScraper } from 'services/ScrapeService'
import { defaultComicSeries } from '__mocks__/ComicSeries.mock'
import { defaultPublisher } from '__mocks__/Publisher.mock'
import { defaultComicBookData } from '__mocks__/ComicBookData.mock'
import { defaultComicBookListData } from '__mocks__/ComicBookListData.mock'

import { updateComicSeriesPublisher } from '../updateComicSeriesPublisher.resolver'

describe('[Mutation.updateComicSeriesPublisher]', () => {
  it('should return null in case of a missing singleIssuesUrl', async () => {
    getComicSeriesById.mockReturnValueOnce(
      RTE.right({ ...defaultComicSeries, singleIssuesUrl: null }),
    )

    const res = await updateComicSeriesPublisher(parent, args, context, info)

    expect(res).toBeNull()
  })

  it('should return null in case of an Error during scraping ComicBook List', async () => {
    getComicBookList.mockReturnValueOnce(TE.left(new Error()))

    const res = await updateComicSeriesPublisher(parent, args, context, info)

    expect(res).toBeNull()
  })

  it('should return null in case of an empty ComicBook List', async () => {
    getComicBookList.mockReturnValueOnce(
      TE.right({ ...defaultComicBookListData, comicBookList: [] }),
    )

    const res = await updateComicSeriesPublisher(parent, args, context, info)

    expect(res).toBeNull()
  })

  it('should return null in case of an Error during scraping ComicBook', async () => {
    getComicBook.mockReturnValueOnce(TE.left(new Error()))

    const res = await updateComicSeriesPublisher(parent, args, context, info)

    expect(res).toBeNull()
  })

  it('should return null in case of an Error during getting Publisher', async () => {
    getPublisherByUrl.mockReturnValueOnce(RTE.left(new Error()))

    const res = await updateComicSeriesPublisher(parent, args, context, info)

    expect(res).toBeNull()
  })

  it('should return null in case of an Error during getting adding ComicSeries to Publisher', async () => {
    addComicSeriesToPublisher.mockReturnValueOnce(RTE.left(new Error()))

    const res = await updateComicSeriesPublisher(parent, args, context, info)

    expect(res).toBeNull()
  })

  it('should return null in case of an Error during getting setting Publisher of ComicSeries', async () => {
    setPublisherForComicSeries.mockReturnValueOnce(RTE.left(new Error()))

    const res = await updateComicSeriesPublisher(parent, args, context, info)

    expect(res).toBeNull()
  })

  it('should scrap ComicBook List from ComicSeries singleIssuesUrl', async () => {
    await updateComicSeriesPublisher(parent, args, context, info)

    expect(getComicBookList).toHaveBeenCalledWith(
      defaultComicSeries.singleIssuesUrl,
    )
  })

  it('should scrap Publisher from the first ComicBook of the List', async () => {
    await updateComicSeriesPublisher(parent, args, context, info)

    expect(getComicBook).toHaveBeenCalledWith(
      defaultComicBookListData.comicBookList[0].url,
    )
  })

  it('should request Publisher based on url from ComicBook', async () => {
    await updateComicSeriesPublisher(parent, args, context, info)

    expect(getPublisherByUrl).toHaveBeenCalledWith(
      defaultComicBookData.publisher?.url,
    )
  })

  it('should return ComicSeries with Publisher', async () => {
    const res = await updateComicSeriesPublisher(parent, args, context, info)

    expect(res).toMatchObject(defaultComicSeries)
  })
})

const getComicBookList = jest
  .fn()
  .mockReturnValue(TE.right(defaultComicBookListData))
const getComicBook = jest.fn().mockReturnValue(TE.right(defaultComicBookData))
const scrape: IScraper = ({
  getComicBookList,
  getComicBook,
} as unknown) as IScraper

const getComicSeriesById = jest
  .fn()
  .mockReturnValue(RTE.right(defaultComicSeries))
const setPublisherForComicSeries = jest
  .fn()
  .mockReturnValue(RTE.right(defaultComicSeries))
const comicSeriesRepository: IComicSeriesRepository<Db, Error | MongoError> = ({
  getById: getComicSeriesById,
  setPublisher: setPublisherForComicSeries,
} as unknown) as IComicSeriesRepository<Db, Error | MongoError>

const addComicSeriesToPublisher = jest
  .fn()
  .mockReturnValue(RTE.right(defaultPublisher))
const getPublisherByUrl = jest.fn().mockReturnValue(RTE.right(defaultPublisher))
const publisherRepository: IPublisherRepository<Db, Error | MongoError> = ({
  getByUrl: getPublisherByUrl,
  addComicSeries: addComicSeriesToPublisher,
} as unknown) as IPublisherRepository<Db, Error | MongoError>

const context = {
  dataSources: {
    comicSeries: comicSeriesRepository,
    publisher: publisherRepository,
  },
  services: { scrape },
  db: O.some({}),
} as GraphQLContext

const info = {} as GraphQLResolveInfo
const parent = {}
const args = { comicSeriesId: defaultComicSeries._id }
