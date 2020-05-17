import { Resolver } from 'types/app'
import {
  ComicSeriesDbObject,
  PublisherDbObject,
  QueryGetPublishersArgs,
  QueryGetPublisherArgs,
} from 'types/server-schema'
import { chainMaybeToNullable, mapOtoRTEnullable, runRTEtoNullable } from 'lib'
import { pipe } from 'fp-ts/lib/pipeable'
import { map, toNullable } from 'fp-ts/lib/Option'

interface PublisherQuery {
  // TODO: This actually returns a Publisher but this is not what the function returns
  // but what is returned once all field resolvers are done
  getPublishers: Resolver<PublisherDbObject[], QueryGetPublishersArgs>
  getPublisher: Resolver<PublisherDbObject, QueryGetPublisherArgs>
}

export const PublisherQuery: PublisherQuery = {
  getPublishers: (_, { names }, { dataSources, db }) =>
    pipe(
      db,
      map(runRTEtoNullable(dataSources.publisher.getByNames(names))),
      toNullable,
    ),
  getPublisher: (_, { name }, { dataSources, db }) =>
    pipe(
      db,
      map(runRTEtoNullable(dataSources.publisher.getByName(name))),
      toNullable,
    ),
}

interface PublisherResolver {
  Publisher: {
    series: Resolver<ComicSeriesDbObject[], {}, PublisherDbObject>
  }
}

export const PublisherResolver: PublisherResolver = {
  Publisher: {
    series: ({ series }, _, { dataSources, db }) =>
      chainMaybeToNullable(
        series,
        mapOtoRTEnullable(db, dataSources.comicSeries.getByIds),
      ),
  },
}
