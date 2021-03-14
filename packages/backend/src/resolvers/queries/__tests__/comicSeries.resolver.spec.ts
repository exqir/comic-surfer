import type { GraphQLResolveInfo } from 'graphql'
import { Db, MongoError } from 'mongodb'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as O from 'fp-ts/lib/Option'

import type { GraphQLContext } from 'types/app'
import type { IComicSeriesRepository } from 'models/ComicSeries/ComicSeries.interface'
import { defaultComicSeries } from '__mocks__/ComicSeries.mock'

import { comicSeries } from '../comicSeries.resolver'

describe('[Query.comicSeries]', () => {
  it('should return null in case of an Error', async () => {
    getById.mockReturnValueOnce(RTE.left(new Error()))

    const res = await comicSeries(
      parent,
      { id: defaultComicSeries._id },
      context,
      info,
    )

    expect(res).toBeNull()
  })

  it('should return ComicBook', async () => {
    const res = await comicSeries(
      parent,
      { id: defaultComicSeries._id },
      context,
      info,
    )

    expect(res).toMatchObject(defaultComicSeries)
  })
})

const getById = jest.fn().mockReturnValue(RTE.right(defaultComicSeries))
const comicSeriesRepository: IComicSeriesRepository<Db, Error | MongoError> = ({
  getById,
} as unknown) as IComicSeriesRepository<Db, Error | MongoError>

const context = {
  dataSources: {
    comicSeries: comicSeriesRepository,
  },
  db: O.some({}),
} as GraphQLContext

const info = {} as GraphQLResolveInfo
const parent = {}
