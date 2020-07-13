import { MongoError, ObjectID } from 'mongodb'
import { PublisherAPI, publisherCollection as collection } from './PublisherAPI'
import {
  createMockConfig,
  createMockReaderWithReturnValue,
  runRTEwithMockDb,
} from 'tests/_utils'
import { PublisherDbObject } from 'types/server-schema'
import { pipe } from 'fp-ts/lib/pipeable'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'

const config = createMockConfig()
const defaultPublisher: PublisherDbObject = {
  _id: new ObjectID(),
  name: 'Image',
  iconUrl: null,
  url: null,
  cxUrl: null,
  comicSeries: [],
}

const ds = new PublisherAPI()
ds.initialize(config)

describe('[PublisherAPI.insert]', () => {
  it('should insert Publisher using dataLayer and return left in case of Error', async () => {
    const mockPublisher = { ...defaultPublisher }
    delete mockPublisher._id
    const { insertOne } = config.context.dataLayer
    ;(insertOne as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue({}, true),
    )

    const res = ds.insert(mockPublisher)

    expect.assertions(2)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      runRTEwithMockDb,
    )
    expect(insertOne).toBeCalledWith(collection, mockPublisher)
    // TODO: The mock function is actually being called which can be tested by
    // a mock implementation and via debugger. However, this information
    // (config.context.logger.error.mock) seems to be reseted before it can be checked here.
    // expect(config.context.logger.error.mock).toBeCalledWith('TestError')
  })

  it('should insert Publisher using dataLayer and return right with result', async () => {
    const mockPublisher = { ...defaultPublisher }
    delete mockPublisher._id
    const { insertOne } = config.context.dataLayer
    ;(insertOne as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue<PublisherDbObject>({
        ...mockPublisher,
        _id: new ObjectID(),
      }),
    )

    const res = ds.insert(mockPublisher)

    expect.assertions(2)
    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject(mockPublisher)),
      runRTEwithMockDb,
    )
    expect(insertOne).toBeCalledWith(collection, mockPublisher)
  })
})

describe('[PublisherAPI.getById]', () => {
  it('should query dataLayer for Publisher with id and return left in case of Error', async () => {
    const mockPublisher = { ...defaultPublisher }
    const { findOne } = config.context.dataLayer
    ;(findOne as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue({}, true),
    )

    const res = ds.getById(mockPublisher._id)

    expect.assertions(2)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      runRTEwithMockDb,
    )
    expect(findOne).toBeCalledWith(collection, { _id: mockPublisher._id })
    // TODO: The mock function is actually being called which can be tested by
    // a mock implementation and via debugger. However, this information
    // (config.context.logger.error.mock) seems to be reseted before it can be checked here.
    // expect(config.context.logger.error.mock).toBeCalledWith('TestError')
  })

  it('should query dataLayer for Publisher with id and return right with result', async () => {
    const mockPublisher = { ...defaultPublisher }
    const { findOne } = config.context.dataLayer
    ;(findOne as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue<PublisherDbObject>(mockPublisher),
    )

    const res = ds.getById(mockPublisher._id)

    expect.assertions(2)
    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject(mockPublisher)),
      runRTEwithMockDb,
    )
    expect(findOne).toBeCalledWith(collection, { _id: mockPublisher._id })
  })
})

describe('[PublisherAPI.getByIds]', () => {
  it('should query dataLayer for Publisher with ids and return left in case of Error', async () => {
    const mockPublisher = { ...defaultPublisher }
    const { findMany } = config.context.dataLayer
    ;(findMany as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue({}, true),
    )

    const res = ds.getByIds([mockPublisher._id])

    expect.assertions(2)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      runRTEwithMockDb,
    )
    expect(findMany).toBeCalledWith(collection, {
      _id: { $in: [mockPublisher._id] },
    })
    // TODO: The mock function is actually being called which can be tested by
    // a mock implementation and via debugger. However, this information
    // (config.context.logger.error.mock) seems to be reseted before it can be checked here.
    // expect(config.context.logger.error.mock).toBeCalledWith('TestError')
  })

  it('should query dataLayer for Publisher with ids and return right with result', async () => {
    const mockPublisher = [{ ...defaultPublisher }]
    const { findMany } = config.context.dataLayer
    ;(findMany as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue<PublisherDbObject>(mockPublisher),
    )

    const res = ds.getByIds([mockPublisher[0]._id])

    expect.assertions(2)
    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject(mockPublisher)),
      runRTEwithMockDb,
    )
    expect(findMany).toBeCalledWith(collection, {
      _id: { $in: [mockPublisher[0]._id] },
    })
  })
})

describe('[PublisherAPI.getAll]', () => {
  it('should query dataLayer for all Publishers and return left in case of Error', async () => {
    const { findMany } = config.context.dataLayer
    ;(findMany as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue({}, true),
    )

    const res = ds.getAll()

    expect.assertions(2)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      runRTEwithMockDb,
    )
    expect(findMany).toBeCalledWith(collection, {})
    // TODO: The mock function is actually being called which can be tested by
    // a mock implementation and via debugger. However, this information
    // (config.context.logger.error.mock) seems to be reseted before it can be checked here.
    // expect(config.context.logger.error.mock).toBeCalledWith('TestError')
  })

  it('should query dataLayer for all Publishers and return right with result', async () => {
    const mockPublisher = [{ ...defaultPublisher }]
    const { findMany } = config.context.dataLayer
    ;(findMany as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue<PublisherDbObject>(mockPublisher),
    )

    const res = ds.getAll()

    expect.assertions(2)
    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject(mockPublisher)),
      runRTEwithMockDb,
    )
    expect(findMany).toBeCalledWith(collection, {})
  })
})

describe('[PublisherAPI.getByName]', () => {
  it('should query dataLayer for Publisher with id and return left in case of Error', async () => {
    const mockPublisher = { ...defaultPublisher }
    const { findOne } = config.context.dataLayer
    ;(findOne as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue({}, true),
    )

    const res = ds.getByName(mockPublisher.name)

    expect.assertions(2)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      runRTEwithMockDb,
    )
    expect(findOne).toBeCalledWith(collection, { name: mockPublisher.name })
    // TODO: The mock function is actually being called which can be tested by
    // a mock implementation and via debugger. However, this information
    // (config.context.logger.error.mock) seems to be reseted before it can be checked here.
    // expect(config.context.logger.error.mock).toBeCalledWith('TestError')
  })

  it('should query dataLayer for Publisher with id and return right with result', async () => {
    const mockPublisher = { ...defaultPublisher }
    const { findOne } = config.context.dataLayer
    ;(findOne as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue<PublisherDbObject>(mockPublisher),
    )

    const res = ds.getByName(mockPublisher.name)

    expect.assertions(2)
    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject(mockPublisher)),
      runRTEwithMockDb,
    )
    expect(findOne).toBeCalledWith(collection, { name: mockPublisher.name })
  })
})

describe('[PublisherAPI.getByNames]', () => {
  it('should query dataLayer for Publisher with ids and return left in case of Error', async () => {
    const mockPublisher = { ...defaultPublisher }
    const { findMany } = config.context.dataLayer
    ;(findMany as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue({}, true),
    )

    const res = ds.getByNames([mockPublisher.name])

    expect.assertions(2)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      runRTEwithMockDb,
    )
    expect(findMany).toBeCalledWith(collection, {
      name: { $in: [mockPublisher.name] },
    })
    // TODO: The mock function is actually being called which can be tested by
    // a mock implementation and via debugger. However, this information
    // (config.context.logger.error.mock) seems to be reseted before it can be checked here.
    // expect(config.context.logger.error.mock).toBeCalledWith('TestError')
  })

  it('should query dataLayer for Publisher with ids and return right with result', async () => {
    const mockPublisher = [{ ...defaultPublisher }]
    const { findMany } = config.context.dataLayer
    ;(findMany as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue<PublisherDbObject>(mockPublisher),
    )

    const res = ds.getByNames([mockPublisher[0].name])

    expect.assertions(2)
    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject(mockPublisher)),
      runRTEwithMockDb,
    )
    expect(findMany).toBeCalledWith(collection, {
      name: { $in: [mockPublisher[0].name] },
    })
  })
})

describe('[PublisherAPI.addComicSeries]', () => {
  it('should add ComicSeries as an issue to Publisher using dataLayer and return left in case of Error', async () => {
    const mockPublisherId = new ObjectID()
    const mockComicSeriesId = new ObjectID()
    const { updateOne } = config.context.dataLayer
    ;(updateOne as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue({}, true),
    )

    const res = ds.addComicSeries(mockPublisherId, mockComicSeriesId)

    expect.assertions(2)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      runRTEwithMockDb,
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
      ...defaultPublisher,
      series: [mockComicSeries._id],
    }
    const { updateOne } = config.context.dataLayer
    ;(updateOne as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue<PublisherDbObject>(mockPublisher),
    )

    const res = ds.addComicSeries(mockPublisher._id, mockComicSeries._id)

    expect.assertions(2)
    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject(mockPublisher)),
      runRTEwithMockDb,
    )
    expect(updateOne).toBeCalledWith(
      collection,
      { _id: mockPublisher._id },
      { $push: { series: mockComicSeries._id } },
    )
  })
})
