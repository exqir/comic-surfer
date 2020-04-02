import { ObjectID } from 'mongodb'
import { createMockConfig, createMockReaderWithReturnValue } from 'tests/_utils'
import { ComicSeriesDbObject, CreatorDbObject } from 'types/server-schema'
import { GraphQLResolveInfo } from 'graphql'
import { ComicSeriesAPI } from 'datasources'
import { CreatorResolver } from './creatorResolver'

const defaultCreator: CreatorDbObject = {
  _id: new ObjectID(),
  firstname: 'John',
  lastname: 'Rambo',
  series: null,
}

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

describe('[Creator.series]', () => {
  const { context } = createMockConfig()
  context.dataSources.comicSeries = ({
    getByIds: jest.fn(),
  } as unknown) as ComicSeriesAPI

  it('should call ComicSeriesAPI and return null in case of Error', async () => {
    const mockComicSeries = { ...defaultComicSeries }
    const { getByIds } = context.dataSources.comicSeries
    ;(getByIds as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue({}, true),
    )

    const res = await CreatorResolver.Creator.series(
      { ...defaultCreator, series: [mockComicSeries._id] },
      {},
      context,
      {} as GraphQLResolveInfo,
    )

    expect(getByIds).toHaveBeenLastCalledWith([mockComicSeries._id])
    expect(res).toEqual(null)
  })

  it('should call ComicSeriesAPI and return its result', async () => {
    const mockComicSeries = { ...defaultComicSeries }
    const { getByIds } = context.dataSources.comicSeries
    ;(getByIds as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue<ComicSeriesDbObject>([mockComicSeries]),
    )

    const res = await CreatorResolver.Creator.series(
      { ...defaultCreator, series: [mockComicSeries._id] },
      {},
      context,
      {} as GraphQLResolveInfo,
    )

    expect(getByIds).toHaveBeenLastCalledWith([mockComicSeries._id])
    expect(res).toMatchObject([mockComicSeries])
  })
})
