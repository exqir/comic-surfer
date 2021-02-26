import type { GraphQLResolveInfo } from 'graphql'
import { Db, MongoError } from 'mongodb'
import { AuthenticationError } from 'apollo-server'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as O from 'fp-ts/lib/Option'

import type { GraphQLContext } from 'types/app'
import type { IPullListRepository } from 'models/PullList/PullList.interface'
import { defaultComicSeries } from '__mocks__/ComicSeries.mock'
import { defaultPullList } from '__mocks__/PullList.mock'

import { removeFromPullList } from '../removeFromPullList.resolver'

describe('[Mutation.removeFromPullList]', () => {
  it('should throw an AuthenticationError when no valid user is in context', async () => {
    const execute = () =>
      removeFromPullList(parent, args, { ...context, user: O.none }, info)

    await expect(execute).rejects.toThrowError(AuthenticationError)
  })

  it('should return null in case of an Error while removing ComicSeries', async () => {
    removeComicSeriesFromPullList.mockReturnValueOnce(RTE.left(new Error()))

    const res = await removeFromPullList(parent, args, context, info)

    expect(res).toBeNull()
  })

  it('should return updated PullList', async () => {
    const res = await removeFromPullList(parent, args, context, info)

    expect(res).toMatchObject(defaultPullList)
  })
})

const removeComicSeriesFromPullList = jest
  .fn()
  .mockReturnValue(RTE.right(defaultPullList))
const pullListRepository: IPullListRepository<Db, Error | MongoError> = ({
  removeComicSeriesFromPullList,
} as unknown) as IPullListRepository<Db, Error | MongoError>

const context = {
  dataSources: {
    pullList: pullListRepository,
  },
  db: O.some({}),
  user: O.some('user'),
} as GraphQLContext

const info = {} as GraphQLResolveInfo
const parent = {}
const args = { comicSeriesId: defaultComicSeries._id }
