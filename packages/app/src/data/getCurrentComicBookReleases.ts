import { gql } from 'graphql-request'
import { GetCurrentComicBookReleasesQuery } from 'types/graphql-client-schema'

import { request } from 'lib/request'

export const query = gql`
  query getCurrentComicBookReleases {
    releases(type: SINGLEISSUE) {
      _id
      title
      issueNo
      coverImgUrl
      releaseDate
      url
    }
  }
`

export const fetcher = (query: string) =>
  request<GetCurrentComicBookReleasesQuery>(query)
