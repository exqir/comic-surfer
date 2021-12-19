import { TaskEither } from 'fp-ts/lib/TaskEither'
import { Option } from 'fp-ts/lib/Option'

export type ComicSeriesData = {
  title: string
  url: string
  collectionsUrl: Option<string>
  singleIssuesUrl: Option<string>
}

export type ComicBookListData = {
  nextPage: Option<string>
  comicBookList: {
    title: string
    url: Option<string>
    issueNo: Option<number>
    coverImgUrl: string
  }[]
}

export type ComicBookData = {
  title: string
  url: string
  issueNo: Option<number>
  coverImgUrl: string
  creators: { name: string }[]
  publisher: Option<{ name: string; url: string }>
  releaseDate: Option<Date>
  description: Option<string>
}

export type ComicSeriesSearchData = {
  title: string
  url: Option<string>
}

export interface IScraperService {
  getComicSeries: (path: string) => TaskEither<Error, ComicSeriesData>
  getComicBookList: (path: string) => TaskEither<Error, ComicBookListData>
  getComicBook: (path: string) => TaskEither<Error, ComicBookData>
  getComicSeriesSearch: (
    path: string,
  ) => TaskEither<Error, ComicSeriesSearchData[]>
}
