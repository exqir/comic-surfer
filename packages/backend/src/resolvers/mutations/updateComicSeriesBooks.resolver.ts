import type { Db, MongoError, ObjectID } from 'mongodb'
import { flow, pipe, identity } from 'fp-ts/lib/function'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as A from 'fp-ts/lib/Array'
import * as O from 'fp-ts/lib/Option'
import * as Eq from 'fp-ts/lib/Eq'

import type {
  ComicSeriesDbObject,
  TaskDbInterface,
  MutationUpdateComicSeriesBooksArgs,
} from 'types/graphql-schema'
import type { Resolver } from 'types/app'
import type { ComicBookListData } from 'services/Scraper/Scraper.interface'
import type { IComicBookRepository } from 'models/ComicBook/ComicBook.interface'
import type {
  IQueueRepository,
  NewTask,
  Task,
} from 'models/Queue/Queue.interface'
import { TaskType } from 'types/graphql-schema'
import { ComicBookType } from 'types/graphql-schema'
import { nullableField } from 'lib'
import { getById } from 'functions/common'
import { enqueueTasks } from 'functions/queue'
import { getComicBookList, IMaybeWithUrl } from 'functions/scraper'

export const updateComicSeriesBooks: Resolver<
  // TODO: Use AddComicBookTaskDbObject type instead generic one
  // Right now the return value of enqueueTasks is the gerneric Task object
  TaskDbInterface[],
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
        RTE.chain(({ comicBookList }) =>
          pipe(
            comicBookList,
            A.map(
              flow(
                getOptionalUrl,
                getScrapComicBookTask([comicSeriesId, comicBookType]),
              ),
            ),
            enqueueTasks(dataSources.queue),
          ),
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
      A.map(({ url }) => url),
      A.filterMap(identity),
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

interface IWithOptionalUrl {
  url: O.Option<string> | string
}

function uniqueUrl<T extends IWithOptionalUrl, F extends IWithOptionalUrl>(
  a: T[],
): (b: F[]) => T[] {
  return (b) =>
    pipe(a, A.difference(Eq.fromEquals<T>(equalUrl))((b as unknown) as T[]))
}

const equalUrl = <T extends IWithOptionalUrl, F extends IWithOptionalUrl>(
  a: T,
  b: F,
) => getOptionalUrl(a) === getOptionalUrl(b)

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

function getScrapComicBookTask([comicSeries, type]: [
  ObjectID,
  ComicBookType,
]): (url: string) => NewTask {
  return (url) => ({
    type: TaskType.ADDCOMICBOOK,
    data: { url, comicSeriesId: comicSeries, type },
  })
}

function getOptionalUrl(o: IWithOptionalUrl) {
  return typeof o.url === 'string'
    ? o.url
    : pipe(
        o.url,
        O.getOrElse(() => ''),
      )
}
