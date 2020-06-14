import { ScrapeOptions, ScrapeResult } from 'scrape-it'
import { pipe } from 'fp-ts/lib/pipeable'
import { left, right } from 'fp-ts/lib/Either'
import { TaskEither, map, mapLeft } from 'fp-ts/lib/TaskEither'
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
import { Logger } from 'types/app'

type Scraper = <T>(
  url: string | object,
  options: ScrapeOptions,
) => Promise<ScrapeResult<T>>

type ScrapeServiceOptions = {
  scraper: Scraper
  logger: Logger
  baseUrl: string
  searchPath: string
}
export class ScrapeService {
  scraper: Scraper
  logger: Logger
  baseUrl: string
  searchPath: string
  constructor({
    scraper,
    logger,
    baseUrl = '',
    searchPath = '',
  }: ScrapeServiceOptions) {
    this.scraper = scraper
    this.logger = logger
    this.baseUrl = baseUrl
    this.searchPath = searchPath
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
        this.logger.error(e)
        return left<Error, T>(e)
      }
    }
  }

  public getComicSeries = (
    path: string,
  ): TaskEither<
    Error,
    { title: string; collectionsUrl: string; singleIssuesUrl: string }
  > => {
    const url = `${this.baseUrl}${path}`
    const config = comicSeries.cx

    return pipe(
      this.scrape<ComicSeriesScrapeData>(url, config),
      map(({ title, urls }) => ({
        title,
        collectionsUrl: urls.reduce(
          (_, { name, url }) =>
            name.toLowerCase().includes('collected') ? url : _,
          '',
        ),
        singleIssuesUrl: urls.reduce(
          (_, { name, url }) =>
            name.toLowerCase().includes('issues') ? url : _,
          '',
        ),
      })),
    )
  }

  public getComicBookList = (
    path: string,
  ): TaskEither<Error, ComicBookListScrapeData['comicBookList']> => {
    const url = `${this.baseUrl}${path}`
    const config = comicBookList.cx

    return pipe(
      this.scrape<ComicBookListScrapeData>(url, config),
      map(({ comicBookList }) => comicBookList),
    )
  }

  public getComicBook = (
    path: string,
  ): TaskEither<
    Error,
    {
      coverImgUrl: string
      releaseDate: Date | null
      creators: { name: string }[]
    }
  > => {
    const url = `${this.baseUrl}${path}`
    const config = comicBook.cx

    return pipe(
      this.scrape<ComicBookScrapeData>(url, config),
      map(({ meta, creators, coverImgUrl }) => ({
        coverImgUrl,
        releaseDate:
          meta.find(({ type }) => type.includes('Release Date'))?.date ?? null,
        creators: creators
          .filter(({ type }) => !type.includes('Publish'))
          .map(({ name }) => ({ name })),
      })),
    )
  }

  public getComicSeriesSearch = (
    query: string,
  ): TaskEither<Error, ComicSeriesSearchScrapeData['searchResults']> => {
    const url = [this.baseUrl, this.searchPath, query].join('')
    const config = comicSeriesSearch.cx

    return pipe(
      this.scrape<ComicSeriesSearchScrapeData>(url, config),
      map(({ searchResults }) => searchResults),
    )
  }
}
