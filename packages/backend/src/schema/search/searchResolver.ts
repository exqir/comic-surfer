import { Resolver } from 'types/app'
import { QuerySearchArgs, Search } from 'types/server-schema'
import { foldTEtoNullable, runRTEtoNullable } from 'lib'
import { pipe } from 'fp-ts/lib/pipeable'
import { toNullable, map } from 'fp-ts/lib/Option'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'

import { getUserOrThrow } from '../pullList/pullListResolver'

interface SearchQuery {
  // TODO: This actually returns a Search but this is not what the function returns
  // but what is returned once all field resolvers are done
  search: Resolver<Search[], QuerySearchArgs>
}

interface SearchResolver {
  Search: {
    inPullList: Resolver<Boolean, {}, Search>
  }
}

export const SearchQuery: SearchQuery = {
  search: (_, { q }, { services }) =>
    // TODO: Also search in the db for existing series.
    pipe(services.scrape.getComicSeriesSearch(q), foldTEtoNullable())(),
}

export const SearchResolver: SearchResolver = {
  Search: {
    // TODO: Add aggregate to mongad to be able to use $lookup instead
    inPullList: ({ url }, _, { dataSources, db, user }) =>
      pipe(
        db,
        map(
          runRTEtoNullable(
            pipe(
              dataSources.pullList.getByUser(getUserOrThrow(user)),
              RTE.chain((pullList) => {
                if (pullList === null)
                  throw new Error('No pullList for the user exists')
                return dataSources.comicSeries.getByIds(pullList.list)
              }),
              RTE.map((comicSeries) =>
                comicSeries
                  .map(({ url: comicSeriesUrl }) => comicSeriesUrl)
                  .includes(url),
              ),
            ),
          ),
        ),
        toNullable,
      ),
  },
}
