import { Resolver } from 'types/app'
import {
  ComicSeriesDbObject,
  PublisherDbObject,
  QueryPublishersArgs,
  QueryPublisherArgs,
} from 'types/server-schema'
import { runRTEtoNullable, maybeToOption } from 'lib'
import { pipe } from 'fp-ts/lib/pipeable'
import { map, toNullable, fold } from 'fp-ts/lib/Option'

interface PublisherQuery {
  // TODO: This actually returns a Publisher but this is not what the function returns
  // but what is returned once all field resolvers are done
  publishers: Resolver<PublisherDbObject[], QueryPublishersArgs>
  publisher: Resolver<PublisherDbObject, QueryPublisherArgs>
}

export const PublisherQuery: PublisherQuery = {
  publishers: (_, { names }, { dataSources, db }) =>
    pipe(
      db,
      map(
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
      toNullable,
    ),
  publisher: (_, { name }, { dataSources, db }) =>
    pipe(
      db,
      map(runRTEtoNullable(dataSources.publisher.getByName(name))),
      toNullable,
    ),
}

interface PublisherResolver {
  Publisher: {
    comicSeries: Resolver<ComicSeriesDbObject[], {}, PublisherDbObject>
  }
}

export const PublisherResolver: PublisherResolver = {
  Publisher: {
    comicSeries: ({ comicSeries }, _, { dataSources, db }) =>
      pipe(
        db,
        map(runRTEtoNullable(dataSources.comicSeries.getByIds(comicSeries))),
        toNullable,
      ),
  },
}
