import { useEffect } from 'react'
import Router from 'next/router'
import useSWR, { mutate } from 'swr'
import { gql, ClientError } from 'graphql-request'

import { fetcher, _fetcher } from '../lib/fetcher'

export type QueryData = {
  releases: [
    {
      _id: string
      title: string
      issueNo: string
      coverImageUrl: string
      url: string
    },
  ]
}

export const query = gql`
  query getCurrentComicBookReleases {
    releases(type: SINGLEISSUE) {
      _id
      title
      issueNo
      coverImageUrl
      url
    }
  }
`

export function useReleases({
  redirectTo,
  redirectIfFound,
}: { redirectTo?: string; redirectIfFound?: string } = {}) {
  const { data, error } = useSWR<QueryData, ClientError['response']['errors']>(
    query,
    fetcher,
    {
      // Reset data on Authentication Error without revalidation.
      // This allows the data to be refeteched once the component is rerendered again.
      // Otherwise the error is still in the data and therefore will redirect to `/login`.
      onError(err, key, config) {
        // TODO: Only reset on Auth error because in this case all data should be removed.
        mutate(key, null, false)
      },
    },
  )
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
