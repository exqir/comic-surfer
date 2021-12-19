import type { Db, MongoError } from 'mongodb'
import { ApolloError } from 'apollo-server'
import { pipe } from 'fp-ts/lib/function'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as E from 'fp-ts/lib/Either'

import type { PublisherDbObject } from 'types/graphql-schema'
import type { ComicBookData } from 'services/Scraper/Scraper.interface'
import type { IPublisherRepository } from 'models/Publisher/Publisher.interface'
import { getUrl } from './common'

export function getComicBookPublisherByUrl(
  repo: IPublisherRepository<Db, Error | MongoError>,
): (
  comicBookData: ComicBookData,
) => RTE.ReaderTaskEither<Db, Error | MongoError, PublisherDbObject> {
  return ({ publisher }) =>
    pipe(
      publisher,
      E.fromOption(
        () =>
          new ApolloError(
            'ComicBook is missing a publisher.',
            'COMIC_BOOK_PUBLISHER_NOT_FOUND',
          ),
      ),
      E.map(getUrl),
      RTE.fromEither,
      RTE.chain(repo.getByUrl),
    )
}
