import 'graphql-import-node'
import { GraphQLDate } from 'graphql-iso-date'
import Root from './schema.root.graphql'
import ComicBook from './comicBook/comicBook.server.graphql'
import {
  ComicBookQuery,
  ComicBookMutation,
  ComicBookResolver,
} from './comicBook/comicBookResolver'
import ComicSeries from './comicSeries/comicSeries.server.graphql'
import {
  ComicSeriesQuery,
  ComicSeriesMutation,
  ComicSeriesResolver,
} from './comicSeries/comicSeriesResolver'
import Publisher from './publisher/publisher.server.graphql'
import {
  PublisherQuery,
  PublisherResolver,
} from './publisher/publisherResolver'
import PullList from './pullList/pullList.server.graphql'
import {
  PullListQuery,
  PullListMutation,
  PullListResolver,
} from './pullList/pullListResolver'
import Search from './search/search.server.graphql'
import { SearchQuery, SearchResolver } from './search/searchResolver'

export default [Root, ComicBook, ComicSeries, Publisher, PullList, Search]

export const resolvers = {
  Date: GraphQLDate,
  Query: {
    ...ComicBookQuery,
    ...ComicSeriesQuery,
    ...PublisherQuery,
    ...PullListQuery,
    ...SearchQuery,
  },
  Mutation: {
    ...ComicBookMutation,
    ...ComicSeriesMutation,
    ...PullListMutation,
  },
  ...ComicBookResolver,
  ...ComicSeriesResolver,
  ...PublisherResolver,
  ...PullListResolver,
  ...SearchResolver,
}
