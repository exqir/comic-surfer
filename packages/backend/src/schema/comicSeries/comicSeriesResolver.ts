import { pipe } from 'fp-ts/lib/pipeable'
import { toNullable, map } from 'fp-ts/lib/Option'
import { Resolver } from 'types/app'
import {
  QueryComicSeriesArgs,
  ComicBookDbObject,
  PublisherDbObject,
  ComicSeriesDbObject,
} from 'types/server-schema'
import { runRTEtoNullable, chainMaybeToNullable, mapOtoRTEnullable } from 'lib'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as A from 'fp-ts/lib/Array'
import { TaskType } from 'datasources/QueueRepository'

interface ComicSeriesQuery {
  // TODO: This actually returns a ComicSeries but this is not what the function returns
  // but what is returned once all field resolvers are done
  comicSeries: Resolver<ComicSeriesDbObject, QueryComicSeriesArgs>
}

interface ComicSeriesMutation {
  updateComicSeries: Resolver<ComicSeriesDbObject[], {}>
}

interface ComicSeriesResolver {
  ComicSeries: {
    singleIssues: Resolver<ComicBookDbObject[], {}, ComicSeriesDbObject>
    publisher: Resolver<PublisherDbObject, {}, ComicSeriesDbObject>
    collections: Resolver<ComicBookDbObject[], {}, ComicSeriesDbObject>
  }
}

export const ComicSeriesQuery: ComicSeriesQuery = {
  comicSeries: (_, { id }, { dataSources, db }) =>
    pipe(
      db,
      map(runRTEtoNullable(dataSources.comicSeries.getById(id))),
      toNullable,
    ),
}

export const ComicSeriesMutation: ComicSeriesMutation = {
  updateComicSeries: (_, __, { dataSources, db }) =>
    pipe(
      db,
      map(
        runRTEtoNullable(
          pipe(
            dataSources.comicSeries.getLeastUpdated(),
            RTE.chainFirst((comicSeries) =>
              dataSources.queue.insertMany(
                A.flatten(
                  comicSeries.map(
                    ({ _id, singleIssuesUrl, collectionsUrl }) => [
                      {
                        type: TaskType.SCRAPSINGLEISSUELIST,
                        data: { comicSeriesId: _id, url: singleIssuesUrl! },
                      },
                      {
                        type: TaskType.SCRAPCOLLECTIONLIST,
                        data: { comicSeriesId: _id, url: collectionsUrl! },
                      },
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
      toNullable,
    ),
}

export const ComicSeriesResolver: ComicSeriesResolver = {
  ComicSeries: {
    singleIssues: ({ singleIssues }, _, { dataSources, db }) =>
      pipe(
        db,
        map(runRTEtoNullable(dataSources.comicBook.getByIds(singleIssues))),
        toNullable,
      ),
    publisher: ({ publisher }, _, { dataSources, db }) =>
      chainMaybeToNullable(
        publisher,
        mapOtoRTEnullable(db, dataSources.publisher.getById),
      ),
    collections: ({ collections }, _, { dataSources, db }) =>
      pipe(
        db,
        map(runRTEtoNullable(dataSources.comicBook.getByIds(collections))),
        toNullable,
      ),
  },
}
