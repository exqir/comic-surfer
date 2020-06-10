import { Resolver } from 'types/app'
import {
  ComicSeriesDbObject,
  PullListDbObject,
  MutationSubscribeComicSeriesArgs,
  MutationSubscribeExistingComicSeriesArgs,
  MutationUnsubscribeComicSeriesArgs,
} from 'types/server-schema'
import { runRTEtoNullable } from 'lib'
import { pipe } from 'fp-ts/lib/pipeable'
import { map, toNullable } from 'fp-ts/lib/Option'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as TE from 'fp-ts/lib/TaskEither'
import { ObjectId, MongoError } from 'mongodb'

interface PullListQuery {
  // TODO: This actually returns a PullList but this is not what the function returns
  // but what is returned once all field resolvers are done
  pullList: Resolver<PullListDbObject, {}>
}

export const PullListQuery: PullListQuery = {
  pullList: (_, __, { dataSources, db, user }) =>
    pipe(
      db,
      map(runRTEtoNullable(dataSources.pullList.getByUser(user))),
      toNullable,
    ),
}

interface PullListMutation {
  subscribeComicSeries: Resolver<
    PullListDbObject,
    MutationSubscribeComicSeriesArgs
  >
  subscribeExistingComicSeries: Resolver<
    PullListDbObject,
    MutationSubscribeExistingComicSeriesArgs
  >
  unsubscribeComicSeries: Resolver<
    PullListDbObject,
    MutationUnsubscribeComicSeriesArgs
  >
}

export const PullListMutation: PullListMutation = {
  subscribeComicSeries: (
    _,
    { comicSeriesUrl },
    { dataSources, db, user, services },
  ) =>
    pipe(
      db,
      map(
        runRTEtoNullable(
          pipe(
            RTE.fromTaskEither(
              services.scrape.getComicSeries(comicSeriesUrl) as TE.TaskEither<
                MongoError,
                {
                  title: string
                  collectionsUrl: string
                  singleIssuesUrl: string
                }
              >,
            ),
            RTE.chain((comicSeries) =>
              dataSources.comicSeries.insert({
                ...comicSeries,
                url: comicSeriesUrl,
                publisher: null,
                collections: [],
                singleIssues: [],
              }),
            ),
            RTE.chain((comicSeries) =>
              dataSources.pullList.addComicSeries(user, comicSeries._id),
            ),
          ),
        ),
      ),
      toNullable,
    ),
  subscribeExistingComicSeries: (
    _,
    { comicSeriesId },
    { dataSources, db, user },
  ) =>
    pipe(
      db,
      map(
        runRTEtoNullable(
          dataSources.pullList.addComicSeries(user, comicSeriesId),
        ),
      ),
      toNullable,
    ),
  unsubscribeComicSeries: (_, { comicSeriesId }, { dataSources, db, user }) =>
    pipe(
      db,
      map(
        runRTEtoNullable(
          dataSources.pullList.removeComicSeries(user, comicSeriesId),
        ),
      ),
      toNullable,
    ),
}

interface PullListResolver {
  PullList: {
    list: Resolver<ComicSeriesDbObject[], {}, PullListDbObject>
  }
}

export const PullListResolver: PullListResolver = {
  PullList: {
    list: ({ list }, _, { dataSources, db }) =>
      pipe(
        db,
        map(runRTEtoNullable(dataSources.comicSeries.getByIds(list))),
        toNullable,
      ),
  },
}
