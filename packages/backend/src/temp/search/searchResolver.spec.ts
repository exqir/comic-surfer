import { createMockConfig, createMockTaskWithReturnValue } from 'tests/_utils'
import { Search } from 'types/server-schema'
import { GraphQLResolveInfo } from 'graphql'
import { SearchQuery } from './searchResolver'
import { IScraper } from 'services/ScrapeService'

const defaultSearch: Search = {
  title: 'Comic',
  url: '/path',
}

describe('[Query.getSearch]', () => {
  const { context } = createMockConfig()
  context.services.scrape = ({
    getComicSeriesSearch: jest.fn(),
  } as unknown) as IScraper

  it('should call ScrapeService and return null in case of Error', async () => {
    const { getComicSeriesSearch } = context.services.scrape
    ;(getComicSeriesSearch as jest.Mock).mockReturnValueOnce(
      createMockTaskWithReturnValue<Search[]>([], true),
    )

    const res = await SearchQuery.search(
      {},
      { q: 'query' },
      context,
      {} as GraphQLResolveInfo,
    )

    expect(getComicSeriesSearch).toHaveBeenLastCalledWith('query')
    expect(res).toEqual(null)
  })

  it('should call ScrapeService and return its result', async () => {
    const mockSearch = { ...defaultSearch }
    const { getComicSeriesSearch } = context.services.scrape
    ;(getComicSeriesSearch as jest.Mock).mockReturnValueOnce(
      createMockTaskWithReturnValue<Search[]>([mockSearch]),
    )

    const res = await SearchQuery.search(
      {},
      { q: 'query' },
      context,
      {} as GraphQLResolveInfo,
    )

    expect(getComicSeriesSearch).toHaveBeenLastCalledWith('query')
    expect(res).toMatchObject([mockSearch])
  })
})
