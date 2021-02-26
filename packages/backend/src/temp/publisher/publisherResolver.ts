import { Resolver, NonNullableResolver } from 'types/app'
import {
  ComicSeriesDbObject,
  PublisherDbObject,
  QueryPublishersArgs,
  QueryPublisherArgs,
} from 'types/server-schema'
import {
  runRTEtoNullable,
  maybeToOption,
  nullableField,
  nonNullableField,
  runRT,
} from 'lib'
import { pipe } from 'fp-ts/lib/pipeable'
import { map, toNullable, fold } from 'fp-ts/lib/Option'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import { ApolloError } from 'apollo-server'

interface PublisherQuery {
  // TODO: This actually returns a Publisher but this is not what the function returns
  // but what is returned once all field resolvers are done
  publishers: Resolver<PublisherDbObject[], QueryPublishersArgs>
  publisher: Resolver<PublisherDbObject, QueryPublisherArgs>
}

export const PublisherQuery: PublisherQuery = {
  publishers: (_, { names }, { dataSources, db }) =>
    nullableField(
      db,
      runRTEtoNullable(
        pipe(
          maybeToOption(names),
          fold(
            () => dataSources.publisher.getAll(),
            dataSources.publisher.getByNames,
          ),
        ),
      ),
    ),
  publisher: (_, { name }, { dataSources, db }) =>
    nullableField(db, runRTEtoNullable(dataSources.publisher.getByName(name))),
}

interface PublisherResolver {
  Publisher: {
    comicSeries: NonNullableResolver<
      ComicSeriesDbObject[],
      {},
      PublisherDbObject
    >
  }
}

export const PublisherResolver: PublisherResolver = {
  Publisher: {
    comicSeries: ({ comicSeries }, _, { dataSources, db }) =>
      nonNullableField(
        db,
        runRT(
          pipe(
            dataSources.comicSeries.getByIds(comicSeries),
            RTE.getOrElse(() => {
              throw new ApolloError('Failed to find ComicSeries for Publisher.')
            }),
          ),
        ),
      ),
  },
}
