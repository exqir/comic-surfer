import { map } from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/pipeable'
import * as O from 'fp-ts/lib/Option'
import handler from 'serve-handler'
import http from 'http'
import scrapeIt from 'scrape-it'

import type { IEnvironmentService } from 'services/Environment/Environment.interface'
import { comixology } from 'services/Scraper/ComixologyScaper'
import { logger } from '__tests__/_mock'

const PORT = 9000
const URL = `http://localhost:${PORT}`
const env = ({
  getSourceOrigin: jest.fn().mockReturnValue(O.some(URL)),
} as unknown) as IEnvironmentService
const scraper = comixology({ scraper: scrapeIt, logger, env })
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
          collectionsUrl: O.some(`${URL}/collections.html`),
          singleIssuesUrl: O.some(`${URL}/issues.html`),
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
        expect(res).toMatchObject({
          nextPage: O.some('/next-page'),
          comicBookList: [
            {
              title: 'Comic Book 2',
              url: O.some(`${URL}/issue-2.html`),
              issueNo: O.some(2),
              coverImgUrl: '/issue-2-cover.jpg',
            },
            {
              title: 'Comic Book 1',
              url: O.some(`${URL}/issue-1.html`),
              issueNo: O.some(1),
              coverImgUrl: '/issue-1-cover.jpg',
            },
          ],
        })
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
          issueNo: O.some(78),
          publisher: O.some({ name: 'DC', url: `${URL}/dc` }),
          releaseDate: O.some(new Date('November 2, 2016')),
          creators: [{ name: 'Joshua Williamson' }, { name: 'Mike Henderson' }],
          coverImgUrl: '/cover.png',
          description: O.some(`"THE DIGITAL MAGE" <br />
      The hit fantasy series from powerhouse creative team
      <strong>JEFF LEMIRE</strong> and
      DUSTIN NGUYEN continues! <br />
      <br />
      
      Captain Telsa is doing her best to shake off young Mila and Bandit, but
      things get harder once an old friend wants to tag along—DRILLER, the
      KILLER ROBOT! With his faithful companion Mizard the Wizard at his side,
      Mother and her evil army of vamps may have finally met their match.
      Meanwhile, Andy struggles to resurrect his lost love Effie from the
      relentless grasp of the vampire undead. <br />
      <br />
      Collects ASCENDER #11-14`),
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
            url: O.some(`${URL}/series-1.html`),
          },
          {
            title: 'Series 2',
            url: O.some(`${URL}/series-2.html`),
          },
        ])
      }),
    )()
  })
})
