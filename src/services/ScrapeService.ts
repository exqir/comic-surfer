import { ScrapeOptions, ScrapeResult } from 'scrape-it'
import { pipe } from 'fp-ts/lib/pipeable'
import { left, right } from 'fp-ts/lib/Either'
import { TaskEither, map } from 'fp-ts/lib/TaskEither'
import { PublisherDbObject } from 'types/server-schema'
import {
  comicSeries,
  ComicSeriesScrapeData,
  comicBookList,
  ComicBookListScrapeData,
  comicBook,
  ComicBookScrapeData,
  comicSeriesSearch,
  ComicSeriesSearchScrapeData,
} from '../config/scraper'

type Scraper = <T>(
  url: string | object,
  options: ScrapeOptions,
) => Promise<ScrapeResult<T>>

export class ScrapeService {
  scraper: Scraper
  constructor(scraper: Scraper) {
    this.scraper = scraper
  }

  private scrape<T>(url: string, config: ScrapeOptions) {
    return async () => {
      try {
        const { data, response } = await this.scraper<T>(url, config)
        if (response.statusCode !== 200) {
          throw Error(
            `Failed to scrap ${url}: Responded with ${response.statusCode}`,
          )
        }
        return right<Error, T>(data)
      } catch (e) {
        return left<Error, T>(e)
      }
    }
  }

  getComicSeries(
    { name, basePath }: PublisherDbObject,
    path: string,
  ): TaskEither<Error, ComicSeriesScrapeData> {
    const url = `${basePath}${path}`
    const config = comicSeries[name]

    return this.scrape(url, config)
  }

  getComicBookList(
    { name, basePath }: PublisherDbObject,
    path: string,
  ): TaskEither<Error, ComicBookListScrapeData['comicBookList']> {
    const url = `${basePath}${path}`
    const config = comicBookList[name]

    return pipe(
      this.scrape<ComicBookListScrapeData>(url, config),
      map(({ comicBookList }) => comicBookList),
    )
  }

  getComicBook(
    { name, basePath }: PublisherDbObject,
    path: string,
  ): TaskEither<Error, ComicBookScrapeData> {
    const url = `${basePath}${path}`
    const config = comicBook[name]

    return pipe(this.scrape(url, config))
  }

  getComicSeriesSearch(
    { name, basePath }: PublisherDbObject,
    path: string,
  ): TaskEither<Error, ComicSeriesSearchScrapeData['searchResults']> {
    const url = `${basePath}${path}`
    const config = comicSeriesSearch[name]

    return pipe(
      this.scrape<ComicSeriesSearchScrapeData>(url, config),
      map(({ searchResults }) => searchResults),
    )
  }
}
