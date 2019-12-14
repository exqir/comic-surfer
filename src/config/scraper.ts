import { ScrapeOptionElement, ScrapeOptionList, ScrapeOptions } from 'scrape-it'

type Selector = string | ScrapeOptionElement | ScrapeOptionList
/**
 * COMIC SERIES
 */
interface ComicSeriesConfig extends ScrapeOptions {
  title: Selector
  collectionUrl: Selector
  singleIssuesUrl: Selector
}
export interface ComicSeriesScrapeData {
  title: string
  collectionUrl: string
  singleIssuesUrl: string
}
export interface ComicSeriesScraperConfig {
  [name: string]: ComicSeriesConfig
}
export const comicSeries: ComicSeriesScraperConfig = {
  image: {
    title: '.header__title',
    collectionUrl: {
      selector: '.section__moreLink',
      attr: 'href',
      eq: 0,
    },
    singleIssuesUrl: {
      selector: '.section__moreLink',
      attr: 'href',
      eq: 1,
    },
  },
}

/**
 * COMIC BOOK LIST
 */

interface ComicBookListConfig extends ScrapeOptions {
  comicBookList: {
    listItem: string
    data: {
      title: Selector
      url: Selector
      issue: Selector
      releaseDate: Selector
    }
  }
}
export interface ComicBookListScrapeData {
  comicBookList: {
    title: string
    url: string
    issue: string
    releaseDate: number
  }[]
}
export interface ComicBookListScraperConfig {
  [name: string]: ComicBookListConfig
}
export const comicBookList: ComicBookListScraperConfig = {
  image: {
    comicBookList: {
      listItem: '.book',
      data: {
        title: '.book__headline a',
        url: {
          selector: '.book__headline a',
          attr: 'href',
        },
        issue: {
          selector: '.book__headline a',
          convert: (title: string) => (title.match(/[0-9]+$/) || [''])[0],
        },
        releaseDate: {
          selector: '.book__text',
          convert: (dateString: string) =>
            Date.parse(dateString.replace('Published:', '').trim()),
        },
      },
    },
  },
}

/**
 * COMIC BOOK
 */

interface ComicBookConfig extends ScrapeOptions {
  creators: {
    listItem: string
    data: {
      author: Selector
      artist: Selector
    }
  }
  imageUrl: Selector
}
export interface ComicBookScrapeData {
  creators: {
    author: string
    artist: string
  }[]
  imageUrl: string
}
export interface ComicBookScraperConfig {
  [name: string]: ComicBookConfig
}
export const comicBook: ComicBookScraperConfig = {
  image: {
    creators: {
      listItem: '.header__title + p',
      data: {
        author: {
          selector: 'a',
          eq: 0,
        },
        artist: {
          selector: 'a',
          eq: 1,
        },
      },
    },
    imageUrl: {
      selector: '.book-cover img.book',
      attr: 'src',
    },
  },
}

/**
 * COMIC SERIES SEARCH
 */

interface ComicSeriesSearchConfig extends ScrapeOptions {
  searchResults: {
    listItem: string
    data: {
      title: Selector
      url: Selector
    }
  }
}
export interface ComicSeriesSearchScrapeData {
  searchResults: {
    title: string
    url: string
  }[]
}
export interface ComicSeriesSearchScraperConfig {
  [name: string]: ComicSeriesSearchConfig
}
export const comicSeriesSearch: ComicSeriesSearchScraperConfig = {
  image: {
    searchResults: {
      listItem: '.news-list li h2',
      data: {
        title: 'a',
        url: {
          selector: 'a',
          attr: 'href',
        },
      },
    },
  },
}
