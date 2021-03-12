import { gql } from 'apollo-server'

export default gql`
  type Mutation {
    """
    Internal: Add new colletions and single issue releases of ComicSeries.
    Enqueues looking for new releases of ComicSeries which releases have not been updated for the longest time.
    """
    addNewReleases: [ComicSeries!]
  }
`
