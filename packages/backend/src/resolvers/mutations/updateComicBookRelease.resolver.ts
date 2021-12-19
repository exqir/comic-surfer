import type { Db, MongoError, ObjectID } from 'mongodb'
import { ApolloError } from 'apollo-server'
import { flow, pipe } from 'fp-ts/lib/function'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as E from 'fp-ts/lib/Either'

import type {
  ComicBookDbObject,
  MutationUpdateComicBookReleaseArgs,
} from 'types/graphql-schema'
import type { Resolver } from 'types/app'
import type { ComicBookData } from 'services/Scraper/Scraper.interface'
import type { IComicBookRepository } from 'models/ComicBook/ComicBook.interface'
import { nullableField } from 'lib'
import { getById } from 'functions/common'
import { getComicBookByUrl } from 'functions/scraper'

export const updateComicBookRelease: Resolver<
  ComicBookDbObject,
  MutationUpdateComicBookReleaseArgs
> = (_, { comicBookId }, { dataSources, services, db }) =>
  pipe(
    db,
    nullableField(
      pipe(
        comicBookId,
        getById(dataSources.comicBook),
        RTE.chainW(
          flow(getComicBookByUrl(services.scrape), RTE.fromTaskEither),
        ),
        RTE.chain(pipe(comicBookId, updateRelease(dataSources.comicBook))),
      ),
    ),
  )

function updateRelease(
  repo: IComicBookRepository<Db, Error | MongoError>,
): (
  comicBookId: ObjectID,
) => (
  comicBook: ComicBookData,
) => RTE.ReaderTaskEither<Db, Error | MongoError, ComicBookDbObject> {
  return (comicBookId) => ({ releaseDate }) =>
    pipe(
      releaseDate,
      E.fromOption(
        () =>
          new ApolloError(
            'ComicBook is missing a release date.',
            'COMIC_BOOK_MISSING_RELEASE_DATE',
          ),
      ),
      RTE.fromEither,
      RTE.chain((rd) => repo.updateReleaseDate(comicBookId, rd)),
    )
}
