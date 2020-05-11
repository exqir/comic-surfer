import { Resolver } from 'types/app'
import {
  SearchDbObject,
  QueryGetSearchArgs,
  PublisherDbObject,
} from 'types/server-schema'
import { chainMaybeToNullable, mapOtoRTEnullable, foldTEtoNullable } from 'lib'
import { pipe } from 'fp-ts/lib/pipeable'

interface SearchQuery {
  // TODO: This actually returns a Search but this is not what the function returns
  // but what is returned once all field resolvers are done
  getSearch: Resolver<SearchDbObject[], QueryGetSearchArgs>
}

export const SearchQuery: SearchQuery = {
  getSearch: (_, { q }, { services }) =>
    pipe(services.scrape.getComicSeriesSearch(q), foldTEtoNullable())(),
}
