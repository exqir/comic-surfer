import Root from './schema.root.graphql'
import ComicBook from './comicBook/comicBook.server.graphql'
import {
  ComicBookQuery,
  ComicBookResolver,
} from './comicBook/comicBookResolver'
import ComicSeries from './comicSeries/comicSeries.server.graphql'
import {
  ComicSeriesQuery,
  ComicSeriesResolver,
} from './comicSeries/comicSeriesResolver'
import Creator from './creator/creator.server.graphql'
import { CreatorResolver } from './creator/creatorResolver'
import Publisher from './publisher/publisher.server.graphql'
import PullList from './pullList/pullList.server.graphql'
import Search from './search/search.server.graphql'

export default [
  Root,
  ComicBook,
  ComicSeries,
  Creator,
  Publisher,
  PullList,
  Search,
]

export const resolvers = {
  Query: {
    ...ComicBookQuery,
    ...ComicSeriesQuery,
  },
  ...ComicBookResolver,
  ...ComicSeriesResolver,
  ...CreatorResolver,
}
