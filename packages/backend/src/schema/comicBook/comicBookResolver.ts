import { pipe } from 'fp-ts/lib/pipeable'
import { toNullable, map } from 'fp-ts/lib/Option'
import { Resolver, DataSources } from 'types/app'
import {
  QueryComicBookArgs,
  MutationScrapComicBookArgs,
  ComicBookDbObject,
  PublisherDbObject,
  ComicSeriesDbObject,
  MutationScrapSingleIssuesListArgs,
  MutationScrapCollectionsListArgs,
} from 'types/server-schema'
import { runRTEtoNullable, mapOtoRTEnullable, chainMaybeToNullable } from 'lib'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import { TaskEither } from 'fp-ts/lib/TaskEither'
import { MongoError } from 'mongodb'
import { ComicBookListData } from 'services/ScrapeService'

interface ComicBookQuery {
  // TODO: This actually returns a ComicBook but this is not what the function returns
  // but what is returned once all field resolvers are done
  comicBook: Resolver<ComicBookDbObject, QueryComicBookArgs>
}

interface ComicBookMutation {
  scrapComicBook: Resolver<ComicBookDbObject, MutationScrapComicBookArgs>
  scrapSingleIssuesList: Resolver<
    ComicBookDbObject[],
    MutationScrapSingleIssuesListArgs
  >
  scrapCollectionsList: Resolver<
    ComicBookDbObject[],
    MutationScrapCollectionsListArgs
  >
}

interface ComicBookResolver {
  ComicBook: {
    publisher: Resolver<PublisherDbObject, {}, ComicBookDbObject>
    comicSeries: Resolver<ComicSeriesDbObject, {}, ComicBookDbObject>
  }
}

export const ComicBookQuery: ComicBookQuery = {
  comicBook: (_, { id }, { dataSources, db }) =>
    pipe(
      db,
      map(runRTEtoNullable(dataSources.comicBook.getById(id))),
      toNullable,
    ),
}

function insertComicBookIfNotExisting(
  dataSources: DataSources,
  comicSeriesId: ComicSeriesDbObject['_id'],
) {
  return (comicBooks: ComicBookListData[]) => {
    return pipe(
      dataSources.comicBook.getByUrls(comicBooks.map(({ url }) => url)),
      RTE.map((existingComicBooks) => {
        const existingUrls = existingComicBooks.map(({ url }) => url)
        return comicBooks.filter(({ url }) => !existingUrls.includes(url))
      }),
      RTE.chain((comicBooks) =>
        // TODO: only insert comicBooks that are not already in the DB
        dataSources.comicBook.insertMany(
          comicBooks.map((book) => ({
            ...book,
            comicSeries: comicSeriesId,
            creators: [],
            publisher: null,
            coverImgUrl: null,
            releaseDate: null,
          })),
        ),
      ),
    )
  }
}

export const ComicBookMutation: ComicBookMutation = {
  scrapComicBook: (_, { comicBookUrl }, { dataSources, db, services }) =>
    pipe(
      db,
      map(
        runRTEtoNullable(
          pipe(
            RTE.fromTaskEither(services.scrape.getComicBook(comicBookUrl)),
            RTE.chainW((comicBook) =>
              dataSources.comicBook.enhanceWithScrapResult(
                comicBookUrl,
                comicBook,
              ),
            ),
          ),
        ),
      ),
      toNullable,
    ),
  scrapSingleIssuesList: (
    _,
    { comicSeriesId, comicBookListUrl },
    { dataSources, db, services },
  ) =>
    pipe(
      db,
      map(
        runRTEtoNullable(
          pipe(
            RTE.fromTaskEither(
              services.scrape.getComicBookList(comicBookListUrl) as TaskEither<
                MongoError,
                ComicBookListData[]
              >,
            ),
            RTE.chain(insertComicBookIfNotExisting(dataSources, comicSeriesId)),
            RTE.chainFirst((comicBooks) =>
              dataSources.comicSeries.addComicBooks(
                comicSeriesId,
                comicBooks.map(({ _id }) => _id),
              ),
            ),
          ),
        ),
      ),
      toNullable,
    ),
  scrapCollectionsList: (
    _,
    { comicSeriesId, comicBookListUrl },
    { dataSources, db, services },
  ) =>
    pipe(
      db,
      map(
        runRTEtoNullable(
          pipe(
            RTE.fromTaskEither(
              services.scrape.getComicBookList(comicBookListUrl) as TaskEither<
                MongoError,
                ComicBookListData[]
              >,
            ),
            RTE.chain(insertComicBookIfNotExisting(dataSources, comicSeriesId)),
            RTE.chainFirst((comicBooks) =>
              dataSources.comicSeries.addComicBookCollections(
                comicSeriesId,
                comicBooks.map(({ _id }) => _id),
              ),
            ),
          ),
        ),
      ),
      toNullable,
    ),
}

export const ComicBookResolver: ComicBookResolver = {
  ComicBook: {
    publisher: ({ publisher }, _, { dataSources, db }) =>
      chainMaybeToNullable(
        publisher,
        mapOtoRTEnullable(db, dataSources.publisher.getById),
      ),
    comicSeries: ({ comicSeries }, _, { dataSources, db }) =>
      chainMaybeToNullable(
        comicSeries,
        mapOtoRTEnullable(db, dataSources.comicSeries.getById),
      ),
  },
}
