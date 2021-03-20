import scrapeIt, { ScrapeOptions, ScrapeResult } from 'scrape-it'
import { URL } from 'url'
import sanitizeHtml from 'sanitize-html'
import { constant, pipe, unsafeCoerce } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/TaskEither'
import * as E from 'fp-ts/lib/Either'
import * as O from 'fp-ts/lib/Option'
import * as A from 'fp-ts/lib/Array'
import * as Eq from 'fp-ts/lib/Eq'

import type { ILogger } from 'services/LogService'
import type { IEnvironmentService } from 'services/Environment/Environment.interface'
import type {
  IScraperService,
  ComicSeriesData,
  ComicBookListData,
  ComicBookData,
  ComicSeriesSearchData,
} from './Scraper.interface'
import { getUrl as extractUrl } from 'functions/common'

interface IComixologyOptions {
  scraper: scrapeIt
  logger: ILogger
  env: IEnvironmentService
}

function getHref(url: URL): string {
  return url.href
}

function removeSearchParams(url: URL): URL {
  // This should not be able to fail, since it takes only a valid URL
  const u = new URL(url.toString())
  u.search = ''
  return u
}

function setSearchParams(name: string, value: string): (url: URL) => URL {
  return (url) => {
    // This should not be able to fail, since it takes only a valid URL
    const u = new URL(url.toString())
    u.searchParams.set(name, value)
    return u
  }
}

function prependOrigin(path: string): (origin: string) => E.Either<Error, URL> {
  return (origin) =>
    E.tryCatch(
      () => new URL(path, origin),
      (reason) => unsafeCoerce<unknown, Error>(reason),
    )
}

export function comixology({
  scraper,
  logger,
  env,
}: IComixologyOptions): IScraperService {
  function scrape<T>(
    config: ScrapeOptions,
  ): (url: URL) => TE.TaskEither<Error, T> {
    return (url) =>
      TE.tryCatch(
        async () => {
          const { data, response } = await scraper<T>(url.href, config)
          if (response.statusCode !== 200) {
            throw new Error(
              `Failed to scrap ${url.href}: ${response.statusCode}`,
            )
          }
          return data
        },
        (reason) => unsafeCoerce<unknown, Error>(reason),
      )
  }

  return {
    getComicSeries: (path: string): TE.TaskEither<Error, ComicSeriesData> => {
      function normalizeUrl(path: string): E.Either<Error, URL> {
        return pipe(
          env.getSourceOrigin(),
          E.fromOption(
            constant(new Error('Origin for ScraperService is not defined.')),
          ),
          E.chain(prependOrigin(path)),
          E.map(removeSearchParams),
        )
      }

      function getUrlByName(
        name: string,
      ): (urls: ComicSeriesScrapData['urls']) => O.Option<string> {
        return (urls) =>
          pipe(
            urls,
            A.findFirst((u) => u.name.toLowerCase().includes(name)),
            O.map(extractUrl),
            O.chain((p) => O.fromEither(normalizeUrl(p))),
            O.map(getHref),
          )
      }

      const url = normalizeUrl(path)

      return pipe(
        url,
        TE.fromEither,
        TE.chain(scrape<ComicSeriesScrapData>(comicSeriesConfig)),
        TE.map(({ title, urls }) => ({
          title,
          // TODO: Avoid type cast.
          // Should be save as in case of Left map will not be called.
          url: (url as E.Right<URL>).right.href,
          collectionsUrl: pipe(urls, getUrlByName('collected')),
          singleIssuesUrl: pipe(urls, getUrlByName('issues')),
        })),
      )
    },

    getComicBookList: (
      path: string,
    ): TE.TaskEither<Error, ComicBookListData> => {
      function normalizeUrl(path: string): E.Either<Error, URL> {
        return pipe(
          env.getSourceOrigin(),
          E.fromOption(
            constant(new Error('Origin for ScraperService is not defined.')),
          ),
          // Keep searchParams to keep pagination values
          E.chain(prependOrigin(path)),
        )
      }

      const url = normalizeUrl(path)

      return pipe(
        url,
        E.map(setSearchParams('sort', 'desc')),
        TE.fromEither,
        TE.chain(scrape<ComicBookListScrapData>(comicBookListConfig)),
        TE.map(({ nextPage, comicBookList }) => ({
          nextPage: pipe(
            nextPage,
            O.fromPredicate((p) => p !== '' && p !== '#'),
          ),
          comicBookList: pipe(
            comicBookList,
            A.map((comicBook) => ({
              coverImgUrl: comicBook.coverImgUrl,
              // TODO: Is removing the year from title necessary Batman (2011) -> Batman
              // or was this done for another reason?
              title: comicBook.title.replace(/\([\w-]*\)$/, '').trim(),
              // TODO: The searchParams could be removed here
              url: pipe(
                normalizeUrl(comicBook.url),
                E.map(getHref),
                O.fromEither,
              ),
              issueNo: pipe(
                comicBook.issueNo,
                (str: string): RegExpMatchArray => str.match(/[0-9]+/) ?? [],
                A.head,
                O.map(Number),
              ),
            })),
          ),
        })),
      )
    },
    getComicBook: (path: string): TE.TaskEither<Error, ComicBookData> => {
      function normalizeUrl(path: string): E.Either<Error, URL> {
        return pipe(
          env.getSourceOrigin(),
          E.fromOption(
            constant(new Error('Origin for ScraperService is not defined.')),
          ),
          E.chain(prependOrigin(path)),
          E.map(removeSearchParams),
        )
      }

      const url = normalizeUrl(path)

      return pipe(
        url,
        TE.fromEither,
        TE.chain(scrape<ComicBookScrapData>(comicBookConfig)),
        TE.map(
          ({ title, meta, creators, issueNo, coverImgUrl, description }) => ({
            coverImgUrl,
            // TODO: Is removing the year from title necessary Batman (2011) -> Batman
            // or was this done for another reason?
            title: title.replace(/\([\w-]*\)$/, '').trim(),
            // TODO: Avoid type cast.
            // Should be save as in case of Left map will not be called.
            url: (url as E.Right<URL>).right.href,
            releaseDate: pipe(
              meta,
              A.findFirst(({ type }) =>
                type.toLowerCase().includes('release date'),
              ),
              // TODO: This could fail if date is not a valid date string
              O.map(({ date }) => new Date(date)),
            ),
            creators: pipe(
              creators,
              A.filter(
                ({ type }) =>
                  type.includes('Written by') ||
                  type.includes('Art by') ||
                  type.includes('Cover by') ||
                  type.includes('Pencils') ||
                  type.includes('Inks') ||
                  type.includes('Colored by'),
              ),
              A.uniq(Eq.getStructEq({ name: Eq.eqString })),
              A.map(({ name }) => ({ name })),
            ),
            publisher: pipe(
              creators,
              A.findFirst(({ type }) => type.toLowerCase().includes('publish')),
              O.map(({ name, url }) => ({
                name,
                url: pipe(
                  normalizeUrl(url),
                  E.map(getHref),
                  // TODO: Handle error case
                  E.getOrElse(() => ''),
                ),
              })),
            ),
            issueNo: pipe(
              issueNo,
              (str: string): RegExpMatchArray => str.match(/[0-9]+/) ?? [],
              A.head,
              O.map(Number),
            ),
            description: O.tryCatch(() =>
              sanitizeHtml(description, {
                // Only allow basic text tags and br for general text styling
                allowedTags: ['br', 'b', 'i', 'em', 'strong'],
                selfClosing: ['br'],
              }),
            ),
          }),
        ),
      )
    },
    getComicSeriesSearch: (
      query: string,
    ): TE.TaskEither<Error, ComicSeriesSearchData[]> => {
      function normalizeUrl(path: string): E.Either<Error, URL> {
        return pipe(
          env.getSourceOrigin(),
          E.fromOption(
            constant(new Error('Origin for ScraperService is not defined.')),
          ),
          E.chain(prependOrigin(path)),
        )
      }

      const url = normalizeUrl('/search/series')

      return pipe(
        url,
        E.map(setSearchParams('search', query)),
        TE.fromEither,
        TE.chain(scrape<ComicSeriesSearchScrapData>(comicSeriesSearchConfig)),
        TE.map(({ searchResults }) => searchResults),
        TE.map(
          A.map(({ title, url }) => ({
            title,
            url: pipe(url, normalizeUrl, E.map(getHref), O.fromEither),
          })),
        ),
      )
    },
  }
}

type scrapeIt = <T>(
  url: string | object,
  options: ScrapeOptions,
) => Promise<ScrapeResult<T>>

interface ComicSeriesScrapData {
  title: string
  urls: {
    name: string
    url: string
  }[]
}

const comicSeriesConfig = {
  title: '.item-title',
  urls: {
    listItem: '.header-row-title-link',
    data: {
      name: '.list-title-header',
      url: {
        attr: 'href',
      },
    },
  },
}
interface ComicBookListScrapData {
  // TODO: nextPage will be an empty string if not available on the page
  // Comixology has `#` as href if their is pagination but no next page
  nextPage: '' | '#' | string
  comicBookList: {
    title: string
    url: string
    issueNo: string
    coverImgUrl: string
  }[]
}

const comicBookListConfig = {
  nextPage: {
    selector: '.pagination-page.next .pagination-link',
    attr: 'href',
  },
  comicBookList: {
    listItem: '.comic-item',
    data: {
      title: {
        selector: '.content-title',
        // TODO: Is removing the year from title necessary Batman (2011) -> Batman
        // If they should be keeped, should they be moved to the function instead?
        convert: (title: string) => title.replace(/\([\w-]*\)$/, '').trim(),
      },
      url: {
        selector: '.content-details',
        attr: 'href',
      },
      issueNo: {
        selector: '.content-subtitle',
        convert: (issue: string) => (issue.match(/[0-9]+/) || [''])[0],
      },
      coverImgUrl: {
        selector: '.content-img',
        attr: 'src',
      },
    },
  },
}

interface ComicBookScrapData {
  title: string
  issueNo: string
  meta: {
    type: string
    date: string
  }[]
  creators: {
    type: string
    name: string
    url: string
  }[]
  coverImgUrl: string
  description: string
}

const comicBookConfig = {
  title: {
    selector: '.item-title',
  },
  issueNo: {
    selector: '.item-subtitle',
  },
  meta: {
    listItem: '.secondary-credits',
    data: {
      type: '.tag-label',
      date: {
        selector: '.credit-value',
      },
    },
  },
  creators: {
    listItem: '.tag',
    data: {
      type: '.tag-label',
      name: '.tag-link',
      url: {
        selector: '.tag-element',
        attr: 'href',
      },
    },
  },
  coverImgUrl: {
    selector: '.cover',
    attr: 'src',
  },
  description: {
    selector: '.item-description',
    how: 'html',
  },
}

interface ComicSeriesSearchScrapData {
  searchResults: {
    title: string
    url: string
  }[]
}

const comicSeriesSearchConfig = {
  searchResults: {
    listItem: '.item-series-link',
    data: {
      title: '.small-title',
      url: {
        attr: 'href',
      },
    },
  },
}
