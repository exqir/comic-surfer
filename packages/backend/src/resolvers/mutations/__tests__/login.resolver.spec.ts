import type { GraphQLResolveInfo } from 'graphql'
import { Db, MongoError } from 'mongodb'
import { AuthenticationError, ApolloError } from 'apollo-server'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as TE from 'fp-ts/lib/TaskEither'
import * as O from 'fp-ts/lib/Option'

import type { GraphQLContext } from 'types/app'
import type { IPullListRepository } from 'models/PullList/PullList.interface'
import type { IAuthentication } from 'services/Authentication'
import { Authentication } from 'services/Authentication'
import { defaultPullList } from '__mocks__/PullList.mock'
import { defaultSession } from '__mocks__/Session.mock'

import { login } from '../login.resolver'

describe('[Mutation.login]', () => {
  it('should throw an AuthenticationError in case of an Error while creating a session', async () => {
    getSessionFromHeaders.mockReturnValueOnce(TE.left(new Error()))

    const execute = () => login(parent, args, context, info)

    expect(execute).rejects.toThrowError(AuthenticationError)
  })

  it('should throw an AuthenticationError in case of an Error while creating a token', async () => {
    setSessionCookie.mockReturnValueOnce(TE.left(new Error()))

    const execute = () => login(parent, args, context, info)

    expect(execute).rejects.toThrowError(AuthenticationError)
  })

  it('should throw an ApolloError in case of an Error while getting PullList', async () => {
    getOrCreatePullList.mockReturnValueOnce(RTE.left(new Error()))

    const execute = () => login(parent, args, context, info)

    expect(execute).rejects.toThrowError(ApolloError)
  })

  it('should request PullList from Session issuer', async () => {
    await login(parent, args, context, info)

    expect(getOrCreatePullList).toHaveBeenCalledWith(defaultSession.issuer)
  })

  it('should return PullList of user', async () => {
    const res = await login(parent, args, context, info)

    expect(res).toMatchObject(defaultPullList)
  })
})

const getSessionFromHeaders = jest
  .fn()
  .mockReturnValue(TE.right(defaultSession))
const setSessionCookie = jest.fn().mockReturnValue(TE.right('encryptedToken'))
const authenticationService: IAuthentication = ({
  getSessionFromHeaders,
  setSessionCookie,
  getSessionIssuer: Authentication.getSessionIssuer,
} as unknown) as IAuthentication

const getOrCreatePullList = jest
  .fn()
  .mockReturnValue(RTE.right(defaultPullList))
const pullListRepository: IPullListRepository<Db, Error | MongoError> = ({
  getOrCreatePullList: getOrCreatePullList,
} as unknown) as IPullListRepository<Db, Error | MongoError>

const context = {
  dataSources: {
    pullList: pullListRepository,
  },
  services: {
    authentication: authenticationService,
  },
  db: O.some({}),
  res: {},
  req: {},
} as GraphQLContext

const info = {} as GraphQLResolveInfo
const parent = {}
const args = {}
