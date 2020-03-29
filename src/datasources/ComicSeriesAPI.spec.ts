import { MongoError, ObjectID } from 'mongodb'
import {
  ComicSeriesAPI,
  comicSeriesCollection as collection,
} from './ComicSeriesAPI'
import {
  createMockConfig,
  createMockReaderWithReturnValue,
  foldOptionPromise,
} from 'tests/_utils'
import { ComicSeriesDbObject } from 'types/server-schema'

const config = createMockConfig()
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

const ds = new ComicSeriesAPI()
ds.initialize(config)

describe('[ComicSeriesAPI.insert]', () => {
  it('should insert ComicSeries using dataLayer and return left in case of Error', async () => {
    const mockComicSeries = { ...defaultComicSeries }
    delete mockComicSeries._id
    const { insertOne } = config.context.dataLayer
    insertOne.mockReturnValueOnce(createMockReaderWithReturnValue({}, true))

    const res = ds.insert(mockComicSeries)

    foldOptionPromise(
      res,
      err => expect(err).toBeInstanceOf(MongoError),
      d => {},
    )
    expect(insertOne).toBeCalledWith(collection, mockComicSeries)
    // TODO: The mock function is actually being called which can be tested by
    // a mock implementation and via debugger. However, this information
    // (config.context.logger.error.mock) seems to be reseted before it can be checked here.
    // expect(config.context.logger.error.mock).toBeCalledWith('TestError')
  })

  it('should insert ComicSeries using dataLayer and return right with result', async () => {
    const mockComicSeries = { ...defaultComicSeries }
    delete mockComicSeries._id
    const { insertOne } = config.context.dataLayer
    insertOne.mockReturnValueOnce(
      createMockReaderWithReturnValue<ComicSeriesDbObject>({
        ...mockComicSeries,
        _id: new ObjectID(),
      }),
    )

    const res = ds.insert(mockComicSeries)

    foldOptionPromise(
      res,
      err => {
        throw err
      },
      d => expect(d).toMatchObject(mockComicSeries),
    )
    expect(insertOne).toBeCalledWith(collection, mockComicSeries)
  })
})

describe('[ComicSeriesAPI.getById]', () => {
  it('should query dataLayer for ComicSeries with id and return left in case of Error', async () => {
    const mockComicSeries = { ...defaultComicSeries }
    const { findOne } = config.context.dataLayer
    findOne.mockReturnValueOnce(createMockReaderWithReturnValue({}, true))

    const res = ds.getById(mockComicSeries._id)

    foldOptionPromise(
      res,
      err => expect(err).toBeInstanceOf(MongoError),
      d => {},
    )
    expect(findOne).toBeCalledWith(collection, { _id: mockComicSeries._id })
    // TODO: The mock function is actually being called which can be tested by
    // a mock implementation and via debugger. However, this information
    // (config.context.logger.error.mock) seems to be reseted before it can be checked here.
    // expect(config.context.logger.error.mock).toBeCalledWith('TestError')
  })

  it('should query dataLayer for ComicSeries with id and return right with result', async () => {
    const mockComicSeries = { ...defaultComicSeries }
    const { findOne } = config.context.dataLayer
    findOne.mockReturnValueOnce(
      createMockReaderWithReturnValue<ComicSeriesDbObject>(mockComicSeries),
    )

    const res = ds.getById(mockComicSeries._id)

    foldOptionPromise(
      res,
      err => {
        throw err
      },
      d => expect(d).toMatchObject(mockComicSeries),
    )
    expect(findOne).toBeCalledWith(collection, { _id: mockComicSeries._id })
  })
})

describe('[ComicSeriesAPI.getByIds]', () => {
  it('should query dataLayer for ComicSeries with ids and return left in case of Error', async () => {
    const mockComicSeries = { ...defaultComicSeries }
    const { findMany } = config.context.dataLayer
    findMany.mockReturnValueOnce(createMockReaderWithReturnValue({}, true))

    const res = ds.getByIds([mockComicSeries._id])

    foldOptionPromise(
      res,
      err => expect(err).toBeInstanceOf(MongoError),
      d => {},
    )
    expect(findMany).toBeCalledWith(collection, {
      _id: { $in: [mockComicSeries._id] },
    })
    // TODO: The mock function is actually being called which can be tested by
    // a mock implementation and via debugger. However, this information
    // (config.context.logger.error.mock) seems to be reseted before it can be checked here.
    // expect(config.context.logger.error.mock).toBeCalledWith('TestError')
  })

  it('should query dataLayer for ComicSeries with ids and return right with result', async () => {
    const mockComicSeries = [{ ...defaultComicSeries }]
    const { findMany } = config.context.dataLayer
    findMany.mockReturnValueOnce(
      createMockReaderWithReturnValue<ComicSeriesDbObject>(mockComicSeries),
    )

    const res = ds.getByIds([mockComicSeries[0]._id])

    foldOptionPromise(
      res,
      err => {
        throw err
      },
      d => expect(d).toMatchObject(mockComicSeries),
    )
    expect(findMany).toBeCalledWith(collection, {
      _id: { $in: [mockComicSeries[0]._id] },
    })
  })
})

describe('[ComicSeriesAPI.addComicBook]', () => {
  it('should add ComicBook as an issue to ComicSeries using dataLayer and return left in case of Error', async () => {
    const mockComicSeriesId = new ObjectID()
    const mockComicBookId = new ObjectID()
    const { updateOne } = config.context.dataLayer
    updateOne.mockReturnValueOnce(createMockReaderWithReturnValue({}, true))

    const res = ds.addComicBook(mockComicSeriesId, mockComicBookId)

    foldOptionPromise(
      res,
      err => expect(err).toBeInstanceOf(MongoError),
      d => {},
    )
    expect(updateOne).toBeCalledWith(
      collection,
      { _id: mockComicSeriesId },
      { $push: { issues: mockComicBookId } },
    )
    // TODO: The mock function is actually being called which can be tested by
    // a mock implementation and via debugger. However, this information
    // (config.context.logger.error.mock) seems to be reseted before it can be checked here.
    // expect(config.context.logger.error.mock).toBeCalledWith('TestError')
  })

  it('should add ComicBook as an issue to ComicSeries using dataLayer and return right with result', async () => {
    const mockComicBook = { _id: new ObjectID(), title: 'Comic', url: '/path' }
    const mockComicSeries = {
      ...defaultComicSeries,
      issues: [mockComicBook._id],
    }
    const { updateOne } = config.context.dataLayer
    updateOne.mockReturnValueOnce(
      createMockReaderWithReturnValue<ComicSeriesDbObject>(mockComicSeries),
    )

    const res = ds.addComicBook(mockComicSeries._id, mockComicBook._id)

    foldOptionPromise(
      res,
      err => {
        throw err
      },
      d => expect(d).toMatchObject(mockComicSeries),
    )
    expect(updateOne).toBeCalledWith(
      collection,
      { _id: mockComicSeries._id },
      { $push: { issues: mockComicBook._id } },
    )
  })
})
