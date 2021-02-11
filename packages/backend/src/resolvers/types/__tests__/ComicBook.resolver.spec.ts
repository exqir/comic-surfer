import type { GraphQLResolveInfo } from 'graphql'
import type { Db, MongoError } from 'mongodb'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as O from 'fp-ts/lib/Option'

import type { GraphQLContext } from 'types/app'
import type { IPublisherRepository } from 'models/Publisher/Publisher.interface'
import type { IComicSeriesRepository } from 'models/ComicSeries/ComicSeries.interface'
import { defaultComicBook } from '__mocks__/ComicBook.mock'
import { defaultComicSeries } from '__mocks__/ComicSeries.mock'
import { defaultPublisher } from '__mocks__/Publisher.mock'

import { ComicBook } from '../ComicBook.resolver'

describe('[ComicBook.publisher]', () => {
  it('should return null in case of an Error', async () => {
    getPublisherById.mockReturnValueOnce(RTE.left(new Error()))

    const res = await ComicBook.publisher(defaultComicBook, args, context, info)

    expect(res).toBeNull()
  })

  it('should return null in case ComicBook as no set Publisher', async () => {
    const res = await ComicBook.publisher(
      { ...defaultComicBook, publisher: null },
      args,
      context,
      info,
    )

    expect(res).toBeNull()
  })

  it('should return Publisher', async () => {
    const res = await ComicBook.publisher(defaultComicBook, args, context, info)

    expect(res).toMatchObject(defaultPublisher)
  })
})

describe('[ComicBook.comicSeries]', () => {
  it('should return null in case of an Error', async () => {
    getComicSeriesById.mockReturnValueOnce(RTE.left(new Error()))

    const res = await ComicBook.comicSeries(
      defaultComicBook,
      args,
      context,
      info,
    )

    expect(res).toBeNull()
  })

  it('should return null in case ComicBook as no set ComicSeries', async () => {
    const res = await ComicBook.comicSeries(
      { ...defaultComicBook, comicSeries: null },
      args,
      context,
      info,
    )

    expect(res).toBeNull()
  })

  it('should return ComicSeries', async () => {
    const res = await ComicBook.comicSeries(
      defaultComicBook,
      args,
      context,
      info,
    )

    expect(res).toMatchObject(defaultComicSeries)
  })
})

const getComicSeriesById = jest
  .fn()
  .mockReturnValue(RTE.right(defaultComicSeries))
const comicSeriesRepository: IComicSeriesRepository<Db, Error | MongoError> = ({
  getById: getComicSeriesById,
} as unknown) as IComicSeriesRepository<Db, Error | MongoError>

const getPublisherById = jest.fn().mockReturnValue(RTE.right(defaultPublisher))
const publisherRepository: IPublisherRepository<Db, Error | MongoError> = ({
  getById: getPublisherById,
} as unknown) as IPublisherRepository<Db, Error | MongoError>

const context = {
  dataSources: {
    comicSeries: comicSeriesRepository,
    publisher: publisherRepository,
  },
  db: O.some({}),
} as GraphQLContext

const info = {} as GraphQLResolveInfo
const args = {}
