import type { GraphQLResolveInfo } from 'graphql'
import type { Db, MongoError } from 'mongodb'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as TE from 'fp-ts/lib/TaskEither'
import * as O from 'fp-ts/lib/Option'

import type { GraphQLContext } from 'types/app'
import type { IPullListRepository } from 'models/PullList/PullList.interface'
import type { IComicSeriesRepository } from 'models/ComicSeries/ComicSeries.interface'
import type { IScraper } from 'services/ScrapeService'
import { defaultPullList } from '__mocks__/PullList.mock'
import { defaultComicSeries } from '__mocks__/ComicSeries.mock'
import { defaultComicSeriesSearchResult } from '__mocks__/ComicSeriesSearchResult.mock'

import { search } from '../search.resolver'

describe('[Query.search]', () => {
  it('should return null in case of an Error during scraping', async () => {
    getComicSeriesSearch.mockReturnValueOnce(TE.left(new Error()))

    const res = await search(parent, args, context, info)

    expect(res).toBeNull()
  })

  it('should return null in case of an Error while getting PullList', async () => {
    getPullListByOwner.mockReturnValueOnce(RTE.left(new Error()))

    const res = await search(parent, args, context, info)

    expect(res).toBeNull()
  })

  it('should return null in case of an Error wjile getting ComicSeries', async () => {
    getComicSeriesByIds.mockReturnValueOnce(RTE.left(new Error()))

    const res = await search(parent, args, context, info)

    expect(res).toBeNull()
  })

  it('should return EnhancedSearchResult', async () => {
    const res = await search(parent, args, context, info)

    expect(res).toMatchObject([
      {
        ...defaultComicSeriesSearchResult,
        comicSeriesUrlsInPullList: [defaultComicSeries.url],
      },
    ])
  })

  it('should return EnhancedSearchResult with empty url list when no user is in context', async () => {
    const res = await search(parent, args, { ...context, user: O.none }, info)

    expect(res).toMatchObject([
      {
        ...defaultComicSeriesSearchResult,
        comicSeriesUrlsInPullList: [],
      },
    ])
  })
})

const getPullListByOwner = jest.fn().mockReturnValue(RTE.right(defaultPullList))
const pullListRepository: IPullListRepository<Db, Error | MongoError> = ({
  getPullListByOwner,
} as unknown) as IPullListRepository<Db, Error | MongoError>

const getComicSeriesByIds = jest
  .fn()
  .mockReturnValue(RTE.right([defaultComicSeries]))
const comicSeriesRepository: IComicSeriesRepository<Db, Error | MongoError> = ({
  getByIds: getComicSeriesByIds,
} as unknown) as IComicSeriesRepository<Db, Error | MongoError>

const getComicSeriesSearch = jest
  .fn()
  .mockReturnValue(TE.right([defaultComicSeriesSearchResult]))
const scrape: IScraper = ({
  getComicSeriesSearch,
} as unknown) as IScraper

const context = {
  dataSources: {
    pullList: pullListRepository,
    comicSeries: comicSeriesRepository,
  },
  services: {
    scrape,
  },
  db: O.some({}),
  user: O.some('user'),
} as GraphQLContext

const info = {} as GraphQLResolveInfo
const parent = {}
const args = { q: 'Series Title' }
