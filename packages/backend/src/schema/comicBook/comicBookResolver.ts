import { pipe } from 'fp-ts/lib/pipeable'
import { toNullable, map } from 'fp-ts/lib/Option'
import { Resolver, NonNullableResolver, DataSources } from 'types/app'
import {
  QueryComicBookArgs,
  MutationScrapComicBookArgs,
  ComicBookDbObject,
  PublisherDbObject,
  ComicSeriesDbObject,
  MutationScrapSingleIssuesListArgs,
  MutationScrapCollectionsListArgs,
  MutationUpdateComicBookReleaseArgs,
  ComicBookType,
} from 'types/server-schema'
import {
  runRTEtoNullable,
  mapOtoRTEnullable,
  chainMaybeToNullable,
  nonNullableField,
  nullableField,
  runRT,
} from 'lib'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as O from 'fp-ts/lib/Option'
import { TaskEither } from 'fp-ts/lib/TaskEither'
import { MongoError } from 'mongodb'
import { ComicBookListData, ComicBookData } from 'services/ScrapeService'
import { TaskType } from 'datasources/QueueRepository'
import { toObjectId } from 'datasources/MongoDataSource'
import { ApolloError } from 'apollo-server'

interface ComicBookQuery {
  // TODO: This actually returns a ComicBook but this is not what the function returns
  // but what is returned once all field resolvers are done
  comicBook: Resolver<ComicBookDbObject, QueryComicBookArgs>
}

interface ComicBookMutation {
  scrapComicBook: NonNullableResolver<
    ComicBookDbObject,
    MutationScrapComicBookArgs
  >
  scrapSingleIssuesList: NonNullableResolver<
    ComicBookDbObject[],
    MutationScrapSingleIssuesListArgs
  >
  scrapCollectionsList: NonNullableResolver<
    ComicBookDbObject[],
    MutationScrapCollectionsListArgs
  >
  updateComicBooks: NonNullableResolver<ComicBookDbObject[], {}>
  updateComicBookRelease: NonNullableResolver<
    ComicBookDbObject,
    MutationUpdateComicBookReleaseArgs
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
    nullableField(db, runRTEtoNullable(dataSources.comicBook.getById(id))),
}

function insertComicBookIfNotExisting(
  dataSources: DataSources,
  comicSeriesId: ComicSeriesDbObject['_id'],
  type: ComicBookType,
) {
  return ({ comicBookList: comicBooks, nextPage }: ComicBookListData) => {
    return pipe(
      dataSources.comicBook.getByUrls(comicBooks.map(({ url }) => url)),
      RTE.map((existingComicBooks) => {
        const existingUrls = existingComicBooks.map(({ url }) => url)
        return comicBooks.filter(({ url }) => !existingUrls.includes(url))
      }),
      RTE.chain((remainingComicBooks) =>
        dataSources.comicBook.insertMany(
          remainingComicBooks.map((book) => ({
            ...book,
            comicSeries: toObjectId(comicSeriesId),
            creators: [],
            publisher: null,
            coverImgUrl: null,
            releaseDate: null,
            type,
          })),
        ),
      ),
      RTE.map((remainingComicBooks) => ({
        comicBooks: remainingComicBooks,
        containsKnownBooks: comicBooks.length !== remainingComicBooks.length,
        nextPage,
      })),
    )
  }
}

function addNextPageToQueue(
  dataSources: DataSources,
  comicSeriesId: ComicSeriesDbObject['_id'],
  type: ComicBookType,
) {
  return ({
    containsKnownBooks,
    nextPage,
  }: {
    comicBooks: ComicBookDbObject[]
    containsKnownBooks: boolean
    nextPage: string
  }) =>
    containsKnownBooks || nextPage === '' || nextPage === '#'
      ? // Because we use chainFirst the value will never be used in this case
        // We just use MongoError to keep the expected Type consistent between the different cases
        RTE.right({})
      : dataSources.queue.insert({
          type:
            type === ComicBookType.SINGLEISSUE
              ? TaskType.SCRAPSINGLEISSUELIST
              : TaskType.SCRAPCOLLECTIONLIST,
          data: { url: nextPage, comicSeriesId },
        })
}

function addPublisherToComicBook(dataSources: DataSources) {
  return (comicBook: ComicBookData) =>
    !comicBook.publisher
      ? RTE.right({ ...comicBook, publisher: null })
      : pipe(
          dataSources.publisher.getByUrl(comicBook.publisher.url),
          RTE.map((publisher) => ({
            ...comicBook,
            publisher: publisher ? publisher._id : null,
          })),
        )
}

export const ComicBookMutation: ComicBookMutation = {
  scrapComicBook: (_, { comicBookUrl }, { dataSources, db, services }) =>
    nonNullableField(
      db,
      runRT(
        pipe(
          RTE.fromTaskEither(services.scrape.getComicBook(comicBookUrl)),
          RTE.chainW(addPublisherToComicBook(dataSources)),
          RTE.chainW((comicBook) =>
            dataSources.comicBook.enhanceWithScrapResult(
              comicBookUrl,
              comicBook,
            ),
          ),
          RTE.chainW((comicBook) =>
            RTE.fromOption(() => null)(O.fromNullable(comicBook)),
          ),
          RTE.getOrElse(() => {
            throw new ApolloError(
              `Failed to scrap ComicBook from ${comicBookUrl}.`,
            )
          }),
        ),
      ),
    ),
  scrapSingleIssuesList: (
    _,
    { comicSeriesId, comicBookListUrl },
    { dataSources, db, services },
  ) =>
    nonNullableField(
      db,
      runRT(
        pipe(
          RTE.fromTaskEither(
            services.scrape.getComicBookList(comicBookListUrl),
          ),
          RTE.chainW(
            insertComicBookIfNotExisting(
              dataSources,
              comicSeriesId,
              ComicBookType.SINGLEISSUE,
            ),
          ),
          RTE.chainFirstW(
            addNextPageToQueue(
              dataSources,
              comicSeriesId,
              ComicBookType.SINGLEISSUE,
            ),
          ),
          RTE.chainFirstW(({ comicBooks }) =>
            dataSources.queue.insertMany(
              comicBooks.map(({ url }) => ({
                type: TaskType.SCRAPCOMICBOOK,
                data: { comicBookUrl: url },
              })),
            ),
          ),
          RTE.chainFirstW(({ comicBooks }) =>
            dataSources.comicSeries.addComicBooks(
              comicSeriesId,
              comicBooks.map(({ _id }) => _id),
            ),
          ),
          RTE.map(({ comicBooks }) => comicBooks),
          RTE.getOrElse(() => {
            throw new ApolloError(
              `Failed to scrap single issues for ComicSeries ${comicSeriesId} from ${comicBookListUrl}.`,
            )
          }),
        ),
      ),
    ),
  scrapCollectionsList: (
    _,
    { comicSeriesId, comicBookListUrl },
    { dataSources, db, services },
  ) =>
    nonNullableField(
      db,
      runRT(
        pipe(
          RTE.fromTaskEither(
            services.scrape.getComicBookList(comicBookListUrl) as TaskEither<
              MongoError,
              ComicBookListData
            >,
          ),
          RTE.chain(
            insertComicBookIfNotExisting(
              dataSources,
              comicSeriesId,
              ComicBookType.COLLECTION,
            ),
          ),
          RTE.chainFirst(
            addNextPageToQueue(
              dataSources,
              comicSeriesId,
              ComicBookType.COLLECTION,
            ),
          ),
          RTE.chainFirst(({ comicBooks }) =>
            dataSources.queue.insertMany(
              comicBooks.map(({ url }) => ({
                type: TaskType.SCRAPCOMICBOOK,
                data: { comicBookUrl: url },
              })),
            ),
          ),
          RTE.chainFirst(({ comicBooks }) =>
            dataSources.comicSeries.addComicBookCollections(
              comicSeriesId,
              comicBooks.map(({ _id }) => _id),
            ),
          ),
          RTE.map(({ comicBooks }) => comicBooks),
          RTE.getOrElse(() => {
            throw new ApolloError(
              `Failed to scrap collections for ComicSeries ${comicSeriesId} from ${comicBookListUrl}.`,
            )
          }),
        ),
      ),
    ),
  updateComicBooks: (_, __, { dataSources, db }) =>
    nonNullableField(
      db,
      runRT(
        pipe(
          dataSources.comicBook.getUpcoming(),
          RTE.chainFirst((comicBooks) =>
            dataSources.queue.insertMany(
              comicBooks.map(({ _id, url }) => ({
                type: TaskType.UPDATECOMICBOOKRELEASE,
                data: { comicBookId: _id, url },
              })),
            ),
          ),
          RTE.getOrElse(() => {
            throw new ApolloError(
              `Failed to trigger updating ComicBook release dates.`,
            )
          }),
        ),
      ),
    ),
  updateComicBookRelease: (_, { comicBookId }, { dataSources, db, services }) =>
    nonNullableField(
      db,
      runRT(
        pipe(
          dataSources.comicBook.getById(comicBookId),
          RTE.chainTaskEitherK((comicBook) => {
            if (comicBook === null) {
              throw new Error('No ComicBook to update')
            }
            return services.scrape.getComicBook(comicBook.url)
          }),
          RTE.chainW((comicBook) =>
            dataSources.comicBook.updateReleaseDate(
              comicBookId,
              // TODO: only update when release date available
              comicBook.releaseDate!,
            ),
          ),
          RTE.chainW((comicBook) =>
            RTE.fromOption(() => null)(O.fromNullable(comicBook)),
          ),
          RTE.getOrElse(() => {
            throw new ApolloError(
              `Failed to update release date of ComicBook ${comicBookId}.`,
            )
          }),
        ),
      ),
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
