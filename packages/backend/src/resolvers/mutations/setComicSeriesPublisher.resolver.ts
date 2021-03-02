import type { Db, MongoError, ObjectID } from 'mongodb'
import { ApolloError } from 'apollo-server'
import { pipe } from 'fp-ts/lib/function'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as TE from 'fp-ts/lib/TaskEither'
import * as E from 'fp-ts/lib/Either'
import * as A from 'fp-ts/lib/Array'

import type {
  ComicSeriesDbObject,
  PublisherDbObject,
  MutationSetComicSeriesPublisherArgs,
} from 'types/graphql-schema'
import type { Resolver } from 'types/app'
import type {
  ComicBookListData,
  ComicBookData,
  IScraper,
} from 'services/ScrapeService'
import type { IPublisherRepository } from 'models/Publisher/Publisher.interface'
import { nullableField } from 'lib'
import { getById } from 'lib/common'
import { getComicBookByUrl } from 'lib/scraper'
import { IComicSeriesRepository } from 'models/ComicSeries/ComicSeries.interface'

export const setComicSeriesPublisher: Resolver<
  ComicSeriesDbObject,
  MutationSetComicSeriesPublisherArgs
> = (_, { comicSeriesId }, { dataSources, services, db }) =>
  pipe(
    db,
    nullableField(
      pipe(
        comicSeriesId,
        getById(dataSources.comicSeries),
        RTE.chain(getComicBookList(services.scrape)),
        RTE.chain(getFirstComicBookFromList(services.scrape)),
        RTE.chain(getComicBookPublisherByUrl(dataSources.publisher)),
        RTE.chain(
          pipe(comicSeriesId, addComicSeriesToPublisher(dataSources.publisher)),
        ),
        RTE.chain(
          pipe(
            comicSeriesId,
            setPublisherForComicSeries(dataSources.comicSeries),
          ),
        ),
      ),
    ),
  )

function getComicBookList(
  scraper: IScraper,
): (
  comicSeries: ComicSeriesDbObject,
) => RTE.ReaderTaskEither<any, Error, ComicBookListData> {
  return ({ singleIssuesUrl }) =>
    pipe(
      singleIssuesUrl,
      E.fromNullable(
        new ApolloError(
          'ComicSeries is missing a source for single issues.',
          'COMIC_SERIES_MISSING_SINGLE_ISSUES_URL',
        ),
      ),
      TE.fromEither,
      TE.chain(scraper.getComicBookList),
      RTE.fromTaskEither,
    )
}

function getFirstComicBookFromList(
  scraper: IScraper,
): (
  comicBookList: ComicBookListData,
) => RTE.ReaderTaskEither<any, Error, ComicBookData> {
  return ({ comicBookList }) =>
    pipe(
      A.head(comicBookList),
      TE.fromOption(
        () =>
          new ApolloError(
            'ComicSeries has an empty list of ComicBooks.',
            'COMIC_SERIES_EMPTY_COMIC_BOOK_LIST',
          ),
      ),
      TE.chain(getComicBookByUrl(scraper)),
      RTE.fromTaskEither,
    )
}

function getComicBookPublisherByUrl(
  repo: IPublisherRepository<Db, Error | MongoError>,
): (
  comicBookData: ComicBookData,
) => RTE.ReaderTaskEither<Db, Error | MongoError, PublisherDbObject> {
  return ({ publisher }) =>
    pipe(
      publisher?.url,
      E.fromNullable(
        new ApolloError(
          'ComicBook is missing a publisher.',
          'COMIC_BOOK_PUBLISHER_NOT_FOUND',
        ),
      ),
      RTE.fromEither,
      RTE.chain(repo.getByUrl),
    )
}

function addComicSeriesToPublisher(
  repo: IPublisherRepository<Db, Error | MongoError>,
): (
  comicSeriesId: ObjectID,
) => (
  publisher: PublisherDbObject,
) => RTE.ReaderTaskEither<Db, Error | MongoError, PublisherDbObject> {
  return (comicSeriesId) => ({ _id: publisherId }) =>
    repo.addComicSeries(publisherId, comicSeriesId)
}

function setPublisherForComicSeries(
  repo: IComicSeriesRepository<Db, Error | MongoError>,
): (
  comicSeriesId: ObjectID,
) => (
  publisher: PublisherDbObject,
) => RTE.ReaderTaskEither<Db, Error | MongoError, ComicSeriesDbObject> {
  return (comicSeriesId) => ({ _id: publisherId }) =>
    repo.setPublisher(comicSeriesId, publisherId)
}
