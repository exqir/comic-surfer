import type { Db, MongoError } from 'mongodb'
import type { Response, Request } from 'express'
import { AuthenticationError, ApolloError } from 'apollo-server'
import { flow, pipe } from 'fp-ts/lib/function'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as TE from 'fp-ts/lib/TaskEither'

import type { PullListDbObject } from 'types/graphql-schema'
import type { NonNullableResolver } from 'types/app'
import type { IAuthentication, Session } from 'services/Authentication'
import { IPullListRepository } from 'models/PullList/PullList.interface'
import { nonNullableField } from 'lib'

export const login: NonNullableResolver<PullListDbObject, {}> = (
  _,
  __,
  { dataSources, db, services, req, res },
) =>
  pipe(
    db,
    nonNullableField(
      pipe(
        [req, res],
        createUserSession(services.authentication),
        TE.map(getUserFromSession(services.authentication)),
        RTE.fromTaskEither,
        RTE.chain(getOrCreatePullListByOwner(dataSources.pullList)),
      ),
    ),
  )

function createUserSession(
  service: IAuthentication,
): ([req, res]: [Request, Response]) => TE.TaskEither<
  AuthenticationError,
  Session
> {
  return ([req, res]) =>
    pipe(
      req,
      createSessionFromRequest(service),
      TE.chainFirst(setSessionCookie(service)(res)),
      TE.mapLeft(
        () => new AuthenticationError('User could not be authenticated.'),
      ),
    )
}

function getOrCreatePullListByOwner(
  repo: IPullListRepository<Db, Error | MongoError>,
): (owner: string) => RTE.ReaderTaskEither<Db, ApolloError, PullListDbObject> {
  return flow(
    repo.getOrCreatePullList,
    RTE.mapLeft(
      () => new ApolloError('User has no PullList.', 'PULLLIST_NOT_FOUND'),
    ),
  )
}

function createSessionFromRequest(
  service: IAuthentication,
): (req: Request) => TE.TaskEither<Error, Session> {
  return flow(service.getSessionFromHeaders)
}

function getUserFromSession(
  service: IAuthentication,
): (session: Session) => Session['issuer'] {
  return flow(service.getSessionIssuer)
}

function setSessionCookie(
  service: IAuthentication,
): (res: Response) => (session: Session) => TE.TaskEither<Error, string> {
  return (res) => (session) => service.setSessionCookie(session, res)
}
