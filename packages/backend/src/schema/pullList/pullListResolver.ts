import { MongoError } from 'mongodb'
import { Resolver, NonNullableResolver } from 'types/app'
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
import {
  runRTEtoNullable,
  run,
  nonNullableField,
  nullableField,
  runRT,
} from 'lib'
import { pipe } from 'fp-ts/lib/pipeable'
import { map, toNullable, fold, Option } from 'fp-ts/lib/Option'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as RT from 'fp-ts/lib/ReaderTask'
import * as T from 'fp-ts/lib/Task'
import * as O from 'fp-ts/lib/Option'
import { constTrue, identity, flow } from 'fp-ts/lib/function'
import { ApolloError, AuthenticationError } from 'apollo-server'
import { Authentication } from 'services/Authentication'
import { TaskType } from 'models/Queue/Queue.repository'

interface PullListQuery {
  // TODO: This actually returns a PullList but this is not what the function returns
  // but what is returned once all field resolvers are done
  pullList: NonNullableResolver<PullListDbObject, {}>
  releases: Resolver<ComicBookDbObject[], QueryReleasesArgs>
}
interface PullListMutation {
  subscribeComicSeries: NonNullableResolver<
    PullListDbObject,
    MutationSubscribeComicSeriesArgs
  >
  subscribeExistingComicSeries: NonNullableResolver<
    PullListDbObject,
    MutationSubscribeExistingComicSeriesArgs
  >
  unsubscribeComicSeries: NonNullableResolver<
    PullListDbObject,
    MutationUnsubscribeComicSeriesArgs
  >
  login: NonNullableResolver<PullListDbObject, {}>
  logout: NonNullableResolver<boolean, {}>
}

interface PullListResolver {
  PullList: {
    list: NonNullableResolver<ComicSeriesDbObject[], {}, PullListDbObject>
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

export function getUser(user: Option<string>) {
  return RTE.fromOption(
    () => new AuthenticationError('Failed to identify user.'),
  )(user)
}

export const PullListQuery: PullListQuery = {
  pullList: (_, __, { dataSources, db, user }) =>
    nonNullableField(
      db,
      runRT(
        pipe(
          getUser(user),
          RTE.chainW(dataSources.pullList.getByUser),
          RTE.chainW((pullList) =>
            RTE.fromOption(
              () => new MongoError('PullList for user was `null`.'),
            )(O.fromNullable(pullList)),
          ),
          RTE.getOrElse((err) => {
            if (err instanceof MongoError) {
              throw new ApolloError('Failed to find PullList for user.')
            }
            throw err
          }),
        ),
      ),
    ),
  releases: (_, { month, year, type }, { dataSources, db, user }) =>
    nullableField(
      db,
      runRTEtoNullable(
        pipe(
          RTE.fromOption(() => new Error('Failed to get user from request'))(
            user,
          ),
          RTE.chainW(dataSources.pullList.getByUser),
          RTE.chainW((pullList) => {
            if (pullList === null)
              return RTE.left(new Error('No pullList for the user exists'))
            return dataSources.comicBook.getBySeriesAndRelease(
              pullList.list,
              // TODO: Validate month and year
              month ?? new Date().getMonth() + 1,
              year ?? new Date().getFullYear(),
              type ?? ComicBookType.SINGLEISSUE,
            )
          }),
          RTE.orElse(() =>
            dataSources.comicBook.getByRelease(
              // TODO: Validate month and year
              month ?? new Date().getMonth() + 1,
              year ?? new Date().getFullYear(),
              type ?? ComicBookType.SINGLEISSUE,
            ),
          ),
        ),
      ),
    ),
}

export const PullListMutation: PullListMutation = {
  subscribeComicSeries: (
    _,
    { comicSeriesUrl },
    { dataSources, db, user, services },
  ) =>
    nonNullableField(
      db,
      runRT(
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
            pipe(
              getUser(user),
              // comicSeries can not be null as insertIfNotExisting will upsert the series
              // therefore the return type for updateOne should not contain null anymore
              RTE.chainW((u) =>
                dataSources.pullList.addComicSeries(
                  u,
                  (comicSeries as ComicSeriesDbObject)._id,
                ),
              ),
            ),
          ),
          RTE.chainW((pullList) =>
            RTE.fromOption(
              () => new MongoError('PullList for user was `null`.'),
            )(O.fromNullable(pullList)),
          ),
          RTE.getOrElse((err) => {
            if (err instanceof MongoError) {
              throw new ApolloError('Failed to subscribe to Comic Series.')
            }
            throw err
          }),
        ),
      ),
    ),
  subscribeExistingComicSeries: (
    _,
    { comicSeriesId },
    { dataSources, db, user },
  ) =>
    nonNullableField(
      db,
      runRT(
        pipe(
          getUser(user),
          RTE.chainW((u) =>
            dataSources.pullList.addComicSeries(u, comicSeriesId),
          ),
          RTE.chainW((pullList) =>
            RTE.fromOption(
              () => new MongoError('PullList for user was `null`.'),
            )(O.fromNullable(pullList)),
          ),
          RTE.getOrElse((err) => {
            if (err instanceof MongoError) {
              throw new ApolloError('Failed to subscribe to Comic Series.')
            }
            throw err
          }),
        ),
      ),
    ),
  unsubscribeComicSeries: (_, { comicSeriesId }, { dataSources, db, user }) =>
    nonNullableField(
      db,
      runRT(
        pipe(
          getUser(user),
          RTE.chainW((u) =>
            dataSources.pullList.removeComicSeries(u, comicSeriesId),
          ),
          RTE.chainW((pullList) =>
            RTE.fromOption(
              () => new MongoError('PullList for user was `null`.'),
            )(O.fromNullable(pullList)),
          ),
          RTE.getOrElse((err) => {
            if (err instanceof MongoError) {
              throw new ApolloError('Failed to unsubscribe from Comic Series.')
            }
            throw err
          }),
        ),
      ),
    ),
  login: (_, __, { dataSources, db, req, res }) =>
    nonNullableField(
      db,
      runRT(
        pipe(
          Authentication.getSessionFromHeaders(req),
          RTE.fromTaskEither,
          RTE.chain((session) =>
            RTE.apFirst(
              RTE.fromTaskEither(Authentication.setSessionCookie(session, res)),
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
          RTE.getOrElse((err) => {
            if (err instanceof MongoError) {
              throw new Error('Failed find or create PullList for user.')
            }
            throw new ApolloError('Failed to login user.')
          }),
        ),
      ),
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
      nonNullableField(
        db,
        runRT(
          pipe(
            dataSources.comicSeries.getByIds(list),
            RTE.getOrElse(() => {
              throw new ApolloError(
                'Failed to find ComicSeries for `list` of PullList.',
              )
            }),
          ),
        ),
      ),
  },
}
