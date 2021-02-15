import type { GraphQLResolveInfo } from 'graphql'
import { Db, MongoError, ObjectID } from 'mongodb'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as O from 'fp-ts/lib/Option'

import type { GraphQLContext } from 'types/app'
import type { IPullListRepository } from 'models/PullList/PullList.interface'
import type { IComicBookRepository } from 'models/ComicBook/ComicBook.interface'
import { ComicBookType } from 'types/server-schema'
import { defaultComicBook } from '__mocks__/ComicBook.mock'
import { defaultPullList } from '__mocks__/PullList.mock'

import { releases } from '../releases.resolver'

describe('[Query.releases]', () => {
  it('should return null in case of an Error when user is in context', async () => {
    getBySeriesAndReleaseInMonth.mockReturnValueOnce(RTE.left(new Error()))
    getByReleaseInMonth.mockReturnValueOnce(RTE.left(new Error()))

    const res = await releases(parent, args, context, info)

    expect(res).toBeNull()
  })

  it('should return null in case of an Error when no user is in context', async () => {
    getByReleaseInMonth.mockReturnValueOnce(RTE.left(new Error()))

    const res = await releases(parent, args, { ...context, user: O.none }, info)

    expect(res).toBeNull()
  })

  it('should return user specific releases when user is in context', async () => {
    const res = await releases(parent, args, context, info)

    expect(res).toMatchObject(userReleases)
  })

  it('should return general releases when no valid user is in context ', async () => {
    const res = await releases(parent, args, { ...context, user: O.none }, info)

    expect(res).toMatchObject(generalReleases)
  })

  it('should use month, year and type from arguments to get releases for user', async () => {
    await releases(
      parent,
      { month: 2, year: 2020, type: ComicBookType.COLLECTION },
      context,
      info,
    )

    expect(getBySeriesAndReleaseInMonth).toHaveBeenLastCalledWith(
      expect.any(Array),
      2,
      2020,
      ComicBookType.COLLECTION,
    )
  })

  it('should use month, year and type from arguments to get releases', async () => {
    await releases(
      parent,
      { month: 2, year: 2020, type: ComicBookType.COLLECTION },
      { ...context, user: O.none },
      info,
    )

    expect(getByReleaseInMonth).toHaveBeenLastCalledWith(
      2,
      2020,
      ComicBookType.COLLECTION,
    )
  })

  it('should use current month and SINGLEISSUE as default to get releases for user', async () => {
    await releases(parent, args, context, info)

    expect(getBySeriesAndReleaseInMonth).toHaveBeenLastCalledWith(
      expect.any(Array),
      new Date().getMonth() + 1,
      new Date().getFullYear(),
      ComicBookType.SINGLEISSUE,
    )
  })

  it('should use current month and SINGLEISSUE as default to get releases', async () => {
    await releases(parent, args, { ...context, user: O.none }, info)

    expect(getByReleaseInMonth).toHaveBeenLastCalledWith(
      new Date().getMonth() + 1,
      new Date().getFullYear(),
      ComicBookType.SINGLEISSUE,
    )
  })
})

const userReleases = [defaultComicBook]
const generalReleases = [
  { ...defaultComicBook, title: 'General Comic', _id: new ObjectID() },
]

const getPullListByOwner = jest.fn().mockReturnValue(RTE.right(defaultPullList))
const pullListRepository: IPullListRepository<Db, Error | MongoError> = ({
  getPullListByOwner,
} as unknown) as IPullListRepository<Db, Error | MongoError>

const getBySeriesAndReleaseInMonth = jest
  .fn()
  .mockReturnValue(RTE.right(userReleases))
const getByReleaseInMonth = jest
  .fn()
  .mockReturnValue(RTE.right(generalReleases))
const comicBookRepository: IComicBookRepository<Db, Error | MongoError> = ({
  getBySeriesAndReleaseInMonth,
  getByReleaseInMonth,
} as unknown) as IComicBookRepository<Db, Error | MongoError>

const context = {
  dataSources: {
    pullList: pullListRepository,
    comicBook: comicBookRepository,
  },
  db: O.some({}),
  user: O.some('user'),
} as GraphQLContext

const info = {} as GraphQLResolveInfo
const parent = {}
const args = { month: null, year: null, type: null }
