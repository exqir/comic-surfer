import type { IComicSeriesRepository } from './ComicSeries.interface'

interface ComicSeriesModelOptions<R, E extends Error> {
  comicSeriesRepository: IComicSeriesRepository<R, E>
}

export function ComicSeriesModel<R, E extends Error>({
  comicSeriesRepository,
}: ComicSeriesModelOptions<R, E>) {
  return {}
}
