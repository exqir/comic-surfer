import { MongoError, ObjectID } from 'mongodb'
import { PublisherAPI, publisherCollection as collection } from './PublisherAPI'
import {
  createMockConfig,
  createMockReaderWithReturnValue,
  foldOptionPromise,
} from 'tests/_utils'
import { PublisherDbObject } from 'types/server-schema'

const config = createMockConfig()

const ds = new PublisherAPI()
ds.initialize(config)

describe('[PublisherAPI.insert]', () => {
  it('should insert Publisher using dataLayer and return left in case of Error', async () => {
    const mockPublisher = { name: 'Image' }
    const { insertOne } = config.context.dataLayer
    insertOne.mockReturnValueOnce(createMockReaderWithReturnValue({}, true))

    const res = ds.insert(mockPublisher)

    foldOptionPromise(
      res,
      err => expect(err).toBeInstanceOf(MongoError),
      d => {},
    )
    expect(insertOne).toBeCalledWith(collection, mockPublisher)
    // TODO: The mock function is actually being called which can be tested by
    // a mock implementation and via debugger. However, this information
    // (config.context.logger.error.mock) seems to be reseted before it can be checked here.
    // expect(config.context.logger.error.mock).toBeCalledWith('TestError')
  })

  it('should insert Publisher using dataLayer and return right with result', async () => {
    const mockPublisher = { name: 'Image' }
    const { insertOne } = config.context.dataLayer
    insertOne.mockReturnValueOnce(
      createMockReaderWithReturnValue<PublisherDbObject>({
        ...mockPublisher,
        _id: new ObjectID(),
      }),
    )

    const res = ds.insert(mockPublisher)

    foldOptionPromise(
      res,
      err => {
        throw err
      },
      d => expect(d).toMatchObject(mockPublisher),
    )
    expect(insertOne).toBeCalledWith(collection, mockPublisher)
  })
})

describe('[PublisherAPI.getById]', () => {
  it('should query dataLayer for Publisher with id and return left in case of Error', async () => {
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

  it('should query dataLayer for Publisher with id and return right with result', async () => {
    const mockPublisher = {
      _id: new ObjectID(),
      name: 'Image',
    }
    const { findOne } = config.context.dataLayer
    findOne.mockReturnValueOnce(
      createMockReaderWithReturnValue<PublisherDbObject>(mockPublisher),
    )

    const res = ds.getById('1')

    foldOptionPromise(
      res,
      err => {
        throw err
      },
      d => expect(d).toMatchObject(mockPublisher),
    )
    expect(findOne).toBeCalledWith(collection, { _id: '1' })
  })
})

describe('[PublisherAPI.getByIds]', () => {
  it('should query dataLayer for Publisher with ids and return left in case of Error', async () => {
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

  it('should query dataLayer for Publisher with ids and return right with result', async () => {
    const mockPublisher = [{ _id: new ObjectID(), name: 'Image' }]
    const { findMany } = config.context.dataLayer
    findMany.mockReturnValueOnce(
      createMockReaderWithReturnValue<PublisherDbObject>(mockPublisher),
    )

    const res = ds.getByIds(['1'])

    foldOptionPromise(
      res,
      err => {
        throw err
      },
      d => expect(d).toMatchObject(mockPublisher),
    )
    expect(findMany).toBeCalledWith(collection, { _id: { $in: ['1'] } })
  })
})

describe('[PublisherAPI.addComicSeries]', () => {
  it('should add ComicSeries as an issue to Publisher using dataLayer and return left in case of Error', async () => {
    const mockPublisherId = new ObjectID()
    const mockComicSeriesId = new ObjectID()
    const { updateOne } = config.context.dataLayer
    updateOne.mockReturnValueOnce(createMockReaderWithReturnValue({}, true))

    const res = ds.addComicSeries(mockPublisherId, mockComicSeriesId)

    foldOptionPromise(
      res,
      err => expect(err).toBeInstanceOf(MongoError),
      d => {},
    )
    expect(updateOne).toBeCalledWith(
      collection,
      { _id: mockPublisherId },
      { $push: { series: mockComicSeriesId } },
    )
    // TODO: The mock function is actually being called which can be tested by
    // a mock implementation and via debugger. However, this information
    // (config.context.logger.error.mock) seems to be reseted before it can be checked here.
    // expect(config.context.logger.error.mock).toBeCalledWith('TestError')
  })

  it('should add ComicSeries as an issue to Publisher using dataLayer and return right with result', async () => {
    const mockComicSeries = {
      _id: new ObjectID(),
      title: 'Comic',
      url: '/path',
    }
    const mockPublisher = {
      _id: new ObjectID(),
      name: 'Comic',
      series: [mockComicSeries._id],
    }
    const { updateOne } = config.context.dataLayer
    updateOne.mockReturnValueOnce(
      createMockReaderWithReturnValue<PublisherDbObject>(mockPublisher),
    )

    const res = ds.addComicSeries(mockPublisher._id, mockComicSeries._id)

    foldOptionPromise(
      res,
      err => {
        throw err
      },
      d => expect(d).toMatchObject(mockPublisher),
    )
    expect(updateOne).toBeCalledWith(
      collection,
      { _id: mockPublisher._id },
      { $push: { series: mockComicSeries._id } },
    )
  })
})
