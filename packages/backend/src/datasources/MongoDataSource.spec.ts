import { MongoError, ObjectID } from 'mongodb'
import { MongoDataSource } from './MongoDataSource'
import {
  createMockConfig,
  createMockReaderWithReturnValue,
  runRTEwithMockDb,
} from 'tests/_utils'
import { pipe } from 'fp-ts/lib/pipeable'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'

const config = createMockConfig()

const collection = 'collection'
const ds = new MongoDataSource(collection)
ds.initialize(config)

describe('[MongoDataSource.insert]', () => {
  it('should insert Document using dataLayer and return left in case of Error', async () => {
    const mockComicBook = { title: 'Comic', url: '/path' }
    const { insertOne } = config.context.dataLayer
    ;(insertOne as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue({}, true),
    )

    const res = ds.insert(mockComicBook)

    expect.assertions(2)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      runRTEwithMockDb,
    )
    expect(insertOne).toBeCalledWith(collection, mockComicBook)
    // TODO: The mock function is actually being called which can be tested by
    // a mock implementation and via debugger. However, this information
    // (config.context.logger.error.mock) seems to be reseted before it can be checked here.
    // expect(config.context.logger.error.mock).toBeCalledWith('TestError')
  })

  it('should insert Document using dataLayer and return right with result', async () => {
    const mockDocument = { title: 'Comic', url: '/path' }
    const { insertOne } = config.context.dataLayer
    ;(insertOne as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue({
        ...mockDocument,
        _id: new ObjectID(),
      }),
    )

    const res = ds.insert(mockDocument)

    expect.assertions(2)
    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject(mockDocument)),
      runRTEwithMockDb,
    )
    expect(insertOne).toBeCalledWith(collection, mockDocument)
  })
})

describe('[MongoDataSource.getById]', () => {
  it('should query dataLayer for Document with id and return left in case of Error', async () => {
    const mockDocument = { _id: new ObjectID() }
    const { findOne } = config.context.dataLayer
    ;(findOne as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue({}, true),
    )

    const res = ds.getById(mockDocument._id)

    expect.assertions(2)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      runRTEwithMockDb,
    )
    expect(findOne).toBeCalledWith(collection, { _id: mockDocument._id })
    // TODO: The mock function is actually being called which can be tested by
    // a mock implementation and via debugger. However, this information
    // (config.context.logger.error.mock) seems to be reseted before it can be checked here.
    // expect(config.context.logger.error.mock).toBeCalledWith('TestError')
  })

  it('should query dataLayer for Document with id and return right with result', async () => {
    const mockDocument = { _id: new ObjectID(), title: 'Comic', url: '/path' }
    const { findOne } = config.context.dataLayer
    ;(findOne as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue(mockDocument),
    )

    const res = ds.getById(mockDocument._id)

    expect.assertions(2)
    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject(mockDocument)),
      runRTEwithMockDb,
    )
    expect(findOne).toBeCalledWith(collection, { _id: mockDocument._id })
  })
})

describe('[MongoDataSource.getByIds]', () => {
  it('should query dataLayer for Document with ids and return left in case of Error', async () => {
    const mockDocument = { _id: new ObjectID() }
    const { findMany } = config.context.dataLayer
    ;(findMany as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue({}, true),
    )

    const res = ds.getByIds([mockDocument._id])

    expect.assertions(2)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      runRTEwithMockDb,
    )
    expect(findMany).toBeCalledWith(collection, {
      _id: { $in: [mockDocument._id] },
    })
    // TODO: The mock function is actually being called which can be tested by
    // a mock implementation and via debugger. However, this information
    // (config.context.logger.error.mock) seems to be reseted before it can be checked here.
    // expect(config.context.logger.error.mock).toBeCalledWith('TestError')
  })

  it('should query dataLayer for Document with ids and return right with result', async () => {
    const mockDocument = [{ _id: new ObjectID(), title: 'Comic', url: '/path' }]
    const { findMany } = config.context.dataLayer
    ;(findMany as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue(mockDocument),
    )

    const res = ds.getByIds([mockDocument[0]._id])

    expect.assertions(2)
    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject(mockDocument)),
      runRTEwithMockDb,
    )
    expect(findMany).toBeCalledWith(collection, {
      _id: { $in: [mockDocument[0]._id] },
    })
  })
})
