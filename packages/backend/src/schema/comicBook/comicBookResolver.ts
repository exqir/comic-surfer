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
  MutationUpdateComicBookReleaseArgs,
  ComicBookType,
} from 'types/server-schema'
import { runRTEtoNullable, mapOtoRTEnullable, chainMaybeToNullable } from 'lib'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import { TaskEither } from 'fp-ts/lib/TaskEither'
import { MongoError } from 'mongodb'
import { ComicBookListData, ComicBookData } from 'services/ScrapeService'
import { TaskType } from 'datasources/QueueRepository'

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
  updateComicBooks: Resolver<ComicBookDbObject[], {}>
  updateComicBookRelease: Resolver<
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
    pipe(
      db,
      map(runRTEtoNullable(dataSources.comicBook.getById(id))),
      toNullable,
    ),
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
            comicSeries: comicSeriesId,
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
    pipe(
      db,
      map(
        runRTEtoNullable(
          pipe(
            RTE.fromTaskEither(services.scrape.getComicBook(comicBookUrl)),
            RTE.chainW(addPublisherToComicBook(dataSources)),
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
                ComicBookListData
              >,
            ),
            RTE.chain(
              insertComicBookIfNotExisting(
                dataSources,
                comicSeriesId,
                ComicBookType.SINGLEISSUE,
              ),
            ),
            RTE.chainFirst(
              addNextPageToQueue(
                dataSources,
                comicSeriesId,
                ComicBookType.SINGLEISSUE,
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
              dataSources.comicSeries.addComicBooks(
                comicSeriesId,
                comicBooks.map(({ _id }) => _id),
              ),
            ),
            RTE.map(({ comicBooks }) => comicBooks),
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
          ),
        ),
      ),
      toNullable,
    ),
  updateComicBooks: (_, __, { dataSources, db }) =>
    pipe(
      db,
      map(
        runRTEtoNullable(
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
          ),
        ),
      ),
      toNullable,
    ),
  updateComicBookRelease: (_, { comicBookId }, { dataSources, db, services }) =>
    pipe(
      db,
      map(
        runRTEtoNullable(
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
