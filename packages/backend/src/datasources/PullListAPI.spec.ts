import { MongoError, ObjectID } from 'mongodb'
import { PullListAPI, pullListCollection as collection } from './PullListAPI'
import {
  createMockConfig,
  createMockReaderWithReturnValue,
  runRTEwithMockDb,
} from 'tests/_utils'
import { PullListDbObject } from 'types/server-schema'
import { pipe } from 'fp-ts/lib/pipeable'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'

const config = createMockConfig()
const defaultPullList: PullListDbObject = {
  _id: new ObjectID(),
  owner: 'John',
  list: [],
}

const ds = new PullListAPI()
ds.initialize(config)

describe('[PullListAPI.insert]', () => {
  it('should insert PullList using dataLayer and return left in case of Error', async () => {
    const mockPullList = { ...defaultPullList }
    delete mockPullList._id
    const { insertOne } = config.context.dataLayer
    insertOne.mockReturnValueOnce(createMockReaderWithReturnValue({}, true))

    const res = ds.insert(mockPullList)

    expect.assertions(2)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      runRTEwithMockDb,
    )
    expect(insertOne).toBeCalledWith(collection, mockPullList)
    // TODO: The mock function is actually being called which can be tested by
    // a mock implementation and via debugger. However, this information
    // (config.context.logger.error.mock) seems to be reseted before it can be checked here.
    // expect(config.context.logger.error.mock).toBeCalledWith('TestError')
  })

  it('should insert PullList using dataLayer and return right with result', async () => {
    const mockPullList = { ...defaultPullList }
    delete mockPullList._id
    const { insertOne } = config.context.dataLayer
    insertOne.mockReturnValueOnce(
      createMockReaderWithReturnValue<PullListDbObject>({
        ...mockPullList,
        _id: new ObjectID(),
      }),
    )

    const res = ds.insert(mockPullList)

    expect.assertions(2)
    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject(mockPullList)),
      runRTEwithMockDb,
    )
    expect(insertOne).toBeCalledWith(collection, mockPullList)
  })
})

describe('[PullListAPI.getById]', () => {
  it('should query dataLayer for PullList with id and return left in case of Error', async () => {
    const mockPullList = { ...defaultPullList }
    const { findOne } = config.context.dataLayer
    findOne.mockReturnValueOnce(createMockReaderWithReturnValue({}, true))

    const res = ds.getById(mockPullList._id)

    expect.assertions(2)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      runRTEwithMockDb,
    )
    expect(findOne).toBeCalledWith(collection, { _id: mockPullList._id })
    // TODO: The mock function is actually being called which can be tested by
    // a mock implementation and via debugger. However, this information
    // (config.context.logger.error.mock) seems to be reseted before it can be checked here.
    // expect(config.context.logger.error.mock).toBeCalledWith('TestError')
  })

  it('should query dataLayer for PullList with id and return right with result', async () => {
    const mockPullList = { ...defaultPullList }
    const { findOne } = config.context.dataLayer
    findOne.mockReturnValueOnce(
      createMockReaderWithReturnValue<PullListDbObject>(mockPullList),
    )

    const res = ds.getById(mockPullList._id)

    expect.assertions(2)
    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject(mockPullList)),
      runRTEwithMockDb,
    )
    expect(findOne).toBeCalledWith(collection, { _id: mockPullList._id })
  })
})

describe('[PullListAPI.getByIds]', () => {
  it('should query dataLayer for PullList with ids and return left in case of Error', async () => {
    const mockPullList = { ...defaultPullList }
    const { findMany } = config.context.dataLayer
    findMany.mockReturnValueOnce(createMockReaderWithReturnValue({}, true))

    const res = ds.getByIds([mockPullList._id])

    expect.assertions(2)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      runRTEwithMockDb,
    )
    expect(findMany).toBeCalledWith(collection, {
      _id: { $in: [mockPullList._id] },
    })
    // TODO: The mock function is actually being called which can be tested by
    // a mock implementation and via debugger. However, this information
    // (config.context.logger.error.mock) seems to be reseted before it can be checked here.
    // expect(config.context.logger.error.mock).toBeCalledWith('TestError')
  })

  it('should query dataLayer for PullList with ids and return right with result', async () => {
    const mockPullList = [{ ...defaultPullList }]
    const { findMany } = config.context.dataLayer
    findMany.mockReturnValueOnce(
      createMockReaderWithReturnValue<PullListDbObject>(mockPullList),
    )

    const res = ds.getByIds([mockPullList[0]._id])

    expect.assertions(2)
    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject(mockPullList)),
      runRTEwithMockDb,
    )
    expect(findMany).toBeCalledWith(collection, {
      _id: { $in: [mockPullList[0]._id] },
    })
  })
})

describe('[PullListAPI.getByUser]', () => {
  it('should query dataLayer for PullList of user and return left in case of Error', async () => {
    const { findOne } = config.context.dataLayer
    findOne.mockReturnValueOnce(createMockReaderWithReturnValue({}, true))

    const res = ds.getByUser('')

    expect.assertions(2)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      runRTEwithMockDb,
    )
    expect(findOne).toBeCalledWith(collection, { owner: '' })
    // TODO: The mock function is actually being called which can be tested by
    // a mock implementation and via debugger. However, this information
    // (config.context.logger.error.mock) seems to be reseted before it can be checked here.
    // expect(config.context.logger.error.mock).toBeCalledWith('TestError')
  })

  it('should query dataLayer for PullList of user and return right with result', async () => {
    const mockPullList = { ...defaultPullList }
    const { findOne } = config.context.dataLayer
    findOne.mockReturnValueOnce(
      createMockReaderWithReturnValue<PullListDbObject>(mockPullList),
    )

    const res = ds.getByUser('John')

    expect.assertions(2)
    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject(mockPullList)),
      runRTEwithMockDb,
    )
    expect(findOne).toBeCalledWith(collection, { owner: 'John' })
  })
})

describe('[PullListAPI.addComicSeries]', () => {
  it('should add ComicSeries to PullList using dataLayer and return left in case of Error', async () => {
    const mockPullList = { ...defaultPullList }
    const mockComicSeriesId = new ObjectID()
    const { updateOne } = config.context.dataLayer
    updateOne.mockReturnValueOnce(createMockReaderWithReturnValue({}, true))

    const res = ds.addComicSeries(mockPullList.owner, mockComicSeriesId)

    expect.assertions(2)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      runRTEwithMockDb,
    )
    expect(updateOne).toBeCalledWith(
      collection,
      { owner: mockPullList.owner },
      { $addToSet: { list: mockComicSeriesId } },
    )
    // TODO: The mock function is actually being called which can be tested by
    // a mock implementation and via debugger. However, this information
    // (config.context.logger.error.mock) seems to be reseted before it can be checked here.
    // expect(config.context.logger.error.mock).toBeCalledWith('TestError')
  })

  it('should add ComicSeries to PullList using dataLayer and return right with result', async () => {
    const mockComicSeries = {
      _id: new ObjectID(),
      title: 'Comic',
      url: '/path',
    }
    const mockPullList = {
      ...defaultPullList,
      list: [mockComicSeries._id],
    }
    const { updateOne } = config.context.dataLayer
    updateOne.mockReturnValueOnce(
      createMockReaderWithReturnValue<PullListDbObject>(mockPullList),
    )

    const res = ds.addComicSeries(mockPullList.owner, mockComicSeries._id)

    expect.assertions(2)
    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject(mockPullList)),
      runRTEwithMockDb,
    )
    expect(updateOne).toBeCalledWith(
      collection,
      { owner: mockPullList.owner },
      { $addToSet: { list: mockComicSeries._id } },
    )
  })
})

describe('[PullListAPI.removeComicSeries]', () => {
  it('should remove ComicSeries from PullList using dataLayer and return left in case of Error', async () => {
    const mockPullList = { ...defaultPullList }
    const mockComicSeriesId = new ObjectID()
    const { updateOne } = config.context.dataLayer
    updateOne.mockReturnValueOnce(createMockReaderWithReturnValue({}, true))

    const res = ds.removeComicSeries(mockPullList.owner, mockComicSeriesId)

    expect.assertions(2)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      runRTEwithMockDb,
    )
    expect(updateOne).toBeCalledWith(
      collection,
      { owner: mockPullList.owner },
      { $pull: { list: mockComicSeriesId } },
    )
    // TODO: The mock function is actually being called which can be tested by
    // a mock implementation and via debugger. However, this information
    // (config.context.logger.error.mock) seems to be reseted before it can be checked here.
    // expect(config.context.logger.error.mock).toBeCalledWith('TestError')
  })

  it('should remove ComicSeries from PullList using dataLayer and return right with result', async () => {
    const mockComicSeries = {
      _id: new ObjectID(),
      title: 'Comic',
      url: '/path',
    }
    const mockPullList = {
      ...defaultPullList,
      list: [],
    }
    const { updateOne } = config.context.dataLayer
    updateOne.mockReturnValueOnce(
      createMockReaderWithReturnValue<PullListDbObject>(mockPullList),
    )

    const res = ds.removeComicSeries(mockPullList.owner, mockComicSeries._id)

    expect.assertions(2)
    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject(mockPullList)),
      runRTEwithMockDb,
    )
    expect(updateOne).toBeCalledWith(
      collection,
      { owner: mockPullList.owner },
      { $pull: { list: mockComicSeries._id } },
    )
  })
})
