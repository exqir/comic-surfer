import { Resolver } from 'types/app'
import {
  SearchDbObject,
  QueryGetSearchArgs,
  PublisherDbObject,
} from 'types/server-schema'
import { chainMaybeToNullable, mapOtoRTEnullable, runRTEtoNullable } from 'lib'
import { pipe } from 'fp-ts/lib/pipeable'
import { map, toNullable } from 'fp-ts/lib/Option'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as RT from 'fp-ts/lib/TaskEither'

interface SearchQuery {
  // TODO: This actually returns a Search but this is not what the function returns
  // but what is returned once all field resolvers are done
  getSearch: Resolver<SearchDbObject[], QueryGetSearchArgs>
}

export const SearchQuery: SearchQuery = {
  getSearch: (_, { q }, { dataSources, db, services }) =>
    pipe(
      db,
      map(
        runRTEtoNullable(
          pipe(
            // TODO: currently only image is configured
            dataSources.publisher.getByName('image'),
            RTE.chainTaskEitherK(publisher =>
              pipe(
                services.scrape.getComicSeriesSearch(publisher, `q=${q}`),
                RT.map(searchResults =>
                  searchResults.map(search => ({
                    ...search,
                    publisher: publisher._id,
                  })),
                ),
              ),
            ),
          ),
        ),
      ),
      toNullable,
    ),
}

interface SearchResolver {
  Search: {
    publisher: Resolver<PublisherDbObject, {}, SearchDbObject>
  }
}

export const SearchResolver: SearchResolver = {
  Search: {
    publisher: ({ publisher }, _, { dataSources, db }) =>
      chainMaybeToNullable(
        publisher,
        mapOtoRTEnullable(db, dataSources.publisher.getById),
      ),
  },
}
