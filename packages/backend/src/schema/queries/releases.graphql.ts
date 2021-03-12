import { gql } from 'apollo-server'

export default gql`
  type Query {
    """
    The ComicBooks released within the given month and year.
    In case of a logged-in user only ComicBooks from ComicSeries of the users PullList are included.
    """
    releases(month: Int, year: Int, type: ComicBookType): [ComicBook!]
  }
`
