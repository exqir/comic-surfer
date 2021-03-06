import { URL } from 'url'
import { ScrapeOptions, ScrapeResult } from 'scrape-it'
import sanitizeHtml from 'sanitize-html'
import { pipe } from 'fp-ts/lib/pipeable'
import { left, right } from 'fp-ts/lib/Either'
import { map } from 'fp-ts/lib/TaskEither'
import { IScraper } from './ScrapeService'
import { Logger } from 'types/app'

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

const convertUrl = (baseUrl: string, logger: Logger): convertFn => (
  href: string,
) => {
  try {
    const url = new URL(href, baseUrl)
    url.search = ''
    return url.href
  } catch (e) {
    logger.error(e)
    return ''
  }
}

type convertFn = (href: string) => string

const comicSeriesConfig = (convertFn: convertFn) => ({
  title: '.item-title',
  urls: {
    listItem: '.header-row-title-link',
    data: {
      name: '.list-title-header',
      url: {
        attr: 'href',
        convert: convertFn,
      },
    },
  },
})

interface ComicBookListScrapData {
  // TODO: nextPage will be an empty string if not available on the page
  // Comixology has `#` as href if their is pagination but no next page
  nextPage: string
  comicBookList: {
    title: string
    url: string
    issueNo: string
    coverImgUrl: string
  }[]
}

const comicBookListConfig = (convertFn: convertFn) => ({
  nextPage: {
    selector: '.pagination-page.next .pagination-link',
    attr: 'href',
  },
  comicBookList: {
    listItem: '.comic-item',
    data: {
      title: {
        selector: '.content-title',
        convert: (title: string) => title.replace(/\([\w-]*\)$/, '').trim(),
      },
      url: {
        selector: '.content-details',
        attr: 'href',
        convert: convertFn,
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
})

interface ComicBookScrapData {
  title: string
  issueNo: string
  meta: {
    type: string
    date: Date
  }[]
  creators: {
    type: string
    name: string
    url: string
  }[]
  coverImgUrl: string
  description: string
}

const comicBookConfig = (convertFn: convertFn) => ({
  title: {
    selector: '.item-title',
    convert: (title: string) => title.replace(/\([\w-]*\)$/, '').trim(),
  },
  issueNo: {
    selector: '.item-subtitle',
    convert: (issue: string) => (issue.match(/[0-9]+/) || [''])[0],
  },
  meta: {
    listItem: '.secondary-credits',
    data: {
      type: '.tag-label',
      date: {
        selector: '.credit-value',
        // TODO: new Date() seems to be a day off.
        // new Date('November 2, 2016').toISOString()
        // "2016-11-01T23:00:00.000Z"
        convert: (date: string) => new Date(date),
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
        convert: convertFn,
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
    convert: (html: string) =>
      sanitizeHtml(html, {
        // Only allow basic text tags and br for general text styling
        allowedTags: ['br', 'b', 'i', 'em', 'strong'],
        selfClosing: ['br'],
      }),
  },
})

interface ComicSeriesSearchScrapData {
  searchResults: {
    title: string
    url: string
  }[]
}

const comicSeriesSearchConfig = (convertFn: convertFn) => ({
  searchResults: {
    listItem: '.item-series-link',
    data: {
      title: '.small-title',
      url: {
        attr: 'href',
        convert: convertFn,
      },
    },
  },
})

export function comixology(
  scraper: scrapeIt,
  logger: Logger,
  baseUrl: string,
): IScraper {
  const _convertUrl = convertUrl(baseUrl, logger)

  function getUrl(path: string) {
    return new URL(path, baseUrl)
  }

  function scrape<T>(url: URL, config: ScrapeOptions) {
    return async () => {
      try {
        const { data, response } = await scraper<T>(url.href, config)
        if (response.statusCode !== 200) {
          throw new Error(
            `Failed to scrap ${url.href}: Responded with ${response.statusCode}`,
          )
        }
        return right<Error, T>(data)
      } catch (e) {
        logger.error(e)
        return left<Error, T>(e)
      }
    }
  }

  return {
    getComicSeries: (path: string) => {
      const url = getUrl(path)

      return pipe(
        scrape<ComicSeriesScrapData>(url, comicSeriesConfig(_convertUrl)),
        map(({ title, urls }) => ({
          title,
          url: url.href,
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
    },
    getComicBookList: (path: string) => {
      const url = getUrl(path)
      url.searchParams.set('sort', 'desc')
      return pipe(
        scrape<ComicBookListScrapData>(url, comicBookListConfig(_convertUrl)),
      )
    },
    getComicBook: (path: string) => {
      const url = getUrl(path)

      return pipe(
        scrape<ComicBookScrapData>(url, comicBookConfig(_convertUrl)),
        map(({ meta, creators, ...rest }) => ({
          ...rest,
          url: url.href,
          releaseDate:
            meta.find(({ type }) => type.includes('Release Date'))?.date ??
            null,
          creators: [
            ...new Set<string>(
              creators
                .filter(
                  ({ type }) =>
                    type.includes('Written by') ||
                    type.includes('Art by') ||
                    type.includes('Cover by') ||
                    type.includes('Pencils') ||
                    type.includes('Inks') ||
                    type.includes('Colored by'),
                )
                .map(({ name }) => name),
            ),
          ].map((name) => ({ name })),
          publisher:
            // TODO remove type
            creators.find(({ type }) => type.includes('Publish')) ?? null,
        })),
      )
    },
    getComicSeriesSearch: (query: string) => {
      const url = getUrl(`/search/series?search=${query}`)

      return pipe(
        scrape<ComicSeriesSearchScrapData>(
          url,
          comicSeriesSearchConfig(_convertUrl),
        ),
        map(({ searchResults }) => searchResults),
      )
    },
  }
}
