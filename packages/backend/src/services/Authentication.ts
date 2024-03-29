import Iron from '@hapi/iron'
import { serialize, parse } from 'cookie'
import { Response, Request } from 'express'
import * as O from 'fp-ts/lib/Option'
import * as T from 'fp-ts/lib/Task'
import * as E from 'fp-ts/lib/Either'
import * as TE from 'fp-ts/lib/TaskEither'
import * as IO from 'fp-ts/lib/IO'
import { pipe } from 'fp-ts/lib/pipeable'
import { Magic } from '@magic-sdk/admin'

const TOKEN_NAME = 'token'
const MAX_AGE = 60 * 60 * 8 // 8 hours
const TOKEN_SECRET =
  process.env.TOKEN_SECRET ||
  'this-is-a-secret-value-with-at-least-32-characters'
const MAGIC_APY_KEY =
  process.env.MAGIC_APY_KEY || 'this-super-secret-key-for-magic'

const magic = new Magic(MAGIC_APY_KEY)

export type Session = {
  issuer: string
}

// TODO: can fail
function encryptSession(session: Session): T.Task<string> {
  return () => Iron.seal(session, TOKEN_SECRET, Iron.defaults)
}
// TODO: can fail
function decryptSession(token: string): T.Task<Session> {
  return () => Iron.unseal(token, TOKEN_SECRET, Iron.defaults)
}

function setTokenCookie(res: Response) {
  return (token: string): IO.IO<void> => () => {
    const cookie = serialize(TOKEN_NAME, token, {
      maxAge: MAX_AGE,
      expires: new Date(Date.now() + MAX_AGE * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      // TODO: With serving API and App from the same domain, this could be changed back to lax
      sameSite: 'none',
    })
    res.setHeader('Set-Cookie', cookie)
  }
}

function removeTokenCookie(res: Response): IO.IO<void> {
  return () => {
    const cookie = serialize(TOKEN_NAME, '', {
      maxAge: -1,
      path: '/',
    })

    res.setHeader('Set-Cookie', cookie)
  }
}

function logoutUser(req: Request): T.Task<void> {
  return pipe(
    getUserFromSession(req),
    T.chain(
      O.fold(
        () => () => Promise.resolve(),
        (user) => () => magic.users.logoutByIssuer(user),
      ),
    ),
  )
}

function parseCookies(req: Request) {
  return parse(req.headers.cookie || '')
}

function getTokenCookie(req: Request): O.Option<string> {
  return O.fromNullable(parseCookies(req)[TOKEN_NAME])
}

function getSessionFromCookie(req: Request): T.Task<O.Option<Session>> {
  return pipe(
    getTokenCookie(req),
    O.fold(
      () => T.of(O.none),
      (t) => T.map(O.some)(decryptSession(t)),
    ),
  )
}

function getSessionIssuer(session: Session): string {
  return session.issuer
}

function getUserFromSession(req: Request): T.Task<O.Option<string>> {
  return pipe(getSessionFromCookie(req), T.map(O.map(getSessionIssuer)))
}

function getTokenFromHeaders(req: Request): E.Either<Error, string> {
  return E.tryCatch(
    () => magic.utils.parseAuthorizationHeader(req.headers.authorization ?? ''),
    (e) => e as Error,
  )
}

function getSessionByToken(token: string): TE.TaskEither<Error, Session> {
  return pipe(
    TE.tryCatch(
      () => magic.users.getMetadataByToken(token),
      (e) => e as Error,
    ),
    TE.chain(({ issuer }) =>
      issuer
        ? TE.right({ issuer })
        : TE.left(new Error('Failed to identify User')),
    ),
  )
}

function getSessionFromHeaders(req: Request) {
  return pipe(
    getTokenFromHeaders(req),
    TE.fromEither,
    TE.chain(getSessionByToken),
  )
}

function setSessionCookie(
  session: Session,
  res: Response,
): TE.TaskEither<Error, string> {
  return pipe(
    encryptSession(session),
    T.map<string, E.Either<Error, string>>(E.right),
    TE.map((token) => {
      setTokenCookie(res)(token)()
      return token
    }),
  )
}

export const Authentication = {
  getSessionFromHeaders,
  setSessionCookie,
  getUserFromSession,
  getSessionIssuer,
  removeSessionCookie: removeTokenCookie,
  logoutUser,
}

// TODO: Create interface for Authentication service
export type IAuthentication = typeof Authentication
