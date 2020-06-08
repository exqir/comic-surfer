import { Resolver } from 'types/app'
import { ComicSeriesDbObject, PullListDbObject } from 'types/server-schema'
import { runRTEtoNullable } from 'lib'
import { pipe } from 'fp-ts/lib/pipeable'
import { map, toNullable } from 'fp-ts/lib/Option'

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
