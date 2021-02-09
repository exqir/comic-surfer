import type { GraphQLResolveInfo } from 'graphql'
import { Db, MongoError, ObjectID } from 'mongodb'
import { ApolloError, AuthenticationError } from 'apollo-server'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as O from 'fp-ts/lib/Option'

import type { PullListDbObject } from 'types/server-schema'
import type { GraphQLContext } from 'types/app'
import type { IPullListRepository } from 'models/PullList/PullList.interface'

import { pullList } from '../pullList.resolver'

describe('[Query.pullList]', () => {
  it('should throw an AuthenticationError when no valid user is context', async () => {
    const execute = () =>
      pullList(parent, args, { ...context, user: O.none }, info)

    await expect(execute).rejects.toThrowError(AuthenticationError)
  })

  it('should throw an ApolloError when no pullList was found', async () => {
    getPullListByOwner.mockReturnValueOnce(RTE.left(new MongoError('')))

    const execute = () => pullList(parent, args, context, info)

    await expect(execute).rejects.toThrowError(ApolloError)
  })

  it('should return PullList', async () => {
    const res = await pullList(parent, args, context, info)

    expect(res).toMatchObject(defaultPullList)
  })
})

const defaultPullList: PullListDbObject = {
  _id: new ObjectID(),
  owner: 'user',
  list: [],
}

const getPullListByOwner = jest.fn().mockReturnValue(RTE.right(defaultPullList))
const pullListRepository: IPullListRepository<Db, Error | MongoError> = ({
  getPullListByOwner,
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
const args = {}
