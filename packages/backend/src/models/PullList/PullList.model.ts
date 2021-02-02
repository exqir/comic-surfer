import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import { pipe } from 'fp-ts/lib/function'

import type { IPullListRepository, Owner } from './PullList.interface'

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
