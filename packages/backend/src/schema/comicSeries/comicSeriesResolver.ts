import { MongoError } from 'mongodb'
import { pipe } from 'fp-ts/lib/pipeable'
import { Resolver, NonNullableResolver } from 'types/app'
import {
  QueryComicSeriesArgs,
  ComicBookDbObject,
  PublisherDbObject,
  ComicSeriesDbObject,
  MutationUpdateComicSeriesPublisherArgs,
} from 'types/server-schema'
import {
  runRTEtoNullable,
  chainMaybeToNullable,
  mapOtoRTEnullable,
  nullableField,
  nonNullableField,
  runRT,
} from 'lib'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as A from 'fp-ts/lib/Array'
import * as O from 'fp-ts/lib/Option'
import { TaskType } from 'datasources/QueueRepository'
import { ApolloError } from 'apollo-server'
import { constNull } from 'fp-ts/lib/function'

interface ComicSeriesQuery {
  // TODO: This actually returns a ComicSeries but this is not what the function returns
  // but what is returned once all field resolvers are done
  comicSeries: Resolver<ComicSeriesDbObject, QueryComicSeriesArgs>
}

interface ComicSeriesMutation {
  updateComicSeries: NonNullableResolver<ComicSeriesDbObject[], {}>
  updateComicSeriesPublisher: NonNullableResolver<
    ComicSeriesDbObject,
    MutationUpdateComicSeriesPublisherArgs
  >
}

interface ComicSeriesResolver {
  ComicSeries: {
    singleIssues: NonNullableResolver<
      ComicBookDbObject[],
      {},
      ComicSeriesDbObject
    >
    publisher: Resolver<PublisherDbObject, {}, ComicSeriesDbObject>
    collections: NonNullableResolver<
      ComicBookDbObject[],
      {},
      ComicSeriesDbObject
    >
    coverImgUrl: Resolver<string, {}, ComicSeriesDbObject>
  }
}

const seriesWithIssuesUrlO = O.fromPredicate<
  ComicSeriesDbObject | null,
  ComicSeriesDbObject & { singleIssuesUrl: string }
>(
  (
    comicSeries,
  ): comicSeries is ComicSeriesDbObject & { singleIssuesUrl: string } =>
    comicSeries !== null && comicSeries.singleIssuesUrl !== null,
)

export const ComicSeriesQuery: ComicSeriesQuery = {
  comicSeries: (_, { id }, { dataSources, db }) =>
    nullableField(db, runRTEtoNullable(dataSources.comicSeries.getById(id))),
}

export const ComicSeriesMutation: ComicSeriesMutation = {
  updateComicSeries: (_, __, { dataSources, db }) =>
    nonNullableField(
      db,
      runRT(
        pipe(
          dataSources.comicSeries.getLeastUpdated(),
          RTE.chainFirst((comicSeries) =>
            dataSources.queue.insertMany(
              A.flatten(
                comicSeries.map(({ _id, singleIssuesUrl, collectionsUrl }) => [
                  {
                    type: TaskType.SCRAPSINGLEISSUELIST,
                    data: { comicSeriesId: _id, url: singleIssuesUrl! },
                  },
                  {
                    type: TaskType.SCRAPCOLLECTIONLIST,
                    data: { comicSeriesId: _id, url: collectionsUrl! },
                  },
                ]),
              ),
            ),
          ),
          RTE.getOrElse(() => {
            throw new ApolloError('Failed to trigger updating ComicSeries.')
          }),
        ),
      ),
    ),
  updateComicSeriesPublisher: (
    _,
    { comicSeriesId },
    { dataSources, db, services },
  ) =>
    nonNullableField(
      db,
      runRT(
        pipe(
          dataSources.comicSeries.getById(comicSeriesId),
          RTE.chainW((comicSeries) =>
            RTE.fromOption(
              () =>
                new Error(
                  `Failed to find ComicSeries with ID ${comicSeriesId}.`,
                ),
            )(seriesWithIssuesUrlO(comicSeries)),
          ),
          RTE.chainW((comicSeries) =>
            RTE.fromTaskEither(
              services.scrape.getComicBookList(comicSeries.singleIssuesUrl),
            ),
          ),
          RTE.chain(({ comicBookList }) => {
            if (comicBookList.length < 1) {
              return RTE.left(
                new Error(
                  `Failed to find Comic Books for Comic Series with ID ${comicSeriesId}.`,
                ),
              )
            }
            return RTE.fromTaskEither(
              services.scrape.getComicBook(comicBookList[0].url),
            )
          }),
          RTE.chainW(({ publisher }) =>
            dataSources.publisher.getByUrl(publisher!.url),
          ),
          RTE.chainW((publisher) =>
            RTE.fromOption(() =>
              Error(
                `Failed to find Publisher for Comic Series with ID ${comicSeriesId}.`,
              ),
            )(O.fromNullable(publisher)),
          ),
          RTE.chainW((publisher) =>
            dataSources.publisher.addComicSeries(publisher._id, comicSeriesId),
          ),
          RTE.chainW((publisher) =>
            RTE.fromOption(() =>
              Error(
                `Failed to find Publisher for Comic Series with ID ${comicSeriesId}.`,
              ),
            )(O.fromNullable(publisher)),
          ),
          RTE.chainW((publisher) =>
            dataSources.comicSeries.updatePublisher(
              comicSeriesId,
              publisher._id,
            ),
          ),
          RTE.chainW((comicSeries) =>
            RTE.fromOption(
              () =>
                new Error(
                  `Failed to find ComicSeries with ID ${comicSeriesId}.`,
                ),
            )(O.fromNullable(comicSeries)),
          ),
          RTE.getOrElse((err) => {
            if (err instanceof MongoError) {
              throw new ApolloError(
                `Failed to update Publisher for Comic Series with ID ${comicSeriesId}.`,
              )
            }
            throw new ApolloError(`Failed to update Publisher: ${err.message}`)
          }),
        ),
      ),
    ),
}

export const ComicSeriesResolver: ComicSeriesResolver = {
  ComicSeries: {
    singleIssues: ({ singleIssues }, _, { dataSources, db }) =>
      nonNullableField(
        db,
        runRT(
          pipe(
            dataSources.comicBook.getByIds(singleIssues),
            RTE.getOrElse(() => {
              throw new ApolloError('Failed to find single issue ComicBooks')
            }),
          ),
        ),
      ),
    publisher: ({ publisher }, _, { dataSources, db }) =>
      chainMaybeToNullable(
        publisher,
        mapOtoRTEnullable(db, dataSources.publisher.getById),
      ),
    collections: ({ collections }, _, { dataSources, db }) =>
      nonNullableField(
        db,
        runRT(
          pipe(
            dataSources.comicBook.getByIds(collections),
            RTE.getOrElse(() => {
              throw new ApolloError('Failed to find single issue ComicBooks')
            }),
          ),
        ),
      ),
    coverImgUrl: ({ singleIssues, collections }, _, { dataSources, db }) =>
      nullableField(
        db,
        runRTEtoNullable(
          pipe(
            RTE.fromOption(constNull)(A.last(singleIssues)),
            RTE.orElse(() => RTE.fromOption(constNull)(A.last(collections))),
            RTE.chainW(dataSources.comicBook.getById),
            RTE.chainW((comicBook) =>
              RTE.fromOption(constNull)(O.fromNullable(comicBook)),
            ),
            RTE.map(({ coverImgUrl }) => coverImgUrl),
          ),
        ),
      ),
  },
}
