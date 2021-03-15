import type { Db, MongoError, ObjectID } from 'mongodb'
import { constant, flow, pipe } from 'fp-ts/lib/function'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as A from 'fp-ts/lib/Array'
import * as O from 'fp-ts/lib/Option'
import * as Eq from 'fp-ts/lib/Eq'

import type {
  ComicBookDbObject,
  ComicSeriesDbObject,
  MutationUpdateComicSeriesBooksArgs,
} from 'types/graphql-schema'
import type { Resolver } from 'types/app'
import type { IWithUrl } from 'types/common'
import type { ComicBookListData } from 'services/Scraper/Scraper.interface'
import type { IComicBookRepository } from 'models/ComicBook/ComicBook.interface'
import type { IComicSeriesRepository } from 'models/ComicSeries/ComicSeries.interface'
import type {
  IQueueRepository,
  NewTask,
  Task,
} from 'models/Queue/Queue.interface'
import { toObjectId } from 'datasources/MongoDataSource'
import { TaskType } from 'models/Queue/Queue.interface'
import { ComicBookType } from 'types/graphql-schema'
import { nullableField } from 'lib'
import { getById, getUrl } from 'functions/common'
import { enqueueTasks } from 'functions/queue'
import { getComicBookList, IMaybeWithUrl } from 'functions/scraper'

export const updateComicSeriesBooks: Resolver<
  ComicBookDbObject[],
  MutationUpdateComicSeriesBooksArgs
> = (
  _,
  { comicSeriesId, comicBookType, comicBookListPath },
  { dataSources, services, db },
) =>
  pipe(
    db,
    nullableField(
      pipe(
        comicBookListPath
          ? RTE.right({ url: comicBookListPath })
          : pipe(
              comicSeriesId,
              getById(dataSources.comicSeries),
              RTE.map(getUrlByType(comicBookType)),
            ),
        RTE.chain(getComicBookList(services.scrape)),
        RTE.chain(removeExistingComicBooks(dataSources.comicBook)),
        RTE.chainFirst(
          pipe(
            [comicSeriesId, comicBookType],
            addNextPageTaskToQueue(dataSources.queue),
          ),
        ),
        RTE.chainFirst(({ comicBookList }) =>
          pipe(
            comicBookList,
            A.map(flow(getUrl, getScrapComicBookTask)),
            enqueueTasks(dataSources.queue),
          ),
        ),
        RTE.map(({ comicBookList }) =>
          pipe(
            comicBookList,
            A.map(addToComicBookData([comicSeriesId, comicBookType])),
          ),
        ),
        RTE.chain(insertComicBooks(dataSources.comicBook)),
        RTE.chainFirst(
          pipe(comicSeriesId, addComicBooksToSeries(dataSources.comicSeries)),
        ),
      ),
    ),
  )

function removeExistingComicBooks(
  repo: IComicBookRepository<Db, Error | MongoError>,
): (
  comicBookList: ComicBookListData,
) => RTE.ReaderTaskEither<Db, Error | MongoError, ComicBookListData> {
  return (comicBookList) =>
    pipe(
      comicBookList.comicBookList,
      A.map(getUrl),
      repo.getByUrls,
      RTE.map(uniqueUrl(comicBookList.comicBookList)),
      RTE.map((list) => ({
        nextPage:
          // When the page contains books that are already saved we don't need to
          // go further back to look for new books.
          comicBookList.comicBookList.length > list.length
            ? O.none
            : comicBookList.nextPage,
        comicBookList: list,
      })),
    )
}

function uniqueUrl<T extends IWithUrl, F extends IWithUrl>(
  a: T[],
): (b: F[]) => T[] {
  return (b) =>
    pipe(a, A.difference(Eq.fromEquals<T>(equalUrl))((b as unknown) as T[]))
}

const equalUrl = <T extends IWithUrl, F extends IWithUrl>(a: T, b: F) =>
  a.url === b.url

function addNextPageTaskToQueue(
  repo: IQueueRepository<Db, Error | MongoError>,
): (
  type: [ObjectID, ComicBookType],
) => (
  comicBookList: ComicBookListData,
) => RTE.ReaderTaskEither<Db, Error | MongoError, Task[] | null> {
  return ([comicSeriesId, comicBookType]) => ({ nextPage }) =>
    pipe(
      nextPage,
      O.fold<
        string,
        RTE.ReaderTaskEither<Db, Error | MongoError, Task[] | null>
      >(
        () => RTE.right(null),
        flow(
          getScrapComicBookListTask(comicSeriesId, comicBookType),
          A.of,
          enqueueTasks(repo),
        ),
      ),
    )
}

function addToComicBookData([comicSeriesId, comicBookType]: [
  ObjectID,
  ComicBookType,
]): (
  comicBookData: ComicBookListData['comicBookList'][0],
) => Omit<ComicBookDbObject, '_id' | 'lastModified'> {
  // TODO: Remove the null values once the repo accepts partials
  return (comicBookData) => ({
    ...comicBookData,
    comicSeries: toObjectId(comicSeriesId),
    type: comicBookType,
    creators: [],
    publisher: null,
    coverImgUrl: null,
    releaseDate: null,
    description: null,
  })
}

function insertComicBooks(
  repo: IComicBookRepository<Db, Error | MongoError>,
): (
  comicBooks: Omit<ComicBookDbObject, '_id' | 'lastModified'>[],
) => RTE.ReaderTaskEither<Db, Error | MongoError, ComicBookDbObject[]> {
  // TODO: Allow to add partial ComicBooks, as given by the scrapping + series and type.
  // This should be allowed from the repo, and the undefined values should be set there.
  return repo.addComicBooks
}

function addComicBooksToSeries(
  repo: IComicSeriesRepository<Db, Error | MongoError>,
): (
  comicSeriesId: ObjectID,
) => (
  comicBooks: ComicBookDbObject[],
) => RTE.ReaderTaskEither<Db, Error | MongoError, ComicSeriesDbObject> {
  return (comicSeriesId) => (comicBooks) =>
    repo.addComicBooks(
      comicSeriesId,
      pipe(
        comicBooks,
        A.map(({ _id }) => _id),
      ),
      pipe(
        comicBooks,
        A.head,
        O.map(({ type }) => type as ComicBookType),
        O.getOrElse(constant<ComicBookType>(ComicBookType.SINGLEISSUE)),
      ),
    )
}

function getUrlByType(
  comicBookType: ComicBookType,
): (comicSeries: ComicSeriesDbObject) => IMaybeWithUrl {
  return (comicSeries) =>
    comicBookType === ComicBookType.SINGLEISSUE
      ? { url: comicSeries.singleIssuesUrl }
      : { url: comicSeries.collectionsUrl }
}

function getScrapComicBookListTask(
  comicSeriesId: ObjectID,
  bookType: ComicBookType,
): (url: string) => NewTask {
  return (url) => ({
    type: TaskType.SCRAPCOMICBOOKLIST,
    data: { comicSeriesId, type: bookType, url },
  })
}

function getScrapComicBookTask(url: string): NewTask {
  return {
    type: TaskType.SCRAPCOMICBOOK,
    data: { comicBookUrl: url },
  }
}
