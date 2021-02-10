import type { GraphQLResolveInfo } from 'graphql'
import { Db, MongoError } from 'mongodb'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as O from 'fp-ts/lib/Option'

import type { GraphQLContext } from 'types/app'
import type { IComicSeriesRepository } from 'models/ComicSeries/ComicSeries.interface'
import { defaultComicSeries } from '__mocks__/ComicSeries.mock'
import { defaultPullList } from '__mocks__/PullList.mock'

import { PullList } from '../PullList.resolver'

describe('[Publisher.list]', () => {
  it('should PullList Error in case of an Error', async () => {
    getByIds.mockReturnValueOnce(RTE.left(new Error()))

    const execute = () => PullList.list(parent, args, context, info)

    await expect(execute).rejects.toThrowError(Error)
  })

  it('should return empty array in case no ComicSeries were found', async () => {
    getByIds.mockReturnValueOnce(RTE.right([]))

    const res = await PullList.list(parent, args, context, info)

    expect(res).toMatchObject([])
  })

  it('should return ComicSeries', async () => {
    const res = await PullList.list(parent, args, context, info)

    expect(res).toMatchObject([defaultComicSeries])
  })
})

const getByIds = jest.fn().mockReturnValue(RTE.right([defaultComicSeries]))
const comicSeriesRepository: IComicSeriesRepository<Db, Error | MongoError> = ({
  getByIds,
} as unknown) as IComicSeriesRepository<Db, Error | MongoError>

const context = {
  dataSources: {
    comicSeries: comicSeriesRepository,
  },
  db: O.some({}),
} as GraphQLContext

const info = {} as GraphQLResolveInfo
const parent = defaultPullList
const args = {}
