import type { Db, MongoError, ObjectID } from 'mongodb'
import { ApolloError } from 'apollo-server'
import { pipe } from 'fp-ts/lib/function'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as TE from 'fp-ts/lib/TaskEither'
import * as A from 'fp-ts/lib/Array'

import type {
  ComicSeriesDbObject,
  PublisherDbObject,
  MutationUpdateComicSeriesPublisherArgs,
} from 'types/graphql-schema'
import type { Resolver } from 'types/app'
import type {
  ComicBookListData,
  ComicBookData,
  IScraperService,
} from 'services/Scraper/Scraper.interface'
import type { IPublisherRepository } from 'models/Publisher/Publisher.interface'
import type { IComicSeriesRepository } from 'models/ComicSeries/ComicSeries.interface'
import { nullableField } from 'lib'
import { getById } from 'functions/common'
import { getComicBookPublisherByUrl } from 'functions/publisher'
import { getComicBookByUrl, getComicBookList } from 'functions/scraper'

export const updateComicSeriesPublisher: Resolver<
  ComicSeriesDbObject,
  MutationUpdateComicSeriesPublisherArgs
> = (_, { comicSeriesId }, { dataSources, services, db }) =>
  pipe(
    db,
    nullableField(
      pipe(
        comicSeriesId,
        getById(dataSources.comicSeries),
        RTE.map(({ singleIssuesUrl: url }) => ({ url })),
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

function getFirstComicBookFromList(
  scraper: IScraperService,
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
