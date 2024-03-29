import type { GraphQLResolveInfo } from 'graphql'
import * as O from 'fp-ts/lib/Option'

import type { GraphQLContext } from 'types/app'
import { defaultComicSeriesSearchResult } from '__mocks__/ComicSeriesSearchResult.mock'

import { SearchResult } from '../SearchResult.resolver'

describe('[SearchResult.inPullList]', () => {
  it('should return false when SearchResult url is NOT in urls from PullList', async () => {
    const res = await SearchResult.inPullList(
      {
        ...defaultComicSeriesSearchResult,
        url: (defaultComicSeriesSearchResult.url as O.Some<string>).value,
        comicSeriesUrlsInPullList: [],
      },
      args,
      context,
      info,
    )

    expect(res).toBe(false)
  })

  it('should return true when SearchResult url is in urls from PullList', async () => {
    const res = await SearchResult.inPullList(
      {
        ...defaultComicSeriesSearchResult,
        url: (defaultComicSeriesSearchResult.url as O.Some<string>).value,
        comicSeriesUrlsInPullList: [
          (defaultComicSeriesSearchResult.url as O.Some<string>).value,
        ],
      },
      args,
      context,
      info,
    )

    expect(res).toBe(true)
  })
})

const context = {} as GraphQLContext
const info = {} as GraphQLResolveInfo
const args = {}
