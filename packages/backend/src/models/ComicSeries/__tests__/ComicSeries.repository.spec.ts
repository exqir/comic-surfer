import { MongoError, ObjectID, Db } from 'mongodb'
import { pipe } from 'fp-ts/lib/pipeable'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'

import { dataLayer, logger } from '../../../__tests__/_mock'

import {
  ComicSeriesRepository,
  comicSeriesCollection as collection,
} from '../ComicSeries.repository'
import { ComicSeriesDbObject, ComicBookType } from 'types/server-schema'

const defaultComicSeries: ComicSeriesDbObject = {
  _id: new ObjectID(),
  title: 'Comic',
  url: '/path',
  collectionsUrl: null,
  collections: [],
  singleIssuesUrl: null,
  singleIssues: [],
  publisher: null,
  lastModified: new Date(),
}

// TODO: type of options is lost, dataLayer and logger are any here
const repo = new ComicSeriesRepository({ dataLayer, logger })

describe('[ComicSeriesRepository.getById]', () => {
  it('should return RTE.left in case of Error', async () => {
    const { _id } = defaultComicSeries
    const { findOne } = dataLayer
    ;(findOne as jest.Mock).mockReturnValueOnce(
      RTE.left(new MongoError('Failed to find ComicSeries')),
    )

    const res = repo.getById(_id)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(findOne).toBeCalledWith(
      collection,
      {
        _id,
      },
      {},
    )
    expect(logger.error).toBeCalledWith('Failed to find ComicSeries')
    expect.assertions(3)
  })

  it('should return RTE.left in case of null', async () => {
    const { _id } = defaultComicSeries
    const { findOne } = dataLayer
    ;(findOne as jest.Mock).mockReturnValueOnce(RTE.right(null))

    const res = repo.getById(_id)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(findOne).toBeCalledWith(
      collection,
      {
        _id,
      },
      {},
    )
    expect.assertions(2)
  })

  it('should find ComicSeries using dataLayer and return right with result', async () => {
    const { _id, ...comicSeriesWithoutId } = defaultComicSeries
    const mockComicSeries = { _id, ...comicSeriesWithoutId }
    const { findOne } = dataLayer
    ;(findOne as jest.Mock).mockReturnValueOnce(RTE.right(mockComicSeries))

    const res = repo.getById(_id)
    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject(mockComicSeries)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(findOne).toBeCalledWith(
      collection,
      {
        _id,
      },
      {},
    )
    expect.assertions(2)
  })
})

describe('[ComicSeriesRepository.addComicBook]', () => {
  it('should return RTE.left in case of Error', async () => {
    const { _id } = defaultComicSeries
    const comicBookId = new ObjectID()
    const { updateOne } = dataLayer
    ;(updateOne as jest.Mock).mockReturnValueOnce(
      RTE.left(new MongoError('Failed to find ComicSeries')),
    )

    const res = repo.addComicBook(_id, comicBookId, ComicBookType.SINGLEISSUE)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(updateOne).toBeCalledWith(
      collection,
      { _id },
      {
        $addToSet: { singleIssues: comicBookId },
        $currentDate: { lastModified: true },
      },
      {},
    )
    expect(logger.error).toBeCalledWith('Failed to find ComicSeries')
    expect.assertions(3)
  })

  it('should return RTE.left in case of null', async () => {
    const { _id } = defaultComicSeries
    const comicBookId = new ObjectID()
    const { updateOne } = dataLayer
    ;(updateOne as jest.Mock).mockReturnValueOnce(RTE.right(null))

    const res = repo.addComicBook(_id, comicBookId, ComicBookType.SINGLEISSUE)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(updateOne).toBeCalledWith(
      collection,
      { _id },
      {
        $addToSet: { singleIssues: comicBookId },
        $currentDate: { lastModified: true },
      },
      {},
    )
    expect.assertions(2)
  })

  it('should add SingleIssue ComicBook using dataLayer and return right with result', async () => {
    const { _id, ...comicSeriesWithoutId } = defaultComicSeries
    const mockComicSeries = { _id, ...comicSeriesWithoutId }
    const comicBookId = new ObjectID()
    const { updateOne } = dataLayer
    ;(updateOne as jest.Mock).mockReturnValueOnce(RTE.right(mockComicSeries))

    const res = repo.addComicBook(_id, comicBookId, ComicBookType.SINGLEISSUE)
    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject(mockComicSeries)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(updateOne).toBeCalledWith(
      collection,
      { _id },
      {
        $addToSet: { singleIssues: comicBookId },
        $currentDate: { lastModified: true },
      },
      {},
    )
    expect.assertions(2)
  })

  it('should add Collection ComicBooks using dataLayer and return right with result', async () => {
    const { _id, ...comicSeriesWithoutId } = defaultComicSeries
    const mockComicSeries = { _id, ...comicSeriesWithoutId }
    const comicBookId = new ObjectID()
    const { updateOne } = dataLayer
    ;(updateOne as jest.Mock).mockReturnValueOnce(RTE.right(mockComicSeries))

    const res = repo.addComicBook(_id, comicBookId, ComicBookType.COLLECTION)
    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject(mockComicSeries)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(updateOne).toBeCalledWith(
      collection,
      { _id },
      {
        $addToSet: { collections: comicBookId },
        $currentDate: { lastModified: true },
      },
      {},
    )
    expect.assertions(2)
  })
})

describe('[ComicSeriesRepository.addComicBooks]', () => {
  it('should return RTE.left in case of Error', async () => {
    const { _id } = defaultComicSeries
    const comicBookIds = [new ObjectID()]
    const { updateOne } = dataLayer
    ;(updateOne as jest.Mock).mockReturnValueOnce(
      RTE.left(new MongoError('Failed to find ComicSeries')),
    )

    const res = repo.addComicBooks(_id, comicBookIds, ComicBookType.SINGLEISSUE)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(updateOne).toBeCalledWith(
      collection,
      { _id },
      {
        $addToSet: { singleIssues: { $each: comicBookIds } },
        $currentDate: { lastModified: true },
      },
      {},
    )
    expect(logger.error).toBeCalledWith('Failed to find ComicSeries')
    expect.assertions(3)
  })

  it('should return RTE.left in case of null', async () => {
    const { _id } = defaultComicSeries
    const comicBookIds = [new ObjectID()]
    const { updateOne } = dataLayer
    ;(updateOne as jest.Mock).mockReturnValueOnce(RTE.right(null))

    const res = repo.addComicBooks(_id, comicBookIds, ComicBookType.SINGLEISSUE)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(updateOne).toBeCalledWith(
      collection,
      { _id },
      {
        $addToSet: { singleIssues: { $each: comicBookIds } },
        $currentDate: { lastModified: true },
      },
      {},
    )
    expect.assertions(2)
  })

  it('should add SingleIssue ComicBooks using dataLayer and return right with result', async () => {
    const { _id, ...comicSeriesWithoutId } = defaultComicSeries
    const mockComicSeries = { _id, ...comicSeriesWithoutId }
    const comicBookIds = [new ObjectID()]
    const { updateOne } = dataLayer
    ;(updateOne as jest.Mock).mockReturnValueOnce(RTE.right(mockComicSeries))

    const res = repo.addComicBooks(_id, comicBookIds, ComicBookType.SINGLEISSUE)
    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject(mockComicSeries)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(updateOne).toBeCalledWith(
      collection,
      { _id },
      {
        $addToSet: { singleIssues: { $each: comicBookIds } },
        $currentDate: { lastModified: true },
      },
      {},
    )
    expect.assertions(2)
  })

  it('should add Collection ComicBooks using dataLayer and return right with result', async () => {
    const { _id, ...comicSeriesWithoutId } = defaultComicSeries
    const mockComicSeries = { _id, ...comicSeriesWithoutId }
    const comicBookIds = [new ObjectID()]
    const { updateOne } = dataLayer
    ;(updateOne as jest.Mock).mockReturnValueOnce(RTE.right(mockComicSeries))

    const res = repo.addComicBooks(_id, comicBookIds, ComicBookType.COLLECTION)
    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject(mockComicSeries)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(updateOne).toBeCalledWith(
      collection,
      { _id },
      {
        $addToSet: { collections: { $each: comicBookIds } },
        $currentDate: { lastModified: true },
      },
      {},
    )
    expect.assertions(2)
  })
})

describe('[ComicSeriesRepository.getOrCreate]', () => {
  it('should return RTE.left in case of Error', async () => {
    const { url, ...comicSeriesWithoutUrl } = defaultComicSeries
    const mockComicSeries = { url, ...comicSeriesWithoutUrl }
    const { updateOne } = dataLayer
    ;(updateOne as jest.Mock).mockReturnValueOnce(
      RTE.left(new MongoError('Failed to find ComicSeries')),
    )

    const res = repo.getOrCreate(mockComicSeries)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(updateOne).toBeCalledWith(
      collection,
      { url },
      {
        $setOnInsert: {
          ...mockComicSeries,
          publisher: null,
          singleIssues: [],
          collections: [],
          lastModified: expect.any(Date),
        },
      },
      { upsert: true },
    )
    expect(logger.error).toBeCalledWith('Failed to find ComicSeries')
    expect.assertions(3)
  })

  it('should return RTE.left in case of null', async () => {
    const { url, ...comicSeriesWithoutUrl } = defaultComicSeries
    const mockComicSeries = { url, ...comicSeriesWithoutUrl }
    const { updateOne } = dataLayer
    ;(updateOne as jest.Mock).mockReturnValueOnce(RTE.right(null))

    const res = repo.getOrCreate(mockComicSeries)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(updateOne).toBeCalledWith(
      collection,
      { url },
      {
        $setOnInsert: {
          ...mockComicSeries,
          publisher: null,
          singleIssues: [],
          collections: [],
          lastModified: expect.any(Date),
        },
      },
      { upsert: true },
    )
    expect.assertions(2)
  })

  it('should upsert ComicSeries using dataLayer and return right with result', async () => {
    const { url, ...comicSeriesWithoutUrl } = defaultComicSeries
    const mockComicSeries = { url, ...comicSeriesWithoutUrl }
    const { updateOne } = dataLayer
    ;(updateOne as jest.Mock).mockReturnValueOnce(RTE.right(mockComicSeries))

    const res = repo.getOrCreate(mockComicSeries)
    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject(mockComicSeries)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(updateOne).toBeCalledWith(
      collection,
      { url },
      {
        $setOnInsert: {
          ...mockComicSeries,
          publisher: null,
          singleIssues: [],
          collections: [],
          lastModified: expect.any(Date),
        },
      },
      { upsert: true },
    )
    expect.assertions(2)
  })
})

describe('[ComicSeriesRepository.getLastUpdatedBefore]', () => {
  it('should return RTE.left in case of Error', async () => {
    const mockDate = new Date()
    const { findMany } = dataLayer
    ;(findMany as jest.Mock).mockReturnValueOnce(
      RTE.left(new MongoError('Failed to find ComicSeries')),
    )

    const res = repo.getLastUpdatedBefore(mockDate)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(findMany).toBeCalledWith(
      collection,
      {
        lastModified: {
          $lte: new Date(
            mockDate.getFullYear(),
            mockDate.getMonth() - 1,
            mockDate.getDate(),
          ),
        },
      },
      undefined,
    )
    expect(logger.error).toBeCalledWith('Failed to find ComicSeries')
    expect.assertions(3)
  })

  it('should find ComicSeries using dataLayer and return right with result', async () => {
    const mockComicSeries = { ...defaultComicSeries }
    const mockDate = new Date()
    const { findMany } = dataLayer
    ;(findMany as jest.Mock).mockReturnValueOnce(RTE.right(mockComicSeries))

    const res = repo.getLastUpdatedBefore(mockDate)
    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject(mockComicSeries)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(findMany).toBeCalledWith(
      collection,
      {
        lastModified: {
          $lte: new Date(
            mockDate.getFullYear(),
            mockDate.getMonth() - 1,
            mockDate.getDate(),
          ),
        },
      },
      undefined,
    )
    expect.assertions(2)
  })
})

describe('[ComicSeriesRepository.setPublisher]', () => {
  it('should return RTE.left in case of Error', async () => {
    const { _id } = defaultComicSeries
    const publisherId = new ObjectID()
    const { updateOne } = dataLayer
    ;(updateOne as jest.Mock).mockReturnValueOnce(
      RTE.left(new MongoError('Failed to find ComicSeries')),
    )

    const res = repo.setPublisher(_id, publisherId)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(updateOne).toBeCalledWith(
      collection,
      { _id },
      {
        $set: {
          publisher: publisherId,
        },
      },
      {},
    )
    expect(logger.error).toBeCalledWith('Failed to find ComicSeries')
    expect.assertions(3)
  })

  it('should return RTE.left in case of null', async () => {
    const { _id } = defaultComicSeries
    const publisherId = new ObjectID()
    const { updateOne } = dataLayer
    ;(updateOne as jest.Mock).mockReturnValueOnce(RTE.right(null))

    const res = repo.setPublisher(_id, publisherId)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(updateOne).toBeCalledWith(
      collection,
      { _id },
      {
        $set: {
          publisher: publisherId,
        },
      },
      {},
    )
    expect.assertions(2)
  })

  it('should update ComicSeries using dataLayer and return right with result', async () => {
    const { _id, ...comicSeriesWithoutId } = defaultComicSeries
    const mockComicSeries = { _id, ...comicSeriesWithoutId }
    const publisherId = new ObjectID()
    const { updateOne } = dataLayer
    ;(updateOne as jest.Mock).mockReturnValueOnce(RTE.right(mockComicSeries))

    const res = repo.setPublisher(_id, publisherId)
    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject(mockComicSeries)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(updateOne).toBeCalledWith(
      collection,
      { _id },
      {
        $set: {
          publisher: publisherId,
        },
      },
      {},
    )
    expect.assertions(2)
  })
})
