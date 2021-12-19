import * as O from 'fp-ts/lib/Option'
import { mapLeft, map, Either } from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'

import type { IEnvironmentService } from 'services/Environment/Environment.interface'
import { logger } from '__tests__/_mock'

import { comixology } from '../Scraper/ComixologyScaper'

const mockScraper = jest.fn()
const baseUrl = 'https://base.com'
const env = ({
  getSourceOrigin: jest.fn().mockReturnValue(O.some(baseUrl)),
} as unknown) as IEnvironmentService
const scraper = comixology({
  scraper: mockScraper,
  logger,
  env,
})

describe.each([
  'getComicSeries',
  'getComicBookList',
  'getComicBook',
  'getComicSeriesSearch',
] as const)('[ComixologyScaper.%s]', (method) => {
  it('should return left in case of Error during scraping', async () => {
    mockScraper.mockRejectedValueOnce(new Error('Failed'))

    const result: Either<Error, any> = await scraper[method]('/path')()

    expect.assertions(1)
    pipe(
      result,
      mapLeft((err) => expect(err).toBeInstanceOf(Error)),
    )
  })

  it('should return left in case of a non 200 status code', async () => {
    mockScraper.mockResolvedValueOnce({
      response: { statusCode: 400 },
      data: {},
    })
    const result: Either<Error, any> = await scraper[method]('/series')()

    expect.assertions(1)
    pipe(
      result,
      mapLeft((err) => expect(err).toBeInstanceOf(Error)),
    )
  })
})

describe('[ComixologyScaper.getComicSeries]', () => {
  it('should scrop from url', async () => {
    const task = scraper.getComicSeries('/series')

    await task()

    expect(mockScraper).toHaveBeenCalledWith(
      `${baseUrl}/series`,
      expect.any(Object),
    )
  })

  it('should return right with ComicSeriesData', async () => {
    const seriesScrapResult = {
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
      data: seriesScrapResult,
    })
    const result = await scraper.getComicSeries('/series')()

    expect.assertions(1)
    pipe(
      result,
      map((r) =>
        expect(r).toMatchObject({
          title: seriesScrapResult.title,
          url: `${baseUrl}/series`,
          collectionsUrl: O.some(`${baseUrl}/collected`),
          singleIssuesUrl: O.some(`${baseUrl}/issues`),
        }),
      ),
    )
  })
})

describe('[ComixologyScaper.getComicBookList]', () => {
  it('should scrap from url', async () => {
    const task = scraper.getComicBookList('/book-list')

    await task()

    expect(mockScraper).toHaveBeenCalledWith(
      `${baseUrl}/book-list?sort=desc`,
      expect.any(Object),
    )
  })

  it('should return right with ComicBookListData', async () => {
    const comicBookListScrapResult = {
      nextPage: '/next?page=1',
      comicBookList: [
        {
          title: 'Title',
          url: '/title-1',
          issueNo: '1',
          coverImgUrl: '/image.jpg',
        },
      ],
    }
    mockScraper.mockResolvedValueOnce({
      response: { statusCode: 200 },
      data: comicBookListScrapResult,
    })

    const result = await scraper.getComicBookList('/book-list')()

    expect.assertions(1)
    pipe(
      result,
      map((r) =>
        expect(r).toMatchObject({
          nextPage: O.some('/next?page=1'),
          comicBookList: [
            {
              title: comicBookListScrapResult.comicBookList[0].title,
              url: O.some(`${baseUrl}/title-1`),
              issueNo: O.some(1),
              coverImgUrl:
                comicBookListScrapResult.comicBookList[0].coverImgUrl,
            },
          ],
        }),
      ),
    )
  })

  it('should return none as nextPage when value is not a next page', async () => {
    const comicBookListScrapResult = {
      nextPage: '#',
      comicBookList: [
        {
          title: 'Title',
          url: '/title-1',
          issueNo: '1',
          coverImgUrl: '/image.jpg',
        },
      ],
    }
    mockScraper.mockResolvedValueOnce({
      response: { statusCode: 200 },
      data: comicBookListScrapResult,
    })

    const result = await scraper.getComicBookList('/book-list')()

    expect.assertions(1)
    pipe(
      result,
      map((r) =>
        expect(r).toMatchObject({
          nextPage: O.none,
          comicBookList: expect.any(Array),
        }),
      ),
    )
  })
})

describe('[ComixologyScaper.getComicBook]', () => {
  it('should scrap from url', async () => {
    const task = scraper.getComicBook('/comic-book')

    await task()

    expect(mockScraper).toHaveBeenCalledWith(
      `${baseUrl}/comic-book`,
      expect.any(Object),
    )
  })

  it('should return right with ComicBookData', async () => {
    const comicBookScrapResult = {
      title: 'Title',
      issueNo: '1',
      meta: [
        { type: 'Page Count', date: '32' },
        { type: 'Release Date', date: 'May 30, 2020' },
      ],
      creators: [
        {
          type: 'Published by',
          name: 'DC',
        },
        {
          type: 'Written by',
          name: 'John Rambo',
        },
      ],
      coverImgUrl: '/image.jpg',
      description: '<p>Description</p>',
    }
    mockScraper.mockResolvedValueOnce({
      response: { statusCode: 200 },
      data: comicBookScrapResult,
    })

    const result = await scraper.getComicBook('/comic-book')()

    expect.assertions(1)
    pipe(
      result,
      map((r) =>
        expect(r).toMatchObject({
          title: comicBookScrapResult.title,
          issueNo: O.some(1),
          url: `${baseUrl}/comic-book`,
          releaseDate: O.some(new Date(2020, 4, 30)),
          creators: [{ name: comicBookScrapResult.creators[1].name }],
          publisher: O.some({ name: comicBookScrapResult.creators[0].name }),
          coverImgUrl: comicBookScrapResult.coverImgUrl,
          description: O.some('Description'),
        }),
      ),
    )
  })
})

describe('[ComixologyScaper.getComicSeriesSearch]', () => {
  it('should scrap from url', async () => {
    const task = scraper.getComicSeriesSearch('query')

    await task()

    expect(mockScraper).toHaveBeenCalledWith(
      `${baseUrl}/search/series?search=query`,
      expect.any(Object),
    )
  })

  it('should return right with ComicSeriesSearchData', async () => {
    const comicSeriesSearchScrapResult = {
      searchResults: [
        {
          title: 'Title',
          url: '/title',
        },
      ],
    }
    mockScraper.mockResolvedValueOnce({
      response: { statusCode: 200 },
      data: comicSeriesSearchScrapResult,
    })

    const task = scraper.getComicSeriesSearch('title')

    const result = await task()

    expect.assertions(1)
    pipe(
      result,
      map((r) =>
        expect(r).toMatchObject([
          {
            title: comicSeriesSearchScrapResult.searchResults[0].title,
            url: O.some(`${baseUrl}/title`),
          },
        ]),
      ),
    )
  })
})
