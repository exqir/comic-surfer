import { createMockConfig, createMockOptionWithReturnValue } from 'tests/_utils'
import { ComicQuery } from './comicBookResolver'
import { ComicBook } from 'types/schema'
import { ComicBookAPI } from 'datasources/ComicBookAPI'

describe('[Query.getComicBook]', () => {
  const { context } = createMockConfig()
  context.dataSources.comicBook = {
    getById: jest.fn(),
  } as unknown as ComicBookAPI

  it('should call ComicBookAPI and return null in case of Error', async () => {
    const { getById } = context.dataSources.comicBook;
    (getById as jest.Mock).mockReturnValueOnce(createMockOptionWithReturnValue({}, true))

    // GraphQLResolveInfo interface is not matched
    // @ts-ignore
    const res = await ComicQuery.getComicBook(null, { id: '1' }, context, {})

    expect(getById).toHaveBeenLastCalledWith('1')
    expect(res).toEqual(null)
  });

  it('should call ComicBookAPI and return its result', async () => {
    const mockComicBook = { _id: '1', title: 'Comic', url: '/path' }
    const { getById } = context.dataSources.comicBook;
    (getById as jest.Mock).mockReturnValueOnce(createMockOptionWithReturnValue<ComicBook>(mockComicBook))

    // GraphQLResolveInfo interface is not matched
    // @ts-ignore
    const res = await ComicQuery.getComicBook(null, { id: '1' }, context, {})

    expect(getById).toHaveBeenLastCalledWith('1')
    expect(res).toMatchObject(mockComicBook)
  });
})