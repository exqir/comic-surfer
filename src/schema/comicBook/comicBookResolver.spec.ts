import { ObjectID } from 'mongodb'
import {
  createMockConfig,
  createMockOptionWithReturnValue,
  createMockReaderWithReturnValue,
} from 'tests/_utils'
import { ComicBookQuery } from './comicBookResolver'
import { ComicBook, ComicBookDbObject } from 'types/server-schema'
import { ComicBookAPI } from 'datasources/ComicBookAPI'
import { GraphQLResolveInfo } from 'graphql'

const defaultComicBook: ComicBookDbObject = {
  _id: new ObjectID(),
  title: 'Comic',
  url: '/path',
  issue: null,
  creators: null,
  coverUrl: null,
  publisher: null,
  releaseDate: null,
  series: null,
}

describe('[Query.getComicBook]', () => {
  const { context } = createMockConfig()
  context.dataSources.comicBook = ({
    getById: jest.fn(),
  } as unknown) as ComicBookAPI

  it('should call ComicBookAPI and return null in case of Error', async () => {
    const mockComicBook = { ...defaultComicBook }
    const { getById } = context.dataSources.comicBook
    ;(getById as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue({}, true),
    )

    const res = await ComicBookQuery.getComicBook(
      {},
      { id: mockComicBook._id },
      context,
      {} as GraphQLResolveInfo,
    )

    expect(getById).toHaveBeenLastCalledWith(mockComicBook._id)
    expect(res).toEqual(null)
  })

  it('should call ComicBookAPI and return its result', async () => {
    const mockComicBook = { ...defaultComicBook }
    const { getById } = context.dataSources.comicBook
    ;(getById as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue<ComicBookDbObject>(mockComicBook),
    )

    const res = await ComicBookQuery.getComicBook(
      {},
      { id: mockComicBook._id },
      context,
      {} as GraphQLResolveInfo,
    )

    expect(getById).toHaveBeenLastCalledWith(mockComicBook._id)
    expect(res).toMatchObject(mockComicBook)
  })
})
