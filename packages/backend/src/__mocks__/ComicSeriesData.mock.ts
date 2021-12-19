import * as O from 'fp-ts/lib/Option'

import type { ComicSeriesData } from 'services/Scraper/Scraper.interface'

export const defaultComicSeriesData: ComicSeriesData = {
  title: 'Comic Series',
  url: '/path',
  collectionsUrl: O.some('/collections'),
  singleIssuesUrl: O.some('/single-issues'),
}
