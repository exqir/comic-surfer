import 'graphql-import-node'

import ComicBook from './ComicBook.graphql'
import ComicSeries from './ComicSeries.graphql'
import Publisher from './Publisher.graphql'
import PullList from './PullList.graphql'
import SearchResult from './SearchResult.graphql'

export const types = [ComicBook, ComicSeries, Publisher, PullList, SearchResult]
