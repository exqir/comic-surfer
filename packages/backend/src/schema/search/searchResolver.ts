import { MongoError } from 'mongodb'
import { Resolver, NonNullableResolver, DataSources } from 'types/app'
import { QuerySearchArgs, Search } from 'types/server-schema'
import { foldTEtoNullable, runRTEtoNullable, nullableField } from 'lib'
import { pipe } from 'fp-ts/lib/pipeable'
import { identity } from 'fp-ts/lib/function'
import { fold, map } from 'fp-ts/lib/Option'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as RT from 'fp-ts/lib/ReaderTask'
import * as T from 'fp-ts/lib/Task'
import * as O from 'fp-ts/lib/Option'

import { getUserOrThrow, getUser } from '../pullList/pullListResolver'
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
    inPullList: NonNullableResolver<Boolean, {}, EnhancedSearch>
  }
}

const rtRun = <T, A>(rte: RT.ReaderTask<T, A>) => (t: T) => RT.run(rte, t)

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
      getUser(user),
      RTE.chainW((u) => dataSources.pullList.getByUser(u)),
      RTE.chainW((pullList) =>
        RTE.fromOption(() => new MongoError('PullList for user was `null`.'))(
          O.fromNullable(pullList),
        ),
      ),
      RTE.chainW((pullList) => dataSources.comicSeries.getByIds(pullList.list)),
      RTE.map((comicSeries) =>
        comicSeries.map(({ url: comicSeriesUrl }) => comicSeriesUrl),
      ),
      RTE.map((comicSeriesUrlsInPullList) =>
        comicSeriesSearchData.map((searchData) => ({
          ...searchData,
          comicSeriesUrlsInPullList,
        })),
      ),
      RTE.orElse((err) => {
        if (err instanceof MongoError)
          // A MongoError indicates that a user is logged-in but PullList or ComicSeries from the PullList could be retrieved from the database.
          // Retuning an empty array could also work but this would not reflect the correct result for a user.
          // In cause of other errors (Authentication) no user is logged-in and therefore an empty array reflects the correct result.
          return RTE.left(
            new Error(
              'Failed to determine ComicSeries from PullList for logged-in user.',
            ),
          )
        return RTE.right(
          comicSeriesSearchData.map((searchData) => ({
            ...searchData,
            comicSeriesUrlsInPullList: [] as string[],
          })),
        )
      }),
    )
}

export const SearchQuery: SearchQuery = {
  search: (_, { q }, { services, dataSources, db, user }) =>
    // TODO: Also search in the db for existing series.
    nullableField(
      db,
      runRTEtoNullable(
        pipe(
          RTE.fromTaskEither(services.scrape.getComicSeriesSearch(q)),
          RTE.chain(
            enhanceSearchWithComicSeriesUrlFromPullList({
              dataSources,
              user,
            }),
          ),
        ),
      ),
    ),
}

export const SearchResolver: SearchResolver = {
  Search: {
    inPullList: ({ url, comicSeriesUrlsInPullList }) =>
      comicSeriesUrlsInPullList.includes(url),
  },
}
