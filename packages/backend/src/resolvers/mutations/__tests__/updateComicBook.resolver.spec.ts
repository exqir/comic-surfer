import type { GraphQLResolveInfo } from 'graphql'
import { Db, MongoError } from 'mongodb'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as TE from 'fp-ts/lib/TaskEither'
import * as O from 'fp-ts/lib/Option'

import type { GraphQLContext } from 'types/app'
import type { IComicBookRepository } from 'models/ComicBook/ComicBook.interface'
import type { IPublisherRepository } from 'models/Publisher/Publisher.interface'
import type { IScraperService } from 'services/Scraper/Scraper.interface'
import { defaultComicBook } from '__mocks__/ComicBook.mock'
import { defaultPublisher } from '__mocks__/Publisher.mock'
import { defaultComicBookData } from '__mocks__/ComicBookData.mock'

import { updateComicBook } from '../updateComicBook.resolver'

describe('[Mutation.updateComicBook]', () => {
  it('should return null in case of an Error while getting ComicBook', async () => {
    getComicBookById.mockReturnValueOnce(RTE.left(new Error()))

    const res = await updateComicBook(parent, args, context, info)

    expect(res).toBeNull()
  })

  it('should return null in case of an Error during scraping ComicBook', async () => {
    getComicBook.mockReturnValueOnce(TE.left(new Error()))

    const res = await updateComicBook(parent, args, context, info)

    expect(res).toBeNull()
  })

  it('should return null in case of an Error during getting Publisher', async () => {
    getPublisherByUrl.mockReturnValueOnce(RTE.left(new Error()))

    const res = await updateComicBook(parent, args, context, info)

    expect(res).toBeNull()
  })

  it('should return null in case of an Error during updating ComicBook', async () => {
    updateComicBookDetails.mockReturnValueOnce(RTE.left(new Error()))

    const res = await updateComicBook(parent, args, context, info)

    expect(res).toBeNull()
  })

  it('should scrap ComicBook from ComicBook url', async () => {
    await updateComicBook(parent, args, context, info)

    expect(getComicBook).toHaveBeenCalledWith(defaultComicBook.url)
  })

  it('should request ComicBook based on id from args', async () => {
    await updateComicBook(parent, args, context, info)

    expect(getComicBookById).toHaveBeenCalledWith(defaultComicBook._id)
  })

  it('should request Publisher by ComicBook url', async () => {
    await updateComicBook(parent, args, context, info)

    expect(getPublisherByUrl).toHaveBeenCalledWith(
      (defaultComicBookData.publisher as O.Some<{ url: string }>).value.url,
    )
  })

  it('should update ComicBook with ComicBookData', async () => {
    await updateComicBook(parent, args, context, info)

    expect(updateComicBookDetails).toHaveBeenCalledWith(defaultComicBook._id, {
      ...defaultComicBookData,
      description: (defaultComicBookData.description as O.Some<string>).value,
      releaseDate: (defaultComicBookData.releaseDate as O.Some<Date>).value,
      publisher: defaultPublisher._id,
    })
  })

  it('should return updated ComicBook', async () => {
    const res = await updateComicBook(parent, args, context, info)

    expect(res).toMatchObject(defaultComicBook)
  })
})

const getComicBook = jest.fn().mockReturnValue(TE.right(defaultComicBookData))
const scrape: IScraperService = ({
  getComicBook,
} as unknown) as IScraperService

const getComicBookById = jest.fn().mockReturnValue(RTE.right(defaultComicBook))
const updateComicBookDetails = jest
  .fn()
  .mockReturnValue(RTE.right(defaultComicBook))
const comicBookRepository: IComicBookRepository<Db, Error | MongoError> = ({
  getById: getComicBookById,
  updateComicBookDetails,
} as unknown) as IComicBookRepository<Db, Error | MongoError>

const getPublisherByUrl = jest.fn().mockReturnValue(RTE.right(defaultPublisher))
const publisherRepository: IPublisherRepository<Db, Error | MongoError> = ({
  getByUrl: getPublisherByUrl,
} as unknown) as IPublisherRepository<Db, Error | MongoError>

const context = {
  dataSources: {
    comicBook: comicBookRepository,
    publisher: publisherRepository,
  },
  services: { scrape },
  db: O.some({}),
} as GraphQLContext

const info = {} as GraphQLResolveInfo
const parent = {}
const args = { comicBookId: defaultComicBook._id }
