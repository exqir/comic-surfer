import { pipe } from 'fp-ts/lib/function'

import type { Resolver } from 'types/app'
import type { QueryComicBookArgs, ComicBookDbObject } from 'types/server-schema'
import { nullableField } from 'lib'
import { getById } from 'lib/common'

export const comicBook: Resolver<ComicBookDbObject, QueryComicBookArgs> = (
  _,
  { id },
  { dataSources, db },
) => pipe(db, nullableField(pipe(id, getById(dataSources.comicBook))))
