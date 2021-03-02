import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/function'

import type { IScraper, ComicBookData } from 'services/ScrapeService'

interface WithUrl {
  url: string
}

export function getComicBookByUrl(
  scraper: IScraper,
): (entity: WithUrl) => TE.TaskEither<Error, ComicBookData> {
  return ({ url }) => pipe(url, scraper.getComicBook)
}
