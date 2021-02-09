import type { GraphQLResolveInfo } from 'graphql'
import { Db, MongoError, ObjectID } from 'mongodb'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as O from 'fp-ts/lib/Option'

import type { ComicSeriesDbObject } from 'types/server-schema'
import type { GraphQLContext } from 'types/app'
import type { IComicSeriesRepository } from 'models/ComicSeries/ComicSeries.interface'

import { comicSeries } from '../comicSeries.resolver'

describe('[Query.comicSeries]', () => {
  it('should return null in case of an Error', async () => {
    getById.mockReturnValueOnce(RTE.left(new Error()))

    const res = await comicSeries(
      parent,
      { id: defaultComicSeries._id },
      context,
      info,
    )

    expect(res).toBeNull()
  })

  it('should return ComicBook', async () => {
    const res = await comicSeries(
      parent,
      { id: defaultComicSeries._id },
      context,
      info,
    )

    expect(res).toMatchObject(defaultComicSeries)
  })
})

const defaultComicSeries: ComicSeriesDbObject = {
  _id: new ObjectID(),
  title: 'Comic',
  url: '/path',
  collectionsUrl: null,
  collections: [],
  singleIssuesUrl: null,
  singleIssues: [],
  publisher: null,
  lastModified: new Date(),
}

const getById = jest.fn().mockReturnValue(RTE.right(defaultComicSeries))
const comicSeriesRepository: IComicSeriesRepository<Db, Error | MongoError> = ({
  getById,
} as unknown) as IComicSeriesRepository<Db, Error | MongoError>

const context = {
  dataSources: {
    comicSeries: comicSeriesRepository,
  },
  db: O.some({}),
} as GraphQLContext

const info = {} as GraphQLResolveInfo
const parent = {}
