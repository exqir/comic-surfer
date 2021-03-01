import type { Db, MongoError } from 'mongodb'
import { AuthenticationError } from 'apollo-server'
import { flow, pipe } from 'fp-ts/lib/function'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'

import type {
  ComicSeriesDbObject,
  PullListDbObject,
  MutationAddToPullListArgs,
} from 'types/graphql-schema'
import type { Resolver } from 'types/app'
import type { ComicSeriesData, IScraper } from 'services/ScrapeService'
import type { IComicSeriesRepository } from 'models/ComicSeries/ComicSeries.interface'
import type { IPullListRepository } from 'models/PullList/PullList.interface'
import type { NewTask } from 'models/Queue/Queue.interface'
import { TaskType } from 'models/Queue/Queue.interface'
import { nullableField } from 'lib'
import { throwWhenAuthenticationError } from 'lib/common'
import { enqueueTasks } from 'lib/queue'
import { getUser } from 'lib/user'

export const addToPullList: Resolver<
  PullListDbObject,
  MutationAddToPullListArgs
> = (_, { comicSeriesUrl }, { dataSources, services, db, user }) =>
  pipe(
    db,
    nullableField(
      pipe(
        comicSeriesUrl,
        getComicSeries(services.scrape),
        RTE.chain(getOrCreateComicSeries(dataSources.comicSeries)),
        RTE.chainFirst(
          flow(getNewComicSeriesTasks, enqueueTasks(dataSources.queue)),
        ),
        RTE.chain(
          pipe(getUser(user), addComicSeriesToPullList(dataSources.pullList)),
        ),
        RTE.mapLeft(throwWhenAuthenticationError),
      ),
    ),
  )

function getComicSeries(
  scraper: IScraper,
): (path: string) => RTE.ReaderTaskEither<any, Error, ComicSeriesData> {
  return flow(scraper.getComicSeries, RTE.fromTaskEither)
}

function getOrCreateComicSeries(
  repo: IComicSeriesRepository<Db, Error | MongoError>,
): (
  partialComicSeries: ComicSeriesData,
) => RTE.ReaderTaskEither<Db, Error | MongoError, ComicSeriesDbObject> {
  return repo.getOrCreate
}

function addComicSeriesToPullList(
  repo: IPullListRepository<Db, Error | MongoError>,
): (
  owner: RTE.ReaderTaskEither<unknown, AuthenticationError, string>,
) => (
  series: ComicSeriesDbObject,
) => RTE.ReaderTaskEither<
  Db,
  AuthenticationError | Error | MongoError,
  PullListDbObject
> {
  return (owner) => ({ _id: comicSeriesId }) =>
    pipe(
      owner,
      RTE.chain((o) => repo.addComicSeriesToPullList(o, comicSeriesId)),
    )
}

function getNewComicSeriesTasks({
  publisher,
  _id: comicSeriesId,
  singleIssuesUrl,
  collectionsUrl,
}: ComicSeriesDbObject): NewTask[] {
  // TODO: Scraping should only be necessary for new ComicSeries as well,
  // however insertMany with an empty array would result in an error.
  const tasks: NewTask[] = [
    {
      type: TaskType.SCRAPSINGLEISSUELIST,
      data: {
        comicSeriesId,
        url: singleIssuesUrl!,
      },
    },
    {
      type: TaskType.SCRAPCOLLECTIONLIST,
      data: {
        comicSeriesId,
        url: collectionsUrl!,
      },
    },
  ]

  // Only set publisher when needed. This should only be the case
  // when the ComicSeries is being added for the first time.
  if (publisher === null) {
    tasks.unshift({
      type: TaskType.UPDATECOMICSERIESPUBLISHER,
      data: {
        comicSeriesId,
      },
    })
  }

  return tasks
}
