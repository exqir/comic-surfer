import { createMockConfig, createMockOptionWithReturnValue } from 'tests/_utils'
import { ComicBookQuery } from './comicBookResolver'
import { ComicBook } from 'types/server-schema'
import { ComicBookAPI } from 'datasources/ComicBookAPI'

describe('[Query.getComicBook]', () => {
  const { context } = createMockConfig()
  context.dataSources.comicBook = ({
    getById: jest.fn(),
  } as unknown) as ComicBookAPI

  it('should call ComicBookAPI and return null in case of Error', async () => {
    const { getById } = context.dataSources.comicBook
    ;(getById as jest.Mock).mockReturnValueOnce(
      createMockOptionWithReturnValue({}, true),
    )

    const res = await ComicBookQuery.getComicBook(
      null,
      { id: '1' },
      context,
      // GraphQLResolveInfo interface is not matched
      // @ts-ignore
      {},
    )

    expect(getById).toHaveBeenLastCalledWith('1')
    expect(res).toEqual(null)
  })

  it('should call ComicBookAPI and return its result', async () => {
    const mockComicBook = { _id: '1', title: 'Comic', url: '/path' }
    const { getById } = context.dataSources.comicBook
    ;(getById as jest.Mock).mockReturnValueOnce(
      createMockOptionWithReturnValue<ComicBook>(mockComicBook),
    )

    const res = await ComicBookQuery.getComicBook(
      null,
      { id: '1' },
      context,
      // GraphQLResolveInfo interface is not matched
      // @ts-ignore
      {},
    )

    expect(getById).toHaveBeenLastCalledWith('1')
    expect(res).toMatchObject(mockComicBook)
  })
})
