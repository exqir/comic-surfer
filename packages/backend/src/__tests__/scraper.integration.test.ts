import { map } from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/pipeable'
import handler from 'serve-handler'
import http from 'http'
import scrapeIt from 'scrape-it'
import { comixology } from '../services/ComixologyScaper'
import { createMockConfig } from 'tests/_utils'

const PORT = 9000
const URL = `http://localhost:${PORT}`
const scraper = comixology(
  scrapeIt,
  createMockConfig().context.services.logger,
  URL,
)
let server: http.Server

beforeAll((done) => {
  server = http.createServer((request, response) => {
    return handler(request, response, {
      public: '__fixtures__',
      rewrites: [
        {
          source: '/search/series',
          destination: '/cx-comic-series-search.html',
        },
      ],
    })
  })

  server.listen(PORT, done)
})

afterAll(() => {
  server.close()
})

describe('[Scraper.getComicSeries]', () => {
  it('should scrap data from comic-series page', async () => {
    expect.assertions(1)
    return pipe(
      scraper.getComicSeries('/cx-comic-series.html'),
      map((res) => {
        expect(res).toMatchObject({
          url: `${URL}/cx-comic-series.html`,
          title: 'Title',
          collectionsUrl: `${URL}/collections.html`,
          singleIssuesUrl: `${URL}/issues.html`,
        })
      }),
    )()
  })
})

describe('[Scraper.getComicBookList]', () => {
  it('should scrap data from comic-book-list page', async () => {
    expect.assertions(1)
    return pipe(
      scraper.getComicBookList('/cx-comic-book-list.html'),
      map((res) => {
        expect(res).toMatchObject([
          {
            title: 'Comic Book 2',
            url: `${URL}/issue-2.html`,
            issueNo: '2',
            coverImgUrl: '/issue-2-cover.jpg',
          },
          {
            title: 'Comic Book 1',
            url: `${URL}/issue-1.html`,
            issueNo: '1',
            coverImgUrl: '/issue-1-cover.jpg',
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
      scraper.getComicBook('/cx-comic-book.html'),
      map((res) => {
        expect(res).toMatchObject({
          title: 'Batman',
          url: `${URL}/cx-comic-book.html`,
          issueNo: '78',
          publisher: { name: 'DC', url: `${URL}/dc` },
          releaseDate: new Date('November 2, 2016'),
          creators: [{ name: 'Joshua Williamson' }, { name: 'Mike Henderson' }],
          coverImgUrl: '/cover.png',
        })
      }),
    )()
  })
})

describe('[Scraper.getComicSeriesSearch]', () => {
  it('should scrap data from comic-series-search page', async () => {
    expect.assertions(1)
    return pipe(
      scraper.getComicSeriesSearch('title'),
      map((res) => {
        expect(res).toMatchObject([
          {
            title: 'Series 1',
            url: `${URL}/series-1.html`,
          },
          {
            title: 'Series 2',
            url: `${URL}/series-2.html`,
          },
        ])
      }),
    )()
  })
})
