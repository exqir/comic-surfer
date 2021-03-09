import { pipe } from 'fp-ts/lib/function'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'

import type { NonNullableResolver } from 'types/app'
import type { PullListDbObject } from 'types/graphql-schema'
import { nonNullableField } from 'lib'
import { getUser } from 'functions/user'
import { getByOwner } from 'functions/pullList'

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
