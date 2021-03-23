import type { Db, MongoError, ObjectID } from 'mongodb'
import { pipe } from 'fp-ts/lib/function'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as O from 'fp-ts/lib/Option'

import type {
  ComicBookDbObject,
  ComicSeriesDbObject,
  PublisherDbObject,
  MutationAddComicBookArgs,
} from 'types/graphql-schema'
import type { Resolver } from 'types/app'
import type { ComicBookData } from 'services/Scraper/Scraper.interface'
import type {
  IComicBookRepository,
  NewComicBook,
} from 'models/ComicBook/ComicBook.interface'
import type { IComicSeriesRepository } from 'models/ComicSeries/ComicSeries.interface'
import { toObjectId } from 'datasources/MongoDataSource'
import { ComicBookType } from 'types/graphql-schema'
import { nullableField } from 'lib'
import { getComicBookPublisherByUrl } from 'functions/publisher'
import { getComicBookByUrl } from 'functions/scraper'

export const addComicBook: Resolver<
  ComicBookDbObject,
  MutationAddComicBookArgs
> = (
  _,
  { comicBookUrl, comicSeriesId, comicBookType },
  { dataSources, services, db },
) =>
  pipe(
    db,
    nullableField(
      pipe(
        { url: comicBookUrl },
        getComicBookByUrl(services.scrape),
        RTE.fromTaskEither,
        RTE.chain(
          replacePublisherWithId(
            getComicBookPublisherByUrl(dataSources.publisher),
          ),
        ),
        RTE.map(addToComicBookData([comicSeriesId, comicBookType])),
        RTE.chain(addNewComicBook(dataSources.comicBook)),
        RTE.chainFirst(
          pipe(comicSeriesId, addComicBookToSeries(dataSources.comicSeries)),
        ),
      ),
    ),
  )

function addNewComicBook(
  repo: IComicBookRepository<Db, Error | MongoError>,
): (
  comicBook: NewComicBook,
) => RTE.ReaderTaskEither<Db, Error | MongoError, ComicBookDbObject> {
  return (comicBook) => repo.addComicBook(comicBook)
}

type PartialComicBook = Omit<NewComicBook, 'type' | 'comicSeries'>

function replacePublisherWithId(
  getPublisherByUrl: (
    comicBook: ComicBookData,
  ) => RTE.ReaderTaskEither<Db, Error | MongoError, PublisherDbObject>,
): (
  comicBook: ComicBookData,
) => RTE.ReaderTaskEither<Db, Error | MongoError, PartialComicBook> {
  return (comicBook) =>
    pipe(
      comicBook,
      getPublisherByUrl,
      RTE.map((publisher) => ({
        ...comicBook,
        releaseDate: O.toNullable(comicBook.releaseDate),
        description: O.toNullable(comicBook.description),
        issueNo: O.toNullable(comicBook.issueNo),
        publisher: publisher._id,
      })),
    )
}

function addToComicBookData([comicSeriesId, comicBookType]: [
  ObjectID,
  ComicBookType,
]): (comicBookData: PartialComicBook) => NewComicBook {
  return (comicBookData) => ({
    ...comicBookData,
    comicSeries: toObjectId(comicSeriesId),
    type: comicBookType,
  })
}

function addComicBookToSeries(
  repo: IComicSeriesRepository<Db, Error | MongoError>,
): (
  comicSeriesId: ObjectID,
) => (
  comicBook: ComicBookDbObject,
) => RTE.ReaderTaskEither<Db, Error | MongoError, ComicSeriesDbObject> {
  return (comicSeriesId) => (comicBook) =>
    repo.addComicBook(
      comicSeriesId,
      comicBook._id,
      comicBook.type as ComicBookType,
    )
}
