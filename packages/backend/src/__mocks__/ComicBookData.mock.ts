import type { ComicBookData } from 'services/Scraper/Scraper.interface'

export const defaultComicBookData: ComicBookData = {
  title: 'Comic Series',
  url: '/path',
  issueNo: '1',
  coverImgUrl: '/image.jpg',
  creators: [{ name: 'Author' }],
  publisher: { name: 'Publisher', url: '/publisher' },
  releaseDate: new Date(),
  description: 'What is this about?',
}
