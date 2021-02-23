import 'graphql-import-node'

import comicBook from './comicBook.graphql'
import comicSeries from './comicSeries.graphql'
import pullList from './pullList.graphql'
import releases from './releases.graphql'
import search from './search.graphql'

export const queries = [comicBook, comicSeries, pullList, releases, search]
