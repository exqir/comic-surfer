import * as O from 'fp-ts/lib/Option'

import type { ComicBookData } from 'services/Scraper/Scraper.interface'

export const defaultComicBookData: ComicBookData = {
  title: 'Comic Series',
  url: '/path',
  issueNo: O.some(1),
  coverImgUrl: '/image.jpg',
  creators: [{ name: 'Author' }],
  publisher: O.some({ name: 'Publisher', url: '/publisher' }),
  releaseDate: O.some(new Date()),
  description: O.some('What is this about?'),
}
