import { ApolloError } from 'apollo-server'
import { pipe, flow } from 'fp-ts/lib/function'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as TE from 'fp-ts/lib/TaskEither'
import * as E from 'fp-ts/lib/Either'

import type { Maybe } from 'types/graphql-schema'
import type {
  IScraperService,
  ComicBookData,
  ComicBookListData,
} from 'services/Scraper/Scraper.interface'
import type { IWithUrl } from 'types/common'
import { getUrl } from 'functions/common'

export interface IMaybeWithUrl {
  url: Maybe<string>
}

export function getComicBookByUrl(
  scraper: IScraperService,
): (entity: IWithUrl) => TE.TaskEither<Error, ComicBookData> {
  return flow(getUrl, scraper.getComicBook)
}

export function getComicBookList<T extends IMaybeWithUrl>(
  scraper: IScraperService,
): (withUrl: T) => RTE.ReaderTaskEither<any, Error, ComicBookListData> {
  return ({ url }) =>
    pipe(
      url,
      E.fromNullable(
        new ApolloError(
          'Entity is missing a source for ComicBooks.',
          'MISSING_URL',
        ),
      ),
      TE.fromEither,
      TE.chain(scraper.getComicBookList),
      RTE.fromTaskEither,
    )
}
