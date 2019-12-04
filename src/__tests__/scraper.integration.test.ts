import { map } from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/pipeable'
import handler from 'serve-handler'
import http from 'http'
import { ObjectID } from 'mongodb'
import scrapeIt from 'scrape-it'
import { ScrapeService } from '../services/ScrapeService'

const PORT = 9000
const URL = `http://localhost:${PORT}`
const scraper = new ScrapeService(scrapeIt)
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

describe('[Scraper.getComicSeries]', () => {
  it('should scrap data from comic-series page', async () => {
    expect.assertions(1)
    return pipe(
      scraper.getComicSeries(
        { _id: new ObjectID(), name: 'image', basePath: URL },
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
