import { MongoError, ObjectID } from 'mongodb'
import { CreatorAPI, creatorCollection as collection } from './CreatorAPI'
import {
  createMockConfig,
  createMockReaderWithReturnValue,
  runRTEwithMockDb,
} from 'tests/_utils'
import { CreatorDbObject } from 'types/server-schema'
import { pipe } from 'fp-ts/lib/pipeable'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'

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

    expect.assertions(2)
    await pipe(
      res,
      RTE.mapLeft(err => expect(err).toBeInstanceOf(MongoError)),
      runRTEwithMockDb,
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

    expect.assertions(2)
    await pipe(
      res,
      RTE.map(d => expect(d).toMatchObject(mockCreator)),
      runRTEwithMockDb,
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

    expect.assertions(2)
    await pipe(
      res,
      RTE.mapLeft(err => expect(err).toBeInstanceOf(MongoError)),
      runRTEwithMockDb,
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

    expect.assertions(2)
    await pipe(
      res,
      RTE.map(d => expect(d).toMatchObject(mockCreator)),
      runRTEwithMockDb,
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

    expect.assertions(2)
    await pipe(
      res,
      RTE.mapLeft(err => expect(err).toBeInstanceOf(MongoError)),
      runRTEwithMockDb,
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

    expect.assertions(2)
    await pipe(
      res,
      RTE.map(d => expect(d).toMatchObject(mockCreator)),
      runRTEwithMockDb,
    )
    expect(findMany).toBeCalledWith(collection, {
      _id: { $in: [mockCreator[0]._id] },
    })
  })
})
