import { pipe } from 'fp-ts/lib/pipeable'
import { toNullable, map } from 'fp-ts/lib/Option'
import { Resolver } from 'types/app'
import { CreatorDbObject, ComicSeriesDbObject } from 'types/server-schema'
import { runRTEtoNullable } from 'lib'

interface CreatorResolver {
  Creator: {
    comicSeries: Resolver<ComicSeriesDbObject[], {}, CreatorDbObject>
  }
}

export const CreatorResolver: CreatorResolver = {
  Creator: {
    comicSeries: ({ comicSeries }, _, { dataSources, db }) =>
      pipe(
        db,
        map(runRTEtoNullable(dataSources.comicSeries.getByIds(comicSeries))),
        toNullable,
      ),
  },
}
