import type { Db, MongoError, ObjectID } from 'mongodb'
import { flow, pipe } from 'fp-ts/lib/function'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'

import type {
  ComicBookDbObject,
  PublisherDbObject,
  MutationUpdateComicBookArgs,
} from 'types/graphql-schema'
import type { Resolver } from 'types/app'
import type { ComicBookData } from 'services/ScrapeService'
import type {
  IComicBookRepository,
  IComicBookDetails,
} from 'models/ComicBook/ComicBook.interface'
import { nullableField } from 'lib'
import { getById } from 'functions/common'
import { getComicBookPublisherByUrl } from 'functions/publisher'
import { getComicBookByUrl } from 'functions/scraper'

export const updateComicBook: Resolver<
  ComicBookDbObject,
  MutationUpdateComicBookArgs
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
        RTE.chain(
          replacePublisherWithId(
            getComicBookPublisherByUrl(dataSources.publisher),
          ),
        ),
        RTE.chain(
          pipe(comicBookId, updateComicBookData(dataSources.comicBook)),
        ),
      ),
    ),
  )

function updateComicBookData(
  repo: IComicBookRepository<Db, Error | MongoError>,
): (
  comicBookId: ObjectID,
) => (
  comicBook: IComicBookDetails,
) => RTE.ReaderTaskEither<Db, Error | MongoError, ComicBookDbObject> {
  return (comicBookId) => (comicBook) =>
    repo.updateComicBookDetails(comicBookId, comicBook)
}

function replacePublisherWithId(
  getPublisherByUrl: (
    comicBook: ComicBookData,
  ) => RTE.ReaderTaskEither<Db, Error | MongoError, PublisherDbObject>,
): (
  comicBook: ComicBookData,
) => RTE.ReaderTaskEither<Db, Error | MongoError, IComicBookDetails> {
  return (comicBook) =>
    pipe(
      comicBook,
      getPublisherByUrl,
      RTE.map((publisher) => ({
        ...comicBook,
        publisher: publisher._id,
      })),
    )
}
