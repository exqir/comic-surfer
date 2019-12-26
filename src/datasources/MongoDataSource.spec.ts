import { MongoError, ObjectID } from 'mongodb'
import { MongoDataSource } from './MongoDataSource'
import {
  createMockConfig,
  createMockReaderWithReturnValue,
  foldOptionPromise,
} from 'tests/_utils'

const config = createMockConfig()

const collection = 'collection'
const ds = new MongoDataSource(collection)
ds.initialize(config)

describe('[MongoDataSource.insert]', () => {
  it('should insert Document using dataLayer and return left in case of Error', async () => {
    const mockComicBook = { title: 'Comic', url: '/path' }
    const { insertOne } = config.context.dataLayer
    insertOne.mockReturnValueOnce(createMockReaderWithReturnValue({}, true))

    const res = ds.insert(mockComicBook)

    foldOptionPromise(
      res,
      err => expect(err).toBeInstanceOf(MongoError),
      d => {},
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
    insertOne.mockReturnValueOnce(
      createMockReaderWithReturnValue({
        ...mockDocument,
        _id: new ObjectID(),
      }),
    )

    const res = ds.insert(mockDocument)

    foldOptionPromise(
      res,
      err => {
        throw err
      },
      d => expect(d).toMatchObject(mockDocument),
    )
    expect(insertOne).toBeCalledWith(collection, mockDocument)
  })
})

describe('[MongoDataSource.getById]', () => {
  it('should query dataLayer for Document with id and return left in case of Error', async () => {
    const { findOne } = config.context.dataLayer
    findOne.mockReturnValueOnce(createMockReaderWithReturnValue({}, true))

    const res = ds.getById('')

    foldOptionPromise(
      res,
      err => expect(err).toBeInstanceOf(MongoError),
      d => {},
    )
    expect(findOne).toBeCalledWith(collection, { _id: '' })
    // TODO: The mock function is actually being called which can be tested by
    // a mock implementation and via debugger. However, this information
    // (config.context.logger.error.mock) seems to be reseted before it can be checked here.
    // expect(config.context.logger.error.mock).toBeCalledWith('TestError')
  })

  it('should query dataLayer for Document with id and return right with result', async () => {
    const mockDocument = { _id: new ObjectID(), title: 'Comic', url: '/path' }
    const { findOne } = config.context.dataLayer
    findOne.mockReturnValueOnce(createMockReaderWithReturnValue(mockDocument))

    const res = ds.getById('1')

    foldOptionPromise(
      res,
      err => {
        throw err
      },
      d => expect(d).toMatchObject(mockDocument),
    )
    expect(findOne).toBeCalledWith(collection, { _id: '1' })
  })
})

describe('[MongoDataSource.getByIds]', () => {
  it('should query dataLayer for Document with ids and return left in case of Error', async () => {
    const { findMany } = config.context.dataLayer
    findMany.mockReturnValueOnce(createMockReaderWithReturnValue({}, true))

    const res = ds.getByIds([''])

    foldOptionPromise(
      res,
      err => expect(err).toBeInstanceOf(MongoError),
      d => {},
    )
    expect(findMany).toBeCalledWith(collection, { _id: { $in: [''] } })
    // TODO: The mock function is actually being called which can be tested by
    // a mock implementation and via debugger. However, this information
    // (config.context.logger.error.mock) seems to be reseted before it can be checked here.
    // expect(config.context.logger.error.mock).toBeCalledWith('TestError')
  })

  it('should query dataLayer for Document with ids and return right with result', async () => {
    const mockDocument = [{ _id: new ObjectID(), title: 'Comic', url: '/path' }]
    const { findMany } = config.context.dataLayer
    findMany.mockReturnValueOnce(createMockReaderWithReturnValue(mockDocument))

    const res = ds.getByIds(['1'])

    foldOptionPromise(
      res,
      err => {
        throw err
      },
      d => expect(d).toMatchObject(mockDocument),
    )
    expect(findMany).toBeCalledWith(collection, { _id: { $in: ['1'] } })
  })
})
