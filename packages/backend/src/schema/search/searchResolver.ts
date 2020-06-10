import { Resolver } from 'types/app'
import { QuerySearchArgs, Search } from 'types/server-schema'
import { foldTEtoNullable } from 'lib'
import { pipe } from 'fp-ts/lib/pipeable'

interface SearchQuery {
  // TODO: This actually returns a Search but this is not what the function returns
  // but what is returned once all field resolvers are done
  search: Resolver<Search[], QuerySearchArgs>
}

export const SearchQuery: SearchQuery = {
  search: (_, { q }, { services }) =>
    // TODO: Also search in the db for existing series.
    pipe(services.scrape.getComicSeriesSearch(q), foldTEtoNullable())(),
}
