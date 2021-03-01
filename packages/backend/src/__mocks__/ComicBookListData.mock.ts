import type { ComicBookListData } from 'services/ScrapeService'

export const defaultComicBookListData: ComicBookListData = {
  nextPage: '/next',
  comicBookList: [
    {
      title: 'Comic Book',
      url: '/path',
      issueNo: '1',
      coverImgUrl: '/image.jpg',
    },
  ],
}
