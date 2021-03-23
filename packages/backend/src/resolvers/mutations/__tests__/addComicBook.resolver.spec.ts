import type { GraphQLResolveInfo } from 'graphql'
import { Db, MongoError, ObjectID } from 'mongodb'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as TE from 'fp-ts/lib/TaskEither'
import * as O from 'fp-ts/lib/Option'

import type { GraphQLContext } from 'types/app'
import type { IComicBookRepository } from 'models/ComicBook/ComicBook.interface'
import type { IPublisherRepository } from 'models/Publisher/Publisher.interface'
import type { IComicSeriesRepository } from 'models/ComicSeries/ComicSeries.interface'
import type { IScraperService } from 'services/Scraper/Scraper.interface'
import { ComicBookType } from 'types/graphql-schema'
import { defaultComicBook } from '__mocks__/ComicBook.mock'
import { defaultPublisher } from '__mocks__/Publisher.mock'
import { defaultComicBookData } from '__mocks__/ComicBookData.mock'
import { defaultComicSeries } from '__mocks__/ComicSeries.mock'

import { addComicBook } from '../addComicBook.resolver'

describe('[Mutation.addComicBook]', () => {
  it('should return null in case of an Error during scraping ComicBook', async () => {
    getComicBook.mockReturnValueOnce(TE.left(new Error()))

    const res = await addComicBook(parent, args, context, info)

    expect(res).toBeNull()
  })

  it('should return null in case of an Error during getting Publisher', async () => {
    getPublisherByUrl.mockReturnValueOnce(RTE.left(new Error()))

    const res = await addComicBook(parent, args, context, info)

    expect(res).toBeNull()
  })

  it('should return null in case of an Error during inserting ComicBook', async () => {
    addNewComicBook.mockReturnValueOnce(RTE.left(new Error()))

    const res = await addComicBook(parent, args, context, info)

    expect(res).toBeNull()
  })

  it('should scrap ComicBook from given comicBookUrl', async () => {
    await addComicBook(parent, args, context, info)

    expect(getComicBook).toHaveBeenCalledWith(args.comicBookUrl)
  })

  it('should request Publisher by ComicBook url', async () => {
    await addComicBook(parent, args, context, info)

    expect(getPublisherByUrl).toHaveBeenCalledWith(
      (defaultComicBookData.publisher as O.Some<{ url: string }>).value.url,
    )
  })

  it('should insert ComicBook with ComicBookData', async () => {
    await addComicBook(parent, args, context, info)

    expect(addNewComicBook).toHaveBeenCalledWith(
      expect.objectContaining({
        title: defaultComicBookData.title,
        coverImgUrl: defaultComicBookData.coverImgUrl,
        creators: defaultComicBookData.creators,
        description: (defaultComicBookData.description as O.Some<string>).value,
        releaseDate: (defaultComicBookData.releaseDate as O.Some<Date>).value,
        issueNo: (defaultComicBookData.issueNo as O.Some<Number>).value,
      }),
    )
  })

  it('should insert ComicBook with Publisher url replaced by its id', async () => {
    const comicSeriesId = new ObjectID()

    await addComicBook(
      parent,
      { ...args, comicSeriesId, comicBookType: ComicBookType.COLLECTION },
      context,
      info,
    )

    expect(addNewComicBook).toHaveBeenCalledWith(
      expect.objectContaining({
        publisher: defaultPublisher._id,
      }),
    )
  })

  it('should insert ComicBook with comicSeriesId and ComicBookType from arguments', async () => {
    const comicSeriesId = new ObjectID()

    await addComicBook(
      parent,
      { ...args, comicSeriesId, comicBookType: ComicBookType.COLLECTION },
      context,
      info,
    )

    expect(addNewComicBook).toHaveBeenCalledWith(
      expect.objectContaining({
        comicSeries: comicSeriesId,
        type: ComicBookType.COLLECTION,
      }),
    )
  })

  it('should add ComicBook to ComicSeries from arguments', async () => {
    await addComicBook(parent, args, context, info)

    expect(addComicBookToSeries).toHaveBeenCalledWith(
      args.comicSeriesId,
      defaultComicBook._id,
      args.comicBookType,
    )
  })

  it('should return new ComicBook', async () => {
    const res = await addComicBook(parent, args, context, info)

    expect(res).toMatchObject(defaultComicBook)
  })
})

const getComicBook = jest.fn().mockReturnValue(TE.right(defaultComicBookData))
const scrape: IScraperService = ({
  getComicBook,
} as unknown) as IScraperService

const addNewComicBook = jest.fn().mockReturnValue(RTE.right(defaultComicBook))
const comicBookRepository: IComicBookRepository<Db, Error | MongoError> = ({
  addComicBook: addNewComicBook,
} as unknown) as IComicBookRepository<Db, Error | MongoError>

const addComicBookToSeries = jest
  .fn()
  .mockReturnValue(RTE.right(defaultComicBook))
const comicSeriesRepository: IComicSeriesRepository<Db, Error | MongoError> = ({
  addComicBook: addComicBookToSeries,
} as unknown) as IComicSeriesRepository<Db, Error | MongoError>

const getPublisherByUrl = jest.fn().mockReturnValue(RTE.right(defaultPublisher))
const publisherRepository: IPublisherRepository<Db, Error | MongoError> = ({
  getByUrl: getPublisherByUrl,
} as unknown) as IPublisherRepository<Db, Error | MongoError>

const context = {
  dataSources: {
    comicBook: comicBookRepository,
    comicSeries: comicSeriesRepository,
    publisher: publisherRepository,
  },
  services: { scrape },
  db: O.some({}),
} as GraphQLContext

const info = {} as GraphQLResolveInfo
const parent = {}
const args = {
  comicBookUrl: defaultComicBook.url,
  comicSeriesId: defaultComicSeries._id,
  comicBookType: ComicBookType.SINGLEISSUE,
}
