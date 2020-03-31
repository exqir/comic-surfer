import { ObjectID } from 'mongodb'
import { createMockConfig, createMockReaderWithReturnValue } from 'tests/_utils'
import { ComicSeriesQuery } from './comicSeriesResolver'
import { ComicSeriesDbObject } from 'types/server-schema'
import { ComicSeriesAPI } from 'datasources/ComicSeriesAPI'
import { GraphQLResolveInfo } from 'graphql'

const defaultComicSeries: ComicSeriesDbObject = {
  _id: new ObjectID(),
  title: 'Comic',
  url: '/path',
  collectionsUrl: null,
  collections: null,
  issuesUrl: null,
  issues: null,
  publisher: null,
}

describe('[Query.getComicSeries]', () => {
  const { context } = createMockConfig()
  context.dataSources.comicSeries = ({
    getById: jest.fn(),
  } as unknown) as ComicSeriesAPI

  it('should call ComicSeriesAPI and return null in case of Error', async () => {
    const mockComicSeries = { ...defaultComicSeries }
    const { getById } = context.dataSources.comicSeries
    ;(getById as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue({}, true),
    )

    const res = await ComicSeriesQuery.getComicSeries(
      {},
      { id: mockComicSeries._id },
      context,
      {} as GraphQLResolveInfo,
    )

    expect(getById).toHaveBeenLastCalledWith(mockComicSeries._id)
    expect(res).toEqual(null)
  })

  it('should call ComicSeriesAPI and return its result', async () => {
    const mockComicSeries = { ...defaultComicSeries }
    const { getById } = context.dataSources.comicSeries
    ;(getById as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue<ComicSeriesDbObject>(mockComicSeries),
    )

    const res = await ComicSeriesQuery.getComicSeries(
      {},
      { id: mockComicSeries._id },
      context,
      {} as GraphQLResolveInfo,
    )

    expect(getById).toHaveBeenLastCalledWith(mockComicSeries._id)
    expect(res).toMatchObject(mockComicSeries)
  })
})
