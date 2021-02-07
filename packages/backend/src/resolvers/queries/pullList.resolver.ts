import { pipe } from 'fp-ts/lib/function'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'

import type { PullListDbObject } from 'types/server-schema'
import { NonNullableResolver } from 'types/app'
import { nonNullableField } from 'lib'
import { getUser } from 'lib/user'
import { getByOwner } from 'lib/pullList'

export const pullList: NonNullableResolver<PullListDbObject, {}> = (
  _,
  __,
  { dataSources, db, user },
) =>
  pipe(
    db,
    nonNullableField(
      pipe(getUser(user), RTE.chain(getByOwner(dataSources.pullList))),
    ),
  )
