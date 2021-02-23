import type { NonNullableResolver } from 'types/app'
import type { EnhancedSearchResult } from 'resolvers/queries/search.resolver'

interface SearchResultResolver {
  inPullList: NonNullableResolver<Boolean, {}, EnhancedSearchResult>
  [index: string]: any
}

export const SearchResult: SearchResultResolver = {
  inPullList: ({ url, comicSeriesUrlsInPullList }) =>
    comicSeriesUrlsInPullList.includes(url),
}
