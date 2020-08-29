import { useEffect } from 'react'
import Router from 'next/router'
import useSWR from 'swr'
import { GetCurrentComicBookReleasesQuery } from 'types/graphql-client-schema'

import { RequestError } from '../lib/request'
import { query, fetcher } from '../data/getCurrentComicBookReleases'

export function useReleases({
  redirectTo,
  redirectIfFound,
}: { redirectTo?: string; redirectIfFound?: string } = {}) {
  const { data, error } = useSWR<
    GetCurrentComicBookReleasesQuery,
    RequestError
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

  return {
    releases,
    isLoading: !finished,
    isError: error,
  }
}
