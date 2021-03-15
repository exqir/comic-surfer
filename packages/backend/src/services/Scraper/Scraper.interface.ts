import { TaskEither } from 'fp-ts/lib/TaskEither'
import { Option } from 'fp-ts/lib/Option'

export type ComicSeriesData = {
  title: string
  url: string
  collectionsUrl: string
  singleIssuesUrl: string
}

export type ComicBookListData = {
  nextPage: Option<string>
  comicBookList: {
    title: string
    url: string
    issueNo: string
    coverImgUrl: string
  }[]
}

export type ComicBookData = {
  title: string
  url: string
  issueNo: string
  coverImgUrl: string
  creators: { name: string }[]
  publisher: { name: string; url: string } | null
  releaseDate: Date | null
  description: string | null
}

export type ComicSeriesSearchData = {
  title: string
  url: string
}

export interface IScraperService {
  getComicSeries: (path: string) => TaskEither<Error, ComicSeriesData>
  getComicBookList: (path: string) => TaskEither<Error, ComicBookListData>
  getComicBook: (path: string) => TaskEither<Error, ComicBookData>
  getComicSeriesSearch: (
    path: string,
  ) => TaskEither<Error, ComicSeriesSearchData[]>
}
