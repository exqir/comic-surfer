import type { GraphQLResolveInfo } from 'graphql'
import { Db, MongoError } from 'mongodb'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as TE from 'fp-ts/lib/TaskEither'
import * as O from 'fp-ts/lib/Option'

import type { GraphQLContext } from 'types/app'
import type { IComicBookRepository } from 'models/ComicBook/ComicBook.interface'
import type { IScraperService } from 'services/Scraper/Scraper.interface'
import { defaultComicBook } from '__mocks__/ComicBook.mock'
import { defaultComicBookData } from '__mocks__/ComicBookData.mock'

import { updateComicBookRelease } from '../updateComicBookRelease.resolver'

describe('[Mutation.updateComicBookRelease]', () => {
  it('should return null in case of a Error while getting ComicBook', async () => {
    getComicBookById.mockReturnValueOnce(RTE.left(new Error()))

    const res = await updateComicBookRelease(parent, args, context, info)

    expect(res).toBeNull()
  })

  it('should return null in case of a Error during scraping ComicBook', async () => {
    getComicBook.mockReturnValueOnce(TE.left(new Error()))

    const res = await updateComicBookRelease(parent, args, context, info)

    expect(res).toBeNull()
  })

  it('should return null in case of a missing releaseDate from scraped ComicBook', async () => {
    getComicBook.mockReturnValueOnce(
      TE.right({ ...defaultComicBookData, releaseDate: O.none }),
    )

    const res = await updateComicBookRelease(parent, args, context, info)

    expect(res).toBeNull()
  })

  it('should return null in case of a Error while updating ComicBook', async () => {
    updateComicBookReleaseDate.mockReturnValueOnce(RTE.left(new Error()))

    const res = await updateComicBookRelease(parent, args, context, info)

    expect(res).toBeNull()
  })

  it('should scrap ComicBook from url of the given ComicBook', async () => {
    await updateComicBookRelease(parent, args, context, info)

    expect(getComicBook).toHaveBeenCalledWith(defaultComicBook.url)
  })

  it('should return ComicBook with new releaseDate', async () => {
    const res = await updateComicBookRelease(parent, args, context, info)

    expect(res).toMatchObject(defaultComicBook)
  })
})

const getComicBook = jest.fn().mockReturnValue(TE.right(defaultComicBookData))
const scrape: IScraperService = ({
  getComicBook,
} as unknown) as IScraperService

const getComicBookById = jest.fn().mockReturnValue(RTE.right(defaultComicBook))
const updateComicBookReleaseDate = jest
  .fn()
  .mockReturnValue(RTE.right(defaultComicBook))
const comicBookRepository: IComicBookRepository<Db, Error | MongoError> = ({
  getById: getComicBookById,
  updateReleaseDate: updateComicBookReleaseDate,
} as unknown) as IComicBookRepository<Db, Error | MongoError>

const context = {
  dataSources: {
    comicBook: comicBookRepository,
  },
  services: { scrape },
  db: O.some({}),
} as GraphQLContext

const info = {} as GraphQLResolveInfo
const parent = {}
const args = { comicBookId: defaultComicBook._id }
