import { createMockConfig, createMockTaskWithReturnValue } from 'tests/_utils'
import { SearchDbObject } from 'types/server-schema'
import { GraphQLResolveInfo } from 'graphql'
import { SearchQuery } from './searchResolver'
import { ScrapeService } from 'services/ScrapeService'

const defaultSearch: SearchDbObject = {
  title: 'Comic',
  url: '/path',
}

describe('[Query.getSearch]', () => {
  const { context } = createMockConfig()
  context.services.scrape = ({
    getComicSeriesSearch: jest.fn(),
  } as unknown) as ScrapeService

  it('should call ScrapeService and return null in case of Error', async () => {
    const { getComicSeriesSearch } = context.services.scrape
    ;(getComicSeriesSearch as jest.Mock).mockReturnValueOnce(
      createMockTaskWithReturnValue<SearchDbObject[]>([], true),
    )

    const res = await SearchQuery.getSearch(
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
      createMockTaskWithReturnValue<SearchDbObject[]>([mockSearch]),
    )

    const res = await SearchQuery.getSearch(
      {},
      { q: 'query' },
      context,
      {} as GraphQLResolveInfo,
    )

    expect(getComicSeriesSearch).toHaveBeenLastCalledWith('query')
    expect(res).toMatchObject([mockSearch])
  })
})
