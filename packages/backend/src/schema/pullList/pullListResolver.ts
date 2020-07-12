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
import { map, toNullable, fold } from 'fp-ts/lib/Option'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as IO from 'fp-ts/lib/IO'
import { identity } from 'fp-ts/lib/function'
import { AuthenticationError } from 'apollo-server'
import { Authentication } from 'services/Authentication'

interface PullListQuery {
  // TODO: This actually returns a PullList but this is not what the function returns
  // but what is returned once all field resolvers are done
  pullList: Resolver<PullListDbObject, {}>
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

export const PullListQuery: PullListQuery = {
  pullList: (_, __, { dataSources, db, user }) =>
    pipe(
      db,
      map(
        runRTEtoNullable(
          dataSources.pullList.getByUser(
            pipe(
              user,
              fold(() => {
                throw new AuthenticationError('')
              }, identity),
            ),
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
        runRTEtoNullable(
          pipe(
            RTE.fromTaskEither(services.scrape.getComicSeries(comicSeriesUrl)),
            RTE.chainW((comicSeries) =>
              dataSources.comicSeries.insertIfNotExisting({
                ...comicSeries,
                publisher: null,
              }),
            ),
            RTE.chainW((comicSeries) =>
              dataSources.pullList.addComicSeries(
                pipe(
                  user,
                  fold(() => {
                    throw new AuthenticationError('')
                  }, identity),
                ),
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
        runRTEtoNullable(
          dataSources.pullList.addComicSeries(
            pipe(
              user,
              fold(() => {
                throw new AuthenticationError('')
              }, identity),
            ),
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
        runRTEtoNullable(
          dataSources.pullList.removeComicSeries(
            pipe(
              user,
              fold(() => {
                throw new AuthenticationError('')
              }, identity),
            ),
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
        runRTEtoNullable(
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
  logout: (_, __, { res }) =>
    pipe(
      Authentication.removeSessionCookie(res),
      IO.map(() => true),
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
