import { Resolver } from 'types/app'
import {
  ComicSeriesDbObject,
  QueryGetPullListArgs,
  PullListDbObject,
} from 'types/server-schema'
import { chainMaybeToNullable, mapOtoRTEnullable, runRTEtoNullable } from 'lib'
import { pipe } from 'fp-ts/lib/pipeable'
import { map, toNullable } from 'fp-ts/lib/Option'

interface PullListQuery {
  // TODO: This actually returns a PullList but this is not what the function returns
  // but what is returned once all field resolvers are done
  getPullList: Resolver<PullListDbObject, QueryGetPullListArgs>
}

export const PullListQuery: PullListQuery = {
  getPullList: (_, { owner }, { dataSources, db }) =>
    pipe(
      db,
      map(runRTEtoNullable(dataSources.pullList.getByUser(owner))),
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
      chainMaybeToNullable(
        list,
        mapOtoRTEnullable(db, dataSources.comicSeries.getByIds),
      ),
  },
}
