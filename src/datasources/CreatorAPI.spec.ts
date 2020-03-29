import { MongoError, ObjectID } from 'mongodb'
import { CreatorAPI, creatorCollection as collection } from './CreatorAPI'
import {
  createMockConfig,
  createMockReaderWithReturnValue,
  foldOptionPromise,
} from 'tests/_utils'
import { CreatorDbObject } from 'types/server-schema'

const config = createMockConfig()
const defaultCreator: CreatorDbObject = {
  _id: new ObjectID(),
  firstname: 'John',
  lastname: 'Rambo',
  series: null,
}

const ds = new CreatorAPI()
ds.initialize(config)

describe('[CreatorAPI.insert]', () => {
  it('should insert Creator using dataLayer and return left in case of Error', async () => {
    const mockCreator = { ...defaultCreator }
    delete mockCreator._id
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
    const mockCreator = { ...defaultCreator }
    delete mockCreator._id
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
    const mockCreator = { ...defaultCreator }
    const { findOne } = config.context.dataLayer
    findOne.mockReturnValueOnce(createMockReaderWithReturnValue({}, true))

    const res = ds.getById(mockCreator._id)

    foldOptionPromise(
      res,
      err => expect(err).toBeInstanceOf(MongoError),
      d => {},
    )
    expect(findOne).toBeCalledWith(collection, { _id: mockCreator._id })
    // TODO: The mock function is actually being called which can be tested by
    // a mock implementation and via debugger. However, this information
    // (config.context.logger.error.mock) seems to be reseted before it can be checked here.
    // expect(config.context.logger.error.mock).toBeCalledWith('TestError')
  })

  it('should query dataLayer for Creator with id and return right with result', async () => {
    const mockCreator = { ...defaultCreator }
    const { findOne } = config.context.dataLayer
    findOne.mockReturnValueOnce(
      createMockReaderWithReturnValue<CreatorDbObject>(mockCreator),
    )

    const res = ds.getById(mockCreator._id)

    foldOptionPromise(
      res,
      err => {
        throw err
      },
      d => expect(d).toMatchObject(mockCreator),
    )
    expect(findOne).toBeCalledWith(collection, { _id: mockCreator._id })
  })
})

describe('[CreatorAPI.getByIds]', () => {
  it('should query dataLayer for Creator with ids and return left in case of Error', async () => {
    const mockCreator = { ...defaultCreator }
    const { findMany } = config.context.dataLayer
    findMany.mockReturnValueOnce(createMockReaderWithReturnValue({}, true))

    const res = ds.getByIds([mockCreator._id])

    foldOptionPromise(
      res,
      err => expect(err).toBeInstanceOf(MongoError),
      d => {},
    )
    expect(findMany).toBeCalledWith(collection, {
      _id: { $in: [mockCreator._id] },
    })
    // TODO: The mock function is actually being called which can be tested by
    // a mock implementation and via debugger. However, this information
    // (config.context.logger.error.mock) seems to be reseted before it can be checked here.
    // expect(config.context.logger.error.mock).toBeCalledWith('TestError')
  })

  it('should query dataLayer for Creator with ids and return right with result', async () => {
    const mockCreator = [{ ...defaultCreator }]
    const { findMany } = config.context.dataLayer
    findMany.mockReturnValueOnce(
      createMockReaderWithReturnValue<CreatorDbObject>(mockCreator),
    )

    const res = ds.getByIds([mockCreator[0]._id])

    foldOptionPromise(
      res,
      err => {
        throw err
      },
      d => expect(d).toMatchObject(mockCreator),
    )
    expect(findMany).toBeCalledWith(collection, {
      _id: { $in: [mockCreator[0]._id] },
    })
  })
})
