import { MongoError, ObjectID } from 'mongodb'
import { ComicBookAPI, comicBookCollection as collection } from './ComicBookAPI'
import {
  createMockConfig,
  createMockReaderWithReturnValue,
  runRTEwithMockDb,
} from 'tests/_utils'
import { ComicBookDbObject, ComicBookType } from 'types/server-schema'
import { pipe } from 'fp-ts/lib/pipeable'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'

const config = createMockConfig()
const defaultComicBook: ComicBookDbObject = {
  _id: new ObjectID(),
  title: 'Comic',
  url: '/path',
  issueNo: null,
  creators: [],
  coverImgUrl: null,
  publisher: null,
  releaseDate: null,
  comicSeries: null,
  type: ComicBookType.SINGLEISSUE,
  lastModified: new Date(),
}

const ds = new ComicBookAPI()
ds.initialize(config)

describe('[ComicBookAPI.insert]', () => {
  it('should insert ComicBook using dataLayer and return left in case of Error', async () => {
    const mockComicBook = { ...defaultComicBook }
    delete mockComicBook._id
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

  it('should insert ComicBook using dataLayer and return right with result', async () => {
    const mockComicBook = { ...defaultComicBook }
    delete mockComicBook._id
    const { insertOne } = config.context.dataLayer
    ;(insertOne as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue<ComicBookDbObject>({
        ...mockComicBook,
        _id: new ObjectID(),
      }),
    )

    const res = ds.insert(mockComicBook)

    expect.assertions(2)
    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject(mockComicBook)),
      runRTEwithMockDb,
    )
    expect(insertOne).toBeCalledWith(collection, mockComicBook)
  })
})

describe('[ComicBookAPI.insertMany]', () => {
  it('should insert ComicBooks using dataLayer and return left in case of Error', async () => {
    const { _id, lastModified, ...mockComicBook } = { ...defaultComicBook }
    const { insertMany } = config.context.dataLayer
    ;(insertMany as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue({}, true),
    )

    const res = ds.insertMany([mockComicBook])

    expect.assertions(2)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      runRTEwithMockDb,
    )
    expect(insertMany).toBeCalledWith(collection, [
      expect.objectContaining(mockComicBook),
    ])
    // TODO: The mock function is actually being called which can be tested by
    // a mock implementation and via debugger. However, this information
    // (config.context.logger.error.mock) seems to be reseted before it can be checked here.
    // expect(config.context.logger.error.mock).toBeCalledWith('TestError')
  })

  it('should insert ComicBook using dataLayer and return right with result', async () => {
    const { _id, lastModified, ...mockComicBook } = { ...defaultComicBook }
    const { insertMany } = config.context.dataLayer
    ;(insertMany as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue<ComicBookDbObject>([
        {
          ...mockComicBook,
          lastModified,
          _id: new ObjectID(),
        },
      ]),
    )

    const res = ds.insertMany([mockComicBook])

    expect.assertions(2)
    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject([mockComicBook])),
      runRTEwithMockDb,
    )
    expect(insertMany).toBeCalledWith(collection, [
      expect.objectContaining(mockComicBook),
    ])
  })
})

describe('[ComicBookAPI.getById]', () => {
  it('should query dataLayer for ComicBook with id and return left in case of Error', async () => {
    const mockComicBook = { ...defaultComicBook }
    const { findOne } = config.context.dataLayer
    ;(findOne as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue({}, true),
    )

    const res = ds.getById(mockComicBook._id)

    expect.assertions(2)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      runRTEwithMockDb,
    )
    expect(findOne).toBeCalledWith(collection, { _id: mockComicBook._id })
    // TODO: The mock function is actually being called which can be tested by
    // a mock implementation and via debugger. However, this information
    // (config.context.logger.error.mock) seems to be reseted before it can be checked here.
    // expect(config.context.logger.error.mock).toBeCalledWith('TestError')
  })

  it('should query dataLayer for ComicBook with id and return right with result', async () => {
    const mockComicBook = { ...defaultComicBook }
    const { findOne } = config.context.dataLayer
    ;(findOne as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue<ComicBookDbObject>(mockComicBook),
    )

    const res = ds.getById(mockComicBook._id)

    expect.assertions(2)
    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject(mockComicBook)),
      runRTEwithMockDb,
    )
    expect(findOne).toBeCalledWith(collection, { _id: mockComicBook._id })
  })
})

describe('[ComicBookAPI.getByIds]', () => {
  it('should query dataLayer for ComicBooks with ids and return left in case of Error', async () => {
    const mockComicBook = { ...defaultComicBook }
    const { findMany } = config.context.dataLayer
    ;(findMany as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue({}, true),
    )

    const res = ds.getByIds([mockComicBook._id])

    expect.assertions(2)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      runRTEwithMockDb,
    )
    expect(findMany).toBeCalledWith(collection, {
      _id: { $in: [mockComicBook._id] },
    })
    // TODO: The mock function is actually being called which can be tested by
    // a mock implementation and via debugger. However, this information
    // (config.context.logger.error.mock) seems to be reseted before it can be checked here.
    // expect(config.context.logger.error.mock).toBeCalledWith('TestError')
  })

  it('should query dataLayer for ComicBooks with ids and return right with result', async () => {
    const mockComicBook = [{ ...defaultComicBook }]
    const { findMany } = config.context.dataLayer
    ;(findMany as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue<ComicBookDbObject>(mockComicBook),
    )

    const res = ds.getByIds([mockComicBook[0]._id])

    expect.assertions(2)
    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject(mockComicBook)),
      runRTEwithMockDb,
    )
    expect(findMany).toBeCalledWith(collection, {
      _id: { $in: [mockComicBook[0]._id] },
    })
  })
})

describe('[ComicBookAPI.updateReleaseDate]', () => {
  it('should update ComicBook using dataLayer and return left in case of Error', async () => {
    const id = new ObjectID()
    const { updateOne } = config.context.dataLayer
    ;(updateOne as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue({}, true),
    )

    const res = ds.updateReleaseDate(id, new Date('2020-05-30'))

    expect.assertions(2)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      runRTEwithMockDb,
    )
    expect(updateOne).toBeCalledWith(
      collection,
      { _id: id },
      {
        $set: { releaseDate: new Date('2020-05-30') },
        $currentDate: { lastModified: true },
      },
    )
    // TODO: The mock function is actually being called which can be tested by
    // a mock implementation and via debugger. However, this information
    // (config.context.logger.error.mock) seems to be reseted before it can be checked here.
    // expect(config.context.logger.error.mock).toBeCalledWith('TestError')
  })

  it('should update ComicBook using dataLayer and return right with result', async () => {
    const mockComicBook = {
      ...defaultComicBook,
      releaseDate: new Date('2020-01-30'),
    }
    const newDate = new Date('2020-05-30')
    const { updateOne } = config.context.dataLayer
    ;(updateOne as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue<ComicBookDbObject>({
        ...mockComicBook,
        releaseDate: newDate,
      }),
    )

    const res = ds.updateReleaseDate(mockComicBook._id, newDate)

    expect.assertions(2)
    await pipe(
      res,
      RTE.map((d) => expect(d!.releaseDate).toEqual(newDate)),
      runRTEwithMockDb,
    )
    expect(updateOne).toBeCalledWith(
      collection,
      { _id: mockComicBook._id },
      { $set: { releaseDate: newDate }, $currentDate: { lastModified: true } },
    )
  })
})

describe('[ComicBookAPI.enhanceWithScrapResult]', () => {
  it('should update ComicBook using dataLayer and return left in case of Error', async () => {
    const mockComicBook = { ...defaultComicBook }
    const scrapResult = {
      publisher: new ObjectID(),
      coverImgUrl: '/image',
      releaseDate: new Date('2020-05-30'),
      creators: [{ name: 'John Rambo' }],
    }
    const { updateOne } = config.context.dataLayer
    ;(updateOne as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue({}, true),
    )

    const res = ds.enhanceWithScrapResult(mockComicBook.url, scrapResult)

    expect.assertions(2)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      runRTEwithMockDb,
    )
    expect(updateOne).toBeCalledWith(
      collection,
      { url: mockComicBook.url },
      { $set: scrapResult, $currentDate: { lastModified: true } },
    )
    // TODO: The mock function is actually being called which can be tested by
    // a mock implementation and via debugger. However, this information
    // (config.context.logger.error.mock) seems to be reseted before it can be checked here.
    // expect(config.context.logger.error.mock).toBeCalledWith('TestError')
  })

  it('should update ComicBook using dataLayer and return right with result', async () => {
    const mockComicBook = { ...defaultComicBook }
    const scrapResult = {
      publisher: new ObjectID(),
      coverImgUrl: '/image',
      releaseDate: new Date('2020-05-30'),
      creators: [{ name: 'John Rambo' }],
    }
    const { updateOne } = config.context.dataLayer
    ;(updateOne as jest.Mock).mockReturnValueOnce(
      createMockReaderWithReturnValue<ComicBookDbObject>({
        ...mockComicBook,
        ...scrapResult,
      }),
    )

    const res = ds.enhanceWithScrapResult(mockComicBook.url, scrapResult)

    expect.assertions(4)
    await pipe(
      res,
      RTE.map((d) => {
        expect(d!.releaseDate).toEqual(scrapResult.releaseDate)
        expect(d!.coverImgUrl).toEqual(scrapResult.coverImgUrl)
        expect(d!.creators).toEqual(scrapResult.creators)
      }),
      runRTEwithMockDb,
    )
    expect(updateOne).toBeCalledWith(
      collection,
      { url: mockComicBook.url },
      { $set: scrapResult, $currentDate: { lastModified: true } },
    )
  })
})
