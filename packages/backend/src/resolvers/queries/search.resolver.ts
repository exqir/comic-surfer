import type { Db, MongoError } from 'mongodb'
import { AuthenticationError } from 'apollo-server'
import { flow, pipe } from 'fp-ts/lib/function'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'

import type { Resolver } from 'types/app'
import type {
  PullListDbObject,
  QuerySearchArgs,
  SearchResult,
} from 'types/graphql-schema'
import type {
  ComicSeriesSearchData,
  IScraperService,
} from 'services/Scraper/Scraper.interface'
import type { IComicSeriesRepository } from 'models/ComicSeries/ComicSeries.interface'
import { nullableField } from 'lib'
import { getByIds } from 'functions/common'
import { getUser } from 'functions/user'
import { getByOwner } from 'functions/pullList'

export type EnhancedSearchResult = Omit<SearchResult, 'inPullList'> & {
  comicSeriesUrlsInPullList: string[]
}

export const search: Resolver<EnhancedSearchResult[], QuerySearchArgs> = (
  _,
  { query },
  { services, dataSources, user, db },
) =>
  pipe(
    db,
    nullableField(
      pipe(
        query,
        getComicSeriesSearchResults(services.scrape),
        RTE.chain(
          mergeSearchResultsWithUrls(
            // TODO: Extract into own function
            pipe(
              getUser(user),
              // TODO: AuthenticationError type is lost on RTE.left
              RTE.chain(getByOwner(dataSources.pullList)),
              RTE.chain(
                getComicSeriesUrlsFromPullList(dataSources.comicSeries),
              ),
              RTE.orElse((error) => {
                if (error instanceof AuthenticationError) {
                  return RTE.right([])
                }
                return RTE.left(error)
              }),
            ),
          ),
        ),
      ),
    ),
  )

function getComicSeriesSearchResults(
  scraper: IScraperService,
): (
  query: string,
) => RTE.ReaderTaskEither<any, Error, ComicSeriesSearchData[]> {
  return flow(scraper.getComicSeriesSearch, RTE.fromTaskEither)
}

function getComicSeriesUrlsFromPullList(
  repo: IComicSeriesRepository<Db, Error | MongoError>,
): (
  pullList: PullListDbObject,
) => RTE.ReaderTaskEither<Db, Error | MongoError, string[]> {
  return ({ list }) =>
    pipe(
      list,
      getByIds(repo),
      RTE.map((comicSeries) => comicSeries.map(({ url }) => url)),
    )
}

function mergeSearchResultsWithUrls(
  urls: RTE.ReaderTaskEither<Db, Error | MongoError, string[]>,
): (
  comicSeriesSearchResult: ComicSeriesSearchData[],
) => RTE.ReaderTaskEither<Db, Error | MongoError, EnhancedSearchResult[]> {
  return (comicSeriesSearchResult) =>
    pipe(
      urls,
      RTE.map((comicSeriesUrlsInPullList) =>
        comicSeriesSearchResult.map((searchResult) => ({
          ...searchResult,
          comicSeriesUrlsInPullList,
        })),
      ),
    )
}
