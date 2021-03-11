import { mapLeft, map, Either } from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'

import { logger } from '__tests__/_mock'

import { comixology } from '../Scraper/ComixologyScaper'

const mockScraper = jest.fn()
const baseUrl = 'https://base.com'
const scraper = comixology(mockScraper, logger, baseUrl)

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
          collectionsUrl: seriesScrapResult.urls[2].url,
          singleIssuesUrl: seriesScrapResult.urls[1].url,
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
      nextPage: '/next',
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
          nextPage: comicBookListScrapResult.nextPage,
          comicBookList: comicBookListScrapResult.comicBookList,
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
        { type: 'Page Count', date: new Date(32) },
        { type: 'Release Date', date: new Date('2020-05-30') },
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
          issueNo: comicBookScrapResult.issueNo,
          url: `${baseUrl}/comic-book`,
          releaseDate: comicBookScrapResult.meta[1].date,
          creators: [{ name: comicBookScrapResult.creators[1].name }],
          publisher: { name: comicBookScrapResult.creators[0].name },
          coverImgUrl: comicBookScrapResult.coverImgUrl,
          description: comicBookScrapResult.description,
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
        expect(r).toMatchObject(comicSeriesSearchScrapResult.searchResults),
      ),
    )
  })
})
