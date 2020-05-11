import { ScrapeOptionElement, ScrapeOptionList, ScrapeOptions } from 'scrape-it'

type Selector = string | ScrapeOptionElement | ScrapeOptionList
/**
 * COMIC SERIES
 */
interface ComicSeriesConfig extends ScrapeOptions {
  title: Selector
  urls: Selector
}
export interface ComicSeriesScrapeData {
  title: string
  urls: {
    name: string
    url: string
  }[]
}
export interface ComicSeriesScraperConfig {
  [name: string]: ComicSeriesConfig
}
export const comicSeries: ComicSeriesScraperConfig = {
  cx: {
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
    }
  }
}
export interface ComicBookListScrapeData {
  comicBookList: {
    title: string
    url: string
    issue: string
  }[]
}
export interface ComicBookListScraperConfig {
  [name: string]: ComicBookListConfig
}
export const comicBookList: ComicBookListScraperConfig = {
  cx: {
    comicBookList: {
      listItem: '.comic-item',
      data: {
        title: '.content-title',
        url: {
          selector: '.content-details',
          attr: 'href',
        },
        issue: {
          selector: '.content-subtitle',
          convert: (issue: string) => (issue.match(/[0-9]+/) || [''])[0],
        },
      },
    },
  },
}

/**
 * COMIC BOOK
 */

interface ComicBookConfig extends ScrapeOptions {
  meta: {
    listItem: string
    data: {
      type: Selector
      date: Selector
    }
  }
  creators: {
    listItem: string
    data: {
      type: Selector
      name: Selector
    }
  }
  imageUrl: Selector
}
export interface ComicBookScrapeData {
  meta: {
    type: string
    date: number
  }[]
  creators: {
    type: string
    name: string
  }[]
  imageUrl: string
}
export interface ComicBookScraperConfig {
  [name: string]: ComicBookConfig
}
export const comicBook: ComicBookScraperConfig = {
  cx: {
    meta: {
      listItem: '.secondary-credits',
      data: {
        type: '.tag-label',
        date: {
          selector: '.credit-value',
          convert: (date: string) => Date.parse(date),
        },
      },
    },
    creators: {
      listItem: '.tag',
      data: {
        type: '.tag-label',
        name: '.tag-link',
      },
    },
    imageUrl: {
      selector: '.cover',
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
  cx: {
    searchResults: {
      listItem: '.item-series-link',
      data: {
        title: '.small-title',
        url: {
          attr: 'href',
        },
      },
    },
  },
}
