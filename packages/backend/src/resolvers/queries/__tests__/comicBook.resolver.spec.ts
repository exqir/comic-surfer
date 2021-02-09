import type { GraphQLResolveInfo } from 'graphql'
import { Db, MongoError, ObjectID } from 'mongodb'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as O from 'fp-ts/lib/Option'

import type { ComicBookDbObject } from 'types/server-schema'
import type { GraphQLContext } from 'types/app'
import type { IComicBookRepository } from 'models/ComicBook/ComicBook.interface'
import { ComicBookType } from 'types/server-schema'

import { comicBook } from '../comicBook.resolver'

describe('[Query.comicBook]', () => {
  it('should return null in case of an Error', async () => {
    getById.mockReturnValueOnce(RTE.left(new Error()))

    const res = await comicBook(
      parent,
      { id: defaultComicBook._id },
      context,
      info,
    )

    expect(res).toBeNull()
  })

  it('should return ComicBook', async () => {
    const res = await comicBook(
      parent,
      { id: defaultComicBook._id },
      context,
      info,
    )

    expect(res).toMatchObject(defaultComicBook)
  })
})

const defaultComicBook: ComicBookDbObject = {
  _id: new ObjectID(),
  title: 'Comic',
  url: '/path',
  issueNo: null,
  creators: [],
  coverImgUrl: null,
  publisher: null,
  releaseDate: null,
  comicSeries: null,
  type: ComicBookType.SINGLEISSUE,
  description: null,
  lastModified: new Date(),
}

const getById = jest.fn().mockReturnValue(RTE.right(defaultComicBook))
const comicBookRepository: IComicBookRepository<Db, Error | MongoError> = ({
  getById,
} as unknown) as IComicBookRepository<Db, Error | MongoError>

const context = {
  dataSources: {
    comicBook: comicBookRepository,
  },
  db: O.some({}),
} as GraphQLContext

const info = {} as GraphQLResolveInfo
const parent = {}
