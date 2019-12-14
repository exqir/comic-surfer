import { ScrapeService } from './ScrapeService'
import { ObjectID } from 'mongodb'
import { isLeft, mapLeft, isRight, map } from 'fp-ts/lib/Either'
import { comicSeries, comicBookList, comicBook } from '../config/scraper'

const mockScraper = jest.fn()
const scraper = new ScrapeService(mockScraper)

describe('ScrapeService', () => {
  it('should return left in case of Error', async () => {
    mockScraper.mockRejectedValueOnce(new Error('Failed'))
    const task = scraper.getComicSeries(
      { _id: new ObjectID(), name: 'image', basePath: '/path' },
      '/series',
    )

    const result = await task()

    expect(mockScraper).toHaveBeenCalledWith('/path/series', comicSeries.image)
    expect(isLeft(result)).toBe(true)
    expect(() =>
      mapLeft(e => {
        throw e
      })(result),
    ).toThrow(/Failed/)
  })

  it('should return left in case of a non 200 status code', async () => {
    mockScraper.mockResolvedValueOnce({
      response: { statusCode: 400 },
      data: {},
    })
    const task = scraper.getComicSeries(
      { _id: new ObjectID(), name: 'image', basePath: '/path' },
      '/series',
    )

    const result = await task()

    expect(mockScraper).toHaveBeenCalledWith('/path/series', comicSeries.image)
    expect(isLeft(result)).toBe(true)
    expect(() =>
      mapLeft(e => {
        throw e
      })(result),
    ).toThrow(/Failed/)
  })

  it('should return right with data in case of success', async () => {
    const mockResult = {
      title: 'Title',
      collectionUrl: '/collections.html',
      singleIssuesUrl: '/issues.html',
    }
    mockScraper.mockResolvedValueOnce({
      response: { statusCode: 200 },
      data: mockResult,
    })
    const task = scraper.getComicSeries(
      { _id: new ObjectID(), name: 'image', basePath: '/path' },
      '/series',
    )

    const result = await task()

    expect(mockScraper).toHaveBeenCalledWith('/path/series', comicSeries.image)
    expect(isRight(result)).toBe(true)
    map(d => expect(d).toMatchObject(mockResult))(result)
  })
})

describe('[ScrapeService.getComicSeries]', () => {
  it('should return ComicSeries scrape results', async () => {
    const mockResult = {
      title: 'Title',
      collectionUrl: '/collections.html',
      singleIssuesUrl: '/issues.html',
    }
    mockScraper.mockResolvedValueOnce({
      response: { statusCode: 200 },
      data: mockResult,
    })
    const task = scraper.getComicSeries(
      { _id: new ObjectID(), name: 'image', basePath: '/path' },
      '/series',
    )

    const result = await task()

    expect(mockScraper).toHaveBeenCalledWith('/path/series', comicSeries.image)
    map(d => expect(d).toMatchObject(mockResult))(result)
  })
})

describe('[ScrapeService.getComicBookList]', () => {
  it('should return ComicBookList scrape results', async () => {
    const mockResult = {
      comicBookList: [
        {
          title: 'Title',
          url: '/title-1',
          issue: '1',
          releaseDate: '1576244967959',
        },
      ],
    }
    mockScraper.mockResolvedValueOnce({
      response: { statusCode: 200 },
      data: mockResult,
    })
    const task = scraper.getComicBookList(
      { _id: new ObjectID(), name: 'image', basePath: '/path' },
      '/book-list',
    )

    const result = await task()

    expect(mockScraper).toHaveBeenCalledWith(
      '/path/book-list',
      comicBookList.image,
    )
    map(d => expect(d).toMatchObject(mockResult.comicBookList))(result)
  })
})

describe('[ScrapeService.getComicBook]', () => {
  it('should return ComicBook scrape results', async () => {
    const mockResult = {
      creators: [
        {
          author: 'Author Name',
          artist: 'Artist Name',
        },
      ],
      imageUrl: '/image.jpg',
    }
    mockScraper.mockResolvedValueOnce({
      response: { statusCode: 200 },
      data: mockResult,
    })
    const task = scraper.getComicBook(
      { _id: new ObjectID(), name: 'image', basePath: '/path' },
      '/comic-book',
    )

    const result = await task()

    expect(mockScraper).toHaveBeenCalledWith(
      '/path/comic-book',
      comicBook.image,
    )
    map(d => expect(d).toMatchObject(mockResult))(result)
  })
})
