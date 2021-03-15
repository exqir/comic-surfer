import * as O from 'fp-ts/lib/Option'

import type { ComicBookListData } from 'services/Scraper/Scraper.interface'

export const defaultComicBookListData: ComicBookListData = {
  nextPage: O.some('/next'),
  comicBookList: [
    {
      title: 'Comic Book',
      url: '/path',
      issueNo: '1',
      coverImgUrl: '/image.jpg',
    },
  ],
}
