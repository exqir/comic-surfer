import { pipe } from 'fp-ts/lib/function'

import type { Resolver } from 'types/app'
import type {
  QueryComicBookArgs,
  ComicBookDbObject,
} from 'types/graphql-schema'
import { nullableField } from 'lib'
import { getById } from 'functions/common'

export const comicBook: Resolver<ComicBookDbObject, QueryComicBookArgs> = (
  _,
  { id },
  { dataSources, db },
) => pipe(db, nullableField(pipe(id, getById(dataSources.comicBook))))
