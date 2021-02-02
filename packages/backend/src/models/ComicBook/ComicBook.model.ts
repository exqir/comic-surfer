import type { IComicBookRepository } from './ComicBook.interface'

interface ComicBookModelOptions<R, E extends Error> {
  comicBookRepository: IComicBookRepository<R, E>
}

export function ComicBookModel<R, E extends Error>({
  comicBookRepository,
}: ComicBookModelOptions<R, E>) {
  return {}
}
