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
import { identity } from 'fp-ts/lib/function'
import { AuthenticationError } from 'apollo-server'

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
