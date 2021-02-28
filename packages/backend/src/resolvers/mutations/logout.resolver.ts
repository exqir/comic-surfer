import type { Response, Request } from 'express'
import { constTrue, flow, pipe } from 'fp-ts/lib/function'
import * as T from 'fp-ts/lib/Task'

import type { NonNullableResolver } from 'types/app'
import type { IAuthentication } from 'services/Authentication'

export const logout: NonNullableResolver<boolean, {}> = (
  _,
  __,
  { services, req, res },
) =>
  pipe(
    req,
    endUserSession(services.authentication),
    T.map(removeSessionCookie(services.authentication)(res)),
    T.map(constTrue),
  )()

function endUserSession(
  service: IAuthentication,
): (req: Request) => T.Task<void> {
  return service.logoutUser
}

function removeSessionCookie(
  service: IAuthentication,
): (res: Response) => T.Task<void> {
  return flow(service.removeSessionCookie, T.fromIO)
}
