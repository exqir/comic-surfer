import type { GraphQLResolveInfo } from 'graphql'
import { Db, MongoError, ObjectId } from 'mongodb'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as O from 'fp-ts/lib/Option'

import type { GraphQLContext } from 'types/app'
import type { IPublisherRepository } from 'models/Publisher/Publisher.interface'
import type { IComicBookRepository } from 'models/ComicBook/ComicBook.interface'
import { defaultComicBook } from '__mocks__/ComicBook.mock'
import { defaultComicSeries } from '__mocks__/ComicSeries.mock'
import { defaultPublisher } from '__mocks__/Publisher.mock'

import { ComicSeries } from '../ComicSeries.resolver'

describe('[ComicSeries.singleIssues]', () => {
  it('should throw Error in case of an Error', async () => {
    getComicBookByIds.mockReturnValueOnce(RTE.left(new Error()))

    const execute = () => ComicSeries.singleIssues(parent, args, context, info)

    await expect(execute).rejects.toThrowError(Error)
  })

  it('should return empty array in case no ComicSeries were found', async () => {
    getComicBookByIds.mockReturnValueOnce(RTE.right([]))

    const res = await ComicSeries.singleIssues(parent, args, context, info)

    expect(res).toMatchObject([])
  })

  it('should return ComicBooks', async () => {
    const res = await ComicSeries.singleIssues(parent, args, context, info)

    expect(res).toMatchObject([defaultComicBook])
  })
})

describe('[ComicSeries.collections]', () => {
  it('should throw Error in case of an Error', async () => {
    getComicBookByIds.mockReturnValueOnce(RTE.left(new Error()))

    const execute = () => ComicSeries.collections(parent, args, context, info)

    await expect(execute).rejects.toThrowError(Error)
  })

  it('should return empty array in case no ComicSeries were found', async () => {
    getComicBookByIds.mockReturnValueOnce(RTE.right([]))

    const res = await ComicSeries.collections(parent, args, context, info)

    expect(res).toMatchObject([])
  })

  it('should return ComicBooks', async () => {
    const res = await ComicSeries.collections(parent, args, context, info)

    expect(res).toMatchObject([defaultComicBook])
  })
})

describe('[ComicSeries.publisher]', () => {
  it('should return null in case of an Error', async () => {
    getPublisherById.mockReturnValueOnce(RTE.left(new Error()))

    const res = await ComicSeries.publisher(parent, args, context, info)

    expect(res).toBeNull()
  })

  it('should return null in case ComicSeries as no set Publisher', async () => {
    const res = await ComicSeries.publisher(
      { ...defaultComicSeries, publisher: null },
      args,
      context,
      info,
    )

    expect(res).toBeNull()
  })

  it('should return Publisher', async () => {
    const res = await ComicSeries.publisher(parent, args, context, info)

    expect(res).toMatchObject(defaultPublisher)
  })
})

describe('[ComicSeries.coverImgUrl]', () => {
  it('should return null in case of an Error', async () => {
    getComicBookById.mockReturnValueOnce(RTE.left(new Error()))

    const res = await ComicSeries.coverImgUrl(parent, args, context, info)

    expect(res).toBeNull()
  })

  it('should return coverImgUrl of first singleIssue when ComicSeries has singleIssues', async () => {
    const res = await ComicSeries.coverImgUrl(parent, args, context, info)

    expect(res).toBe(defaultComicBook.coverImgUrl)
    expect(getComicBookById).toHaveBeenCalledWith(
      defaultComicSeries.singleIssues[0],
    )
  })

  it('should return coverImgUrl of first collection when ComicSeries has NO singleIssues', async () => {
    const res = await ComicSeries.coverImgUrl(
      { ...defaultComicSeries, singleIssues: [] },
      args,
      context,
      info,
    )

    expect(res).toBe(defaultComicBook.coverImgUrl)
    expect(getComicBookById).toHaveBeenCalledWith(
      defaultComicSeries.collections[0],
    )
  })

  it('should return null in case ComicSeries has NO singleIssues and NO collections', async () => {
    const res = await ComicSeries.coverImgUrl(
      { ...defaultComicSeries, singleIssues: [], collections: [] },
      args,
      context,
      info,
    )

    expect(res).toBeNull()
  })
})

describe('[ComicSeries.singleIssuesNumber]', () => {
  it('should return amount of singleIssues', async () => {
    const res = await ComicSeries.singleIssuesNumber(
      { ...defaultComicSeries, singleIssues: [new ObjectId(), new ObjectId()] },
      args,
      context,
      info,
    )

    expect(res).toBe(2)
  })
})

describe('[ComicSeries.collectionsNumber]', () => {
  it('should return amount of collections', async () => {
    const res = await ComicSeries.collectionsNumber(
      { ...defaultComicSeries, collections: [new ObjectId(), new ObjectId()] },
      args,
      context,
      info,
    )

    expect(res).toBe(2)
  })
})

const getComicBookById = jest.fn().mockReturnValue(RTE.right(defaultComicBook))
const getComicBookByIds = jest
  .fn()
  .mockReturnValue(RTE.right([defaultComicBook]))
const comicBookRepository: IComicBookRepository<Db, Error | MongoError> = ({
  getById: getComicBookById,
  getByIds: getComicBookByIds,
} as unknown) as IComicBookRepository<Db, Error | MongoError>

const getPublisherById = jest.fn().mockReturnValue(RTE.right(defaultPublisher))
const publisherRepository: IPublisherRepository<Db, Error | MongoError> = ({
  getById: getPublisherById,
} as unknown) as IPublisherRepository<Db, Error | MongoError>

const context = {
  dataSources: {
    comicBook: comicBookRepository,
    publisher: publisherRepository,
  },
  db: O.some({}),
} as GraphQLContext

const info = {} as GraphQLResolveInfo
const args = {}
const parent = defaultComicSeries
