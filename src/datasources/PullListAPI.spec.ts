import { MongoError, ObjectID } from 'mongodb'
import { PullListAPI, pullListCollection as collection } from './PullListAPI'
import {
  createMockConfig,
  createMockReaderWithReturnValue,
  foldOptionPromise,
} from 'tests/_utils'
import { PullListDbObject } from 'types/server-schema'

const config = createMockConfig()
const defaultPullList: PullListDbObject = {
  _id: new ObjectID(),
  owner: 'John',
  list: null,
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

    foldOptionPromise(
      res,
      err => expect(err).toBeInstanceOf(MongoError),
      d => {},
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

    foldOptionPromise(
      res,
      err => {
        throw err
      },
      d => expect(d).toMatchObject(mockPullList),
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

    foldOptionPromise(
      res,
      err => expect(err).toBeInstanceOf(MongoError),
      d => {},
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

    foldOptionPromise(
      res,
      err => {
        throw err
      },
      d => expect(d).toMatchObject(mockPullList),
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

    foldOptionPromise(
      res,
      err => expect(err).toBeInstanceOf(MongoError),
      d => {},
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

    foldOptionPromise(
      res,
      err => {
        throw err
      },
      d => expect(d).toMatchObject(mockPullList),
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

    foldOptionPromise(
      res,
      err => expect(err).toBeInstanceOf(MongoError),
      d => {},
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

    foldOptionPromise(
      res,
      err => {
        throw err
      },
      d => expect(d).toMatchObject(mockPullList),
    )
    expect(findOne).toBeCalledWith(collection, { owner: 'John' })
  })
})

describe('[PullListAPI.addComicSeries]', () => {
  it('should add ComicSeries to PullList using dataLayer and return left in case of Error', async () => {
    const mockPullListId = new ObjectID()
    const mockComicSeriesId = new ObjectID()
    const { updateOne } = config.context.dataLayer
    updateOne.mockReturnValueOnce(createMockReaderWithReturnValue({}, true))

    const res = ds.addComicSeries(mockPullListId, mockComicSeriesId)

    foldOptionPromise(
      res,
      err => expect(err).toBeInstanceOf(MongoError),
      d => {},
    )
    expect(updateOne).toBeCalledWith(
      collection,
      { _id: mockPullListId },
      { $push: { list: mockComicSeriesId } },
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

    const res = ds.addComicSeries(mockPullList._id, mockComicSeries._id)

    foldOptionPromise(
      res,
      err => {
        throw err
      },
      d => expect(d).toMatchObject(mockPullList),
    )
    expect(updateOne).toBeCalledWith(
      collection,
      { _id: mockPullList._id },
      { $push: { list: mockComicSeries._id } },
    )
  })
})

describe('[PullListAPI.removeComicSeries]', () => {
  it('should remove ComicSeries from PullList using dataLayer and return left in case of Error', async () => {
    const mockPullListId = new ObjectID()
    const mockComicSeriesId = new ObjectID()
    const { updateOne } = config.context.dataLayer
    updateOne.mockReturnValueOnce(createMockReaderWithReturnValue({}, true))

    const res = ds.removeComicSeries(mockPullListId, mockComicSeriesId)

    foldOptionPromise(
      res,
      err => expect(err).toBeInstanceOf(MongoError),
      d => {},
    )
    expect(updateOne).toBeCalledWith(
      collection,
      { _id: mockPullListId },
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

    const res = ds.removeComicSeries(mockPullList._id, mockComicSeries._id)

    foldOptionPromise(
      res,
      err => {
        throw err
      },
      d => expect(d).toMatchObject(mockPullList),
    )
    expect(updateOne).toBeCalledWith(
      collection,
      { _id: mockPullList._id },
      { $pull: { list: mockComicSeries._id } },
    )
  })
})
