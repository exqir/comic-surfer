import { ScrapeService } from './ScrapeService'
import { isLeft, mapLeft, isRight, map } from 'fp-ts/lib/Either'
import { createMockConfig } from 'tests/_utils'
import {
  comicSeries,
  comicBookList,
  comicBook,
  comicSeriesSearch,
} from '../config/scraper'

const mockScraper = jest.fn()
const baseUrl = '/base'
const searchPath = '/search?='
const scraper = new ScrapeService({
  scraper: mockScraper,
  logger: createMockConfig().context.services.logger,
  baseUrl,
  searchPath,
})

// TODO: Add expect for number of assertions like in integration test
describe('ScrapeService', () => {
  it('should return left in case of Error', async () => {
    mockScraper.mockRejectedValueOnce(new Error('Failed'))
    const task = scraper.getComicSeries('/series')

    const result = await task()

    expect.assertions(3)
    expect(mockScraper).toHaveBeenCalledWith('/base/series', comicSeries.cx)
    expect(isLeft(result)).toBe(true)
    expect(() =>
      mapLeft((e) => {
        throw e
      })(result),
    ).toThrow(/Failed/)
  })

  it('should return left in case of a non 200 status code', async () => {
    mockScraper.mockResolvedValueOnce({
      response: { statusCode: 400 },
      data: {},
    })
    const task = scraper.getComicSeries('/series')

    const result = await task()

    expect(mockScraper).toHaveBeenCalledWith('/base/series', comicSeries.cx)
    expect(isLeft(result)).toBe(true)
    expect(() =>
      mapLeft((e) => {
        throw e
      })(result),
    ).toThrow(/Failed/)
  })

  it('should return right with data in case of success', async () => {
    const mockResult = {
      title: 'Title',
      urls: [
        {
          name: 'Latest Releases',
          url: '/latest',
        },
        {
          name: 'Issues',
          url: '/issues',
        },
        {
          name: 'Collected Editions',
          url: '/collected',
        },
      ],
    }
    mockScraper.mockResolvedValueOnce({
      response: { statusCode: 200 },
      data: mockResult,
    })
    const task = scraper.getComicSeries('/series')

    const result = await task()

    expect.assertions(3)
    expect(mockScraper).toHaveBeenCalledWith('/base/series', comicSeries.cx)
    expect(isRight(result)).toBe(true)
    map((d) =>
      expect(d).toMatchObject({
        title: mockResult.title,
        collectionsUrl: mockResult.urls[2].url,
        singleIssuesUrl: mockResult.urls[1].url,
      }),
    )(result)
  })
})

describe('[ScrapeService.getComicSeries]', () => {
  it('should return ComicSeries scrape results', async () => {
    const mockResult = {
      title: 'Title',
      urls: [
        {
          name: 'Latest Releases',
          url: '/latest',
        },
        {
          name: 'Issues',
          url: '/issues',
        },
        {
          name: 'Collected Editions',
          url: '/collected',
        },
      ],
    }
    mockScraper.mockResolvedValueOnce({
      response: { statusCode: 200 },
      data: mockResult,
    })
    const task = scraper.getComicSeries('/series')

    const result = await task()

    expect.assertions(2)
    expect(mockScraper).toHaveBeenCalledWith(
      `${baseUrl}/series`,
      comicSeries.cx,
    )
    map((d) =>
      expect(d).toMatchObject({
        title: mockResult.title,
        collectionsUrl: mockResult.urls[2].url,
        singleIssuesUrl: mockResult.urls[1].url,
      }),
    )(result)
  })
})

describe('[ScrapeService.getComicBookList]', () => {
  it('should return ComicBookList scrape results', async () => {
    const mockResult = {
      comicBookList: [
        {
          title: 'Title',
          url: '/title-1',
          issueNo: '1',
        },
      ],
    }
    mockScraper.mockResolvedValueOnce({
      response: { statusCode: 200 },
      data: mockResult,
    })
    const task = scraper.getComicBookList('/book-list')

    const result = await task()

    expect.assertions(2)
    expect(mockScraper).toHaveBeenCalledWith(
      `${baseUrl}/book-list`,
      comicBookList.cx,
    )
    map((d) => expect(d).toMatchObject(mockResult.comicBookList))(result)
  })
})

describe('[ScrapeService.getComicBook]', () => {
  it('should return ComicBook scrape results', async () => {
    const mockResult = {
      meta: [
        { type: 'Page Count', date: 32 },
        { type: 'Release Date', date: new Date('2020-05-30') },
      ],
      creators: [
        {
          type: 'Published by',
          name: 'DC',
        },
        {
          type: 'Written by',
          artist: 'John Rambo',
        },
      ],
      coverImgUrl: '/image.jpg',
    }
    mockScraper.mockResolvedValueOnce({
      response: { statusCode: 200 },
      data: mockResult,
    })
    const task = scraper.getComicBook('/comic-book')

    const result = await task()

    expect.assertions(2)
    expect(mockScraper).toHaveBeenCalledWith(
      `${baseUrl}/comic-book`,
      comicBook.cx,
    )
    map((d) =>
      expect(d).toMatchObject({
        releaseDate: mockResult.meta[1].date,
        creators: [mockResult.creators[0].name, mockResult.creators[1].name],
        coverImgUrl: mockResult.coverImgUrl,
      }),
    )(result)
  })
})

describe('[ScrapeService.getComicSeriesSearch]', () => {
  it('should return ComicSeriesSearch scrape results', async () => {
    const mockResult = {
      searchResults: [
        {
          title: 'Title',
          url: '/title',
        },
      ],
    }
    mockScraper.mockResolvedValueOnce({
      response: { statusCode: 200 },
      data: mockResult,
    })
    const task = scraper.getComicSeriesSearch('title')

    const result = await task()

    expect.assertions(2)
    expect(mockScraper).toHaveBeenCalledWith(
      [baseUrl, searchPath, 'title'].join(''),
      comicSeriesSearch.cx,
    )
    map((d) => expect(d).toMatchObject(mockResult.searchResults))(result)
  })
})
