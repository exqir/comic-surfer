import { MongoError, ObjectID } from 'mongodb'
import {
  ComicSeriesAPI,
  comicSeriesCollection as collection,
} from './ComicSeriesAPI'
import {
  createMockConfig,
  createMockReaderWithReturnValue,
  runRTEwithMockDb,
} from 'tests/_utils'
import { ComicSeriesDbObject } from 'types/server-schema'
import { pipe } from 'fp-ts/lib/pipeable'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'

const config = createMockConfig()
const defaultComicSeries: ComicSeriesDbObject = {
  _id: new ObjectID(),
  title: 'Comic',
  url: '/path',
  collectionsUrl: null,
  collections: [],
  singleIssuesUrl: null,
  singleIssues: [],
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

    expect.assertions(2)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      runRTEwithMockDb,
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

    expect.assertions(2)
    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject(mockComicSeries)),
      runRTEwithMockDb,
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

    expect.assertions(2)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      runRTEwithMockDb,
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

    expect.assertions(2)
    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject(mockComicSeries)),
      runRTEwithMockDb,
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

    expect.assertions(2)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      runRTEwithMockDb,
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

    expect.assertions(2)
    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject(mockComicSeries)),
      runRTEwithMockDb,
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

    expect.assertions(2)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      runRTEwithMockDb,
    )
    expect(updateOne).toBeCalledWith(
      collection,
      { _id: mockComicSeriesId },
      { $addToSet: { singleIssues: mockComicBookId } },
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

    expect.assertions(2)
    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject(mockComicSeries)),
      runRTEwithMockDb,
    )
    expect(updateOne).toBeCalledWith(
      collection,
      { _id: mockComicSeries._id },
      { $addToSet: { singleIssues: mockComicBook._id } },
    )
  })
})

describe('[ComicSeriesAPI.addComicBooks]', () => {
  it('should add ComicBooks as issues to ComicSeries using dataLayer and return left in case of Error', async () => {
    const mockComicSeriesId = new ObjectID()
    const mockComicBookId = new ObjectID()
    const { updateOne } = config.context.dataLayer
    updateOne.mockReturnValueOnce(createMockReaderWithReturnValue({}, true))

    const res = ds.addComicBooks(mockComicSeriesId, [mockComicBookId])

    expect.assertions(2)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      runRTEwithMockDb,
    )
    expect(updateOne).toBeCalledWith(
      collection,
      { _id: mockComicSeriesId },
      { $addToSet: { singleIssues: { $each: [mockComicBookId] } } },
    )
    // TODO: The mock function is actually being called which can be tested by
    // a mock implementation and via debugger. However, this information
    // (config.context.logger.error.mock) seems to be reseted before it can be checked here.
    // expect(config.context.logger.error.mock).toBeCalledWith('TestError')
  })

  it('should add ComicBooks as issues to ComicSeries using dataLayer and return right with result', async () => {
    const mockComicBook = { _id: new ObjectID(), title: 'Comic', url: '/path' }
    const mockComicSeries = {
      ...defaultComicSeries,
      issues: [mockComicBook._id],
    }
    const { updateOne } = config.context.dataLayer
    updateOne.mockReturnValueOnce(
      createMockReaderWithReturnValue<ComicSeriesDbObject>(mockComicSeries),
    )

    const res = ds.addComicBooks(mockComicSeries._id, [mockComicBook._id])

    expect.assertions(2)
    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject(mockComicSeries)),
      runRTEwithMockDb,
    )
    expect(updateOne).toBeCalledWith(
      collection,
      { _id: mockComicSeries._id },
      { $addToSet: { singleIssues: { $each: [mockComicBook._id] } } },
    )
  })
})
