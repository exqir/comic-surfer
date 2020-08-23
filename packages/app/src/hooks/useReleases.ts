import { useEffect } from 'react'
import Router from 'next/router'
import useSWR from 'swr'
import { gql, ClientError } from 'graphql-request'
import { GetCurrentComicBookReleasesQuery } from 'types/graphql-client-schema'

import { fetcher, _fetcher } from '../lib/fetcher'

export const query = gql`
  query getCurrentComicBookReleases {
    releases(type: SINGLEISSUE) {
      _id
      title
      issueNo
      coverImgUrl
      url
    }
  }
`

export function useReleases({
  redirectTo,
  redirectIfFound,
}: { redirectTo?: string; redirectIfFound?: string } = {}) {
  const { data, error } = useSWR<
    GetCurrentComicBookReleasesQuery,
    ClientError['response']['errors']
  >(query, fetcher)
  const releases = data?.releases
  const finished = Boolean(data) || Boolean(error)
  const hasReleases = Boolean(releases)

  useEffect(() => {
    if (!redirectTo || !finished) return
    if (
      // If redirectTo is set, redirect if there is no data or an error.
      (redirectTo && !redirectIfFound && (!hasReleases || error)) ||
      // If redirectIfFound is also set, redirect if there is data and no error.
      (redirectIfFound && hasReleases && !error)
    ) {
      Router.push(redirectTo)
    }
  }, [redirectTo, redirectIfFound, finished, hasReleases, error])

  return error ? null : releases
}
