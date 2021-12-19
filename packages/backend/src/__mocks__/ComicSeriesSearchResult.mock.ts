import * as O from 'fp-ts/lib/Option'

import type { ComicSeriesSearchData } from 'services/Scraper/Scraper.interface'

export const defaultComicSeriesSearchResult: ComicSeriesSearchData = {
  title: 'Comic',
  url: O.some('/path'),
}
