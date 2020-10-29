import { Resolver } from 'types/app'
import {
  ComicSeriesDbObject,
  PullListDbObject,
  MutationSubscribeComicSeriesArgs,
  MutationSubscribeExistingComicSeriesArgs,
  MutationUnsubscribeComicSeriesArgs,
  ComicBookDbObject,
  QueryReleasesArgs,
  ComicBookType,
} from 'types/server-schema'
import { runRTEtoNullable, run } from 'lib'
import { pipe } from 'fp-ts/lib/pipeable'
import { map, toNullable, fold, Option } from 'fp-ts/lib/Option'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as RT from 'fp-ts/lib/ReaderTask'
import * as T from 'fp-ts/lib/Task'
import { constTrue, identity } from 'fp-ts/lib/function'
import { AuthenticationError } from 'apollo-server'
import { Authentication } from 'services/Authentication'
import { TaskType } from 'datasources/QueueRepository'

interface PullListQuery {
  // TODO: This actually returns a PullList but this is not what the function returns
  // but what is returned once all field resolvers are done
  pullList: Resolver<PullListDbObject, {}>
  releases: Resolver<ComicBookDbObject[], QueryReleasesArgs>
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
  login: Resolver<PullListDbObject, {}>
  logout: Resolver<boolean, {}>
}

interface PullListResolver {
  PullList: {
    list: Resolver<ComicSeriesDbObject[], {}, PullListDbObject>
  }
}

const foldRTEorThrow = (error: Error) =>
  RTE.fold(() => {
    throw error
  }, RT.of)

const runRTEorThrow = (error: Error) => <T, L, R>(
  rte: RTE.ReaderTaskEither<T, L, R>,
) => (t: T) => pipe(rte, foldRTEorThrow(error), run(t))

export function getUserOrThrow(user: Option<string>) {
  return pipe(
    user,
    fold(() => {
      throw new AuthenticationError('')
    }, identity),
  )
}

export const PullListQuery: PullListQuery = {
  pullList: (_, __, { dataSources, db, user }) =>
    pipe(
      db,
      map(
        runRTEtoNullable(dataSources.pullList.getByUser(getUserOrThrow(user))),
      ),
      toNullable,
    ),
  releases: (_, { month, year, type }, { dataSources, db, user }) =>
    pipe(
      db,
      map(
        runRTEtoNullable(
          pipe(
            dataSources.pullList.getByUser(getUserOrThrow(user)),
            RTE.chain((pullList) => {
              if (pullList === null)
                throw new Error('No pullList for the user exists')
              return dataSources.comicBook.getBySeriesAndRelease(
                pullList.list,
                // TODO: Validate month and year
                month ?? new Date().getMonth() + 1,
                year ?? new Date().getFullYear(),
                type ?? ComicBookType.SINGLEISSUE,
              )
            }),
          ),
        ),
      ),
      toNullable,
    ),
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
        runRTEorThrow(new Error('Failed to subscribe to Comic Series'))(
          pipe(
            RTE.fromTaskEither(services.scrape.getComicSeries(comicSeriesUrl)),
            RTE.chainW((comicSeries) =>
              dataSources.comicSeries.insertIfNotExisting(comicSeries),
            ),
            RTE.chainFirst((comicSeries) => {
              if (comicSeries && comicSeries.publisher === null) {
                return dataSources.queue.insertMany([
                  {
                    type: TaskType.UPDATECOMICSERIESPUBLISHER,
                    data: {
                      comicSeriesId: comicSeries._id,
                    },
                  },
                  {
                    type: TaskType.SCRAPSINGLEISSUELIST,
                    data: {
                      comicSeriesId: comicSeries._id,
                      url: comicSeries.singleIssuesUrl!,
                    },
                  },
                  {
                    type: TaskType.SCRAPCOLLECTIONLIST,
                    data: {
                      comicSeriesId: comicSeries._id,
                      url: comicSeries.collectionsUrl!,
                    },
                  },
                ])
              }
              return RTE.right({})
            }),
            RTE.chainW((comicSeries) =>
              dataSources.pullList.addComicSeries(
                getUserOrThrow(user),
                // comicSeries can not be null as insertIfNotExisting will upsert the series
                // therefore the return type for updateOne should not contain null anymore
                (comicSeries as ComicSeriesDbObject)._id,
              ),
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
        runRTEorThrow(new Error('Failed to subscribe to Comic Series'))(
          dataSources.pullList.addComicSeries(
            getUserOrThrow(user),
            comicSeriesId,
          ),
        ),
      ),
      toNullable,
    ),
  unsubscribeComicSeries: (_, { comicSeriesId }, { dataSources, db, user }) =>
    pipe(
      db,
      map(
        runRTEorThrow(new Error('Failed to unsubscribe from Comic Series'))(
          dataSources.pullList.removeComicSeries(
            getUserOrThrow(user),
            comicSeriesId,
          ),
        ),
      ),
      toNullable,
    ),
  login: (_, __, { dataSources, db, req, res }) =>
    pipe(
      db,
      map(
        runRTEorThrow(new Error('Failed to login user'))(
          pipe(
            Authentication.getSessionFromHeaders(req),
            RTE.fromTaskEither,
            RTE.chain((session) =>
              RTE.apFirst(
                RTE.fromTaskEither(
                  Authentication.setSessionCookie(session, res),
                ),
              )(RTE.right(Authentication.getSessionIssuer(session))),
            ),
            RTE.chainW((issuer) =>
              pipe(
                dataSources.pullList.getByUser(issuer),
                RTE.chain((pullList) =>
                  pullList
                    ? RTE.right(pullList)
                    : dataSources.pullList.insert({ owner: issuer, list: [] }),
                ),
              ),
            ),
          ),
        ),
      ),
      toNullable,
    ),
  logout: (_, __, { req, res }) =>
    pipe(
      T.fromIO(Authentication.removeSessionCookie(res)),
      T.map(Authentication.logoutUser(req)),
      T.map(constTrue),
    )(),
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
