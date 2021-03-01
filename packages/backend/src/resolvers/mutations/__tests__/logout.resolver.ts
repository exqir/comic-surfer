import type { GraphQLResolveInfo } from 'graphql'
import { constVoid } from 'fp-ts/lib/function'
import * as IO from 'fp-ts/lib/IO'
import * as T from 'fp-ts/lib/Task'
import * as O from 'fp-ts/lib/Option'

import type { GraphQLContext } from 'types/app'
import type { IAuthentication } from 'services/Authentication'

import { logout } from '../logout.resolver'

describe('[Mutation.logout]', () => {
  it('should return true when user was logged out', async () => {
    const res = await logout(parent, args, context, info)

    expect(res).toBe(true)
  })
})

const logoutUser = jest.fn().mockReturnValue(T.of(constVoid))
const removeSessionCookie = jest.fn().mockReturnValue(IO.of(constVoid))
const authenticationService: IAuthentication = ({
  logoutUser,
  removeSessionCookie,
} as unknown) as IAuthentication

const context = {
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
