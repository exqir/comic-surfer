import { map } from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/pipeable'
import handler from 'serve-handler'
import http from 'http'
import { ObjectID } from 'mongodb'
import scrapeIt from 'scrape-it'
import { PublisherDbObject } from 'types/server-schema'
import { ScrapeService } from '../services/ScrapeService'

const PORT = 9000
const URL = `http://localhost:${PORT}`
const scraper = new ScrapeService({
  scraper: scrapeIt,
  baseUrl: URL,
  searchPath: '/cx-comic-series-search.html?search=',
})
let server: http.Server

beforeAll(done => {
  server = http.createServer((request, response) => {
    return handler(request, response, { public: 'src/__fixtures__' })
  })

  server.listen(PORT, done)
})

afterAll(() => {
  server.close()
})

const defaultPublisher: PublisherDbObject = {
  _id: new ObjectID(),
  name: 'image',
  iconUrl: null,
  url: null,
  basePath: null,
  searchPath: null,
  searchPathSeries: null,
  series: null,
  seriesPath: null,
}

describe('[Scraper.getComicSeries]', () => {
  it('should scrap data from comic-series page', async () => {
    expect.assertions(1)
    return pipe(
      scraper.getComicSeries(
        { ...defaultPublisher, basePath: URL },
        '/comic-series.html',
      ),
      map(res => {
        expect(res).toMatchObject({
          title: 'Title',
          collectionUrl: '/collections.html',
          singleIssuesUrl: '/issues.html',
        })
      }),
    )()
  })
})

describe('[Scraper.getComicSeriesCX]', () => {
  it('should scrap data from comic-series page', async () => {
    expect.assertions(1)
    return pipe(
      scraper.getComicSeriesCX('/cx-comic-series.html'),
      map(res => {
        expect(res).toMatchObject({
          title: 'Title',
          collectionUrl: '/collections.html',
          singleIssuesUrl: '/issues.html',
        })
      }),
    )()
  })
})

describe('[Scraper.getComicBookList]', () => {
  it('should scrap data from comic-book-list page', async () => {
    expect.assertions(1)
    return pipe(
      scraper.getComicBookList(
        { ...defaultPublisher, basePath: URL },
        '/comic-book-list.html',
      ),
      map(res => {
        expect(res).toMatchObject([
          {
            title: 'Comic Book #2',
            url: '/issue-2.html',
            issue: '2',
            releaseDate: 1478041200000,
          },
          {
            title: 'Comic Book #1',
            url: '/issue-1.html',
            issue: '1',
            releaseDate: 1473199200000,
          },
        ])
      }),
    )()
  })
})

describe('[Scraper.getComicBook]', () => {
  it('should scrap data from comic-book page', async () => {
    expect.assertions(1)
    return pipe(
      scraper.getComicBook(
        { ...defaultPublisher, basePath: URL },
        '/comic-book.html',
      ),
      map(res => {
        expect(res).toMatchObject({
          creators: [{ author: 'Joshua Williamson', artist: 'Mike Henderson' }],
          imageUrl: '/cover.png',
        })
      }),
    )()
  })
})

describe('[Scraper.getComicSeriesSearch]', () => {
  it('should scrap data from comic-series-search page', async () => {
    expect.assertions(1)
    return pipe(
      scraper.getComicSeriesSearch(
        { ...defaultPublisher, basePath: URL },
        '/comic-series-search.html',
      ),
      map(res => {
        expect(res).toMatchObject([
          {
            title: 'Title 1',
            url: '/title-1.html',
          },
          {
            title: 'Title 2',
            url: '/title-2.html',
          },
        ])
      }),
    )()
  })
})

describe('[Scraper.getComicSeriesSearchCX]', () => {
  it('should scrap data from comic-series-search page', async () => {
    expect.assertions(1)
    return pipe(
      scraper.getComicSeriesSearchCX('title'),
      map(res => {
        expect(res).toMatchObject([
          {
            title: 'Series 1',
            url: '/series-1.html',
          },
          {
            title: 'Series 2',
            url: '/series-2.html',
          },
        ])
      }),
    )()
  })
})
