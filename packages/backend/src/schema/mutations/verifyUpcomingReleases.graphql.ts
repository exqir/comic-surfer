import { gql } from 'apollo-server'

export default gql`
  type Mutation {
    """
    Internal: Verfies release dates of upcoming ComicBook releases.
    Enqueues looking for updates to ComicBooks that are released soon but have not been updated.
    """
    verifyUpcomingReleases: [ComicBook!]
  }
`
