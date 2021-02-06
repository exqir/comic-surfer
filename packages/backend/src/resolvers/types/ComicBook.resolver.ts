import type { Resolver } from 'types/app'
import type {
  ComicBookDbObject,
  PublisherDbObject,
  ComicSeriesDbObject,
} from 'types/server-schema'
import { mapOtoRTEnullable, chainMaybeToNullable } from 'lib'
import { getById } from 'lib/common'

interface ComicBookResolver {
  ComicBook: {
    publisher: Resolver<PublisherDbObject, {}, ComicBookDbObject>
    comicSeries: Resolver<ComicSeriesDbObject, {}, ComicBookDbObject>
  }
}

export const ComicBookResolver: ComicBookResolver = {
  ComicBook: {
    publisher: ({ publisher }, _, { dataSources, db }) =>
      chainMaybeToNullable(
        publisher,
        mapOtoRTEnullable(db, getById(dataSources.publisher)),
      ),
    comicSeries: ({ comicSeries }, _, { dataSources, db }) =>
      chainMaybeToNullable(
        comicSeries,
        mapOtoRTEnullable(db, getById(dataSources.comicSeries)),
      ),
  },
}