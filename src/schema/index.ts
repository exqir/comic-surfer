import { gql } from 'apollo-server-micro'

import ComicBook from './comicBook'
import ComicSeries from './comicSeries'
import Creator from './creator'
import Publisher from './publisher'
import PullList from './pullList'
import Search from './search'

const Query = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`

export default [
  Query,
  ComicBook,
  ComicSeries,
  Creator,
  Publisher,
  PullList,
  Search,
]