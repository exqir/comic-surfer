import { Resolver, DataSources } from 'types/app'
import { QuerySearchArgs, Search } from 'types/server-schema'
import { foldTEtoNullable, runRTEtoNullable } from 'lib'
import { pipe } from 'fp-ts/lib/pipeable'
import { identity } from 'fp-ts/lib/function'
import { fold, map } from 'fp-ts/lib/Option'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as RT from 'fp-ts/lib/ReaderTask'
import * as T from 'fp-ts/lib/Task'
import * as O from 'fp-ts/lib/Option'

import { getUserOrThrow } from '../pullList/pullListResolver'
import { ComicSeriesSearchData } from 'services/ScrapeService'

type EnhancedSearch = Omit<Search, 'inPullList'> & {
  comicSeriesUrlsInPullList: string[]
}
interface SearchQuery {
  // TODO: This actually returns a Search but this is not what the function returns
  // but what is returned once all field resolvers are done
  search: Resolver<EnhancedSearch[], QuerySearchArgs>
}

interface SearchResolver {
  Search: {
    inPullList: Resolver<Boolean, {}, EnhancedSearch>
  }
}

function enhanceSearchWithComicSeriesUrlFromPullList({
  dataSources,
  user,
}: {
  dataSources: DataSources
  user: O.Option<string>
}) {
  return (comicSeriesSearchData: ComicSeriesSearchData[]) =>
    // TODO: Add aggregate to mongad to be able to use $lookup instead
    pipe(
      dataSources.pullList.getByUser(getUserOrThrow(user)),
      RTE.chain((pullList) => {
        if (pullList === null)
          throw new Error('No pullList for the user exists')
        return dataSources.comicSeries.getByIds(pullList.list)
      }),
      RTE.map((comicSeries) =>
        comicSeries.map(({ url: comicSeriesUrl }) => comicSeriesUrl),
      ),
      RTE.map((comicSeriesUrlsInPullList) =>
        comicSeriesSearchData.map((searchData) => ({
          ...searchData,
          comicSeriesUrlsInPullList,
        })),
      ),
    )
}

export const SearchQuery: SearchQuery = {
  search: (_, { q }, { services, dataSources, db, user }) =>
    // TODO: Also search in the db for existing series.
    pipe(
      db,
      map(
        runRTEtoNullable(
          pipe(
            RTE.fromTaskEither(services.scrape.getComicSeriesSearch(q)),
            RTE.chainW(
              enhanceSearchWithComicSeriesUrlFromPullList({
                dataSources,
                user,
              }),
            ),
          ),
        ),
      ),
      O.toNullable,
    ),
}

export const SearchResolver: SearchResolver = {
  Search: {
    inPullList: ({ url, comicSeriesUrlsInPullList }) =>
      comicSeriesUrlsInPullList.includes(url),
  },
}
