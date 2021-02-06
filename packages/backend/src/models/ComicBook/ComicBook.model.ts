import type {
  IComicBookRepository,
  IComicBookModel,
} from './ComicBook.interface'

interface ComicBookModelOptions<R, E extends Error> {
  comicBookRepository: IComicBookRepository<R, E>
}

export function createComicBookModel<R, E extends Error>({
  comicBookRepository,
}: ComicBookModelOptions<R, E>): IComicBookModel<R, E> {
  return {
    getById: comicBookRepository.getById,
  }
}
