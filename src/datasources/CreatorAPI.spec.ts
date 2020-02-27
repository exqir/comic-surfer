import { MongoError, ObjectID } from 'mongodb'
import { CreatorAPI, creatorCollection as collection } from './CreatorAPI'
import {
  createMockConfig,
  createMockReaderWithReturnValue,
  foldOptionPromise,
} from 'tests/_utils'
import { CreatorDbObject } from 'types/server-schema'

const config = createMockConfig()

const ds = new CreatorAPI()
ds.initialize(config)

describe('[CreatorAPI.insert]', () => {
  it('should insert Creator using dataLayer and return left in case of Error', async () => {
    const mockCreator = { firstname: 'John', lastname: 'Rambo' }
    const { insertOne } = config.context.dataLayer
    insertOne.mockReturnValueOnce(createMockReaderWithReturnValue({}, true))

    const res = ds.insert(mockCreator)

    foldOptionPromise(
      res,
      err => expect(err).toBeInstanceOf(MongoError),
      d => {},
    )
    expect(insertOne).toBeCalledWith(collection, mockCreator)
    // TODO: The mock function is actually being called which can be tested by
    // a mock implementation and via debugger. However, this information
    // (config.context.logger.error.mock) seems to be reseted before it can be checked here.
    // expect(config.context.logger.error.mock).toBeCalledWith('TestError')
  })

  it('should insert Creator using dataLayer and return right with result', async () => {
    const mockCreator = { firstname: 'John', lastname: 'Rambo' }
    const { insertOne } = config.context.dataLayer
    insertOne.mockReturnValueOnce(
      createMockReaderWithReturnValue<CreatorDbObject>({
        ...mockCreator,
        _id: new ObjectID(),
      }),
    )

    const res = ds.insert(mockCreator)

    foldOptionPromise(
      res,
      err => {
        throw err
      },
      d => expect(d).toMatchObject(mockCreator),
    )
    expect(insertOne).toBeCalledWith(collection, mockCreator)
  })
})

describe('[CreatorAPI.getById]', () => {
  it('should query dataLayer for Creator with id and return left in case of Error', async () => {
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

  it('should query dataLayer for Creator with id and return right with result', async () => {
    const mockCreator = {
      _id: new ObjectID(),
      firstname: 'John',
      lastname: 'Rambo',
    }
    const { findOne } = config.context.dataLayer
    findOne.mockReturnValueOnce(
      createMockReaderWithReturnValue<CreatorDbObject>(mockCreator),
    )

    const res = ds.getById('1')

    foldOptionPromise(
      res,
      err => {
        throw err
      },
      d => expect(d).toMatchObject(mockCreator),
    )
    expect(findOne).toBeCalledWith(collection, { _id: '1' })
  })
})

describe('[CreatorAPI.getByIds]', () => {
  it('should query dataLayer for Creator with ids and return left in case of Error', async () => {
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

  it('should query dataLayer for Creator with ids and return right with result', async () => {
    const mockComicBook = [
      { _id: new ObjectID(), firstname: 'John', lastname: 'Rambo' },
    ]
    const { findMany } = config.context.dataLayer
    findMany.mockReturnValueOnce(
      createMockReaderWithReturnValue<CreatorDbObject>(mockComicBook),
    )

    const res = ds.getByIds(['1'])

    foldOptionPromise(
      res,
      err => {
        throw err
      },
      d => expect(d).toMatchObject(mockComicBook),
    )
    expect(findMany).toBeCalledWith(collection, { _id: { $in: ['1'] } })
  })
})
