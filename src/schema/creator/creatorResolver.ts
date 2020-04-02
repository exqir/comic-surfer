import { Resolver } from 'types/app'
import { CreatorDbObject, ComicSeriesDbObject } from 'types/server-schema'
import { chainMaybeToNullable, mapOtoRTEnullable } from 'lib'

interface CreatorResolver {
  Creator: {
    series: Resolver<ComicSeriesDbObject[], {}, CreatorDbObject>
  }
}

export const CreatorResolver: CreatorResolver = {
  Creator: {
    series: ({ series }, _, { dataSources, db }) =>
      chainMaybeToNullable(
        series,
        mapOtoRTEnullable(db, dataSources.comicSeries.getByIds),
      ),
  },
}
