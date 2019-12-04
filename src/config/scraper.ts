import scrapeIt from 'scrape-it'

type Selector = string | scrapeIt.ScrapeOptionElement

interface ComicSeriesPublisherConfig {
  title: Selector
  collectionUrl: Selector
  singleIssuesUrl: Selector
  [key: string]: Selector
}
export interface ComicSeriesScrapeResult {
  title: string
  collectionUrl: string
  singleIssuesUrl: string
}
export interface ComicSeriesScraperConfig {
  [name: string]: ComicSeriesPublisherConfig
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
