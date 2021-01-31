import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import { pipe } from 'fp-ts/lib/function'
import { ObjectID } from 'mongodb'

import { PullListDbObject } from 'types/server-schema'

type Owner = string
type ComicSeriesId = ObjectID

export interface IPullListRepository<R, E extends Error = Error> {
  createPullList: (owner: Owner) => RTE.ReaderTaskEither<R, E, PullListDbObject>

  getPullListByOwner: (
    owner: Owner,
  ) => RTE.ReaderTaskEither<R, E, PullListDbObject>

  getPullListByOwnerOrNull: (
    owner: Owner,
  ) => RTE.ReaderTaskEither<R, E, PullListDbObject | null>

  addComicSeriesToPullList: (
    owner: Owner,
    comicSeriesId: ComicSeriesId,
  ) => RTE.ReaderTaskEither<R, E, PullListDbObject>

  removeComicSeriesFromPullList: (
    owner: Owner,
    comicSeriesId: ComicSeriesId,
  ) => RTE.ReaderTaskEither<R, E, PullListDbObject>
}

interface PullListModelOptions<R, E extends Error> {
  pullListRepository: IPullListRepository<R, E>
}

export function PullListModel<R, E extends Error>({
  pullListRepository,
}: PullListModelOptions<R, E>) {
  function getOrCreatePullListByOwner(owner: Owner) {
    return pipe(
      pullListRepository.getPullListByOwnerOrNull(owner),
      RTE.chain((pullList) =>
        pullList !== null
          ? RTE.right(pullList)
          : pullListRepository.createPullList(owner),
      ),
    )
  }

  return {
    getPullListByOwner: pullListRepository.getPullListByOwner,
    getOrCreatePullListByOwner,
    addComicSeriesToPullList: pullListRepository.addComicSeriesToPullList,
    removeComicSeriesFromPullList:
      pullListRepository.removeComicSeriesFromPullList,
  }
}
