import { MongoError, ObjectID, Db } from 'mongodb'
import { pipe } from 'fp-ts/lib/pipeable'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'

import { dataLayer, logger } from '../../../__tests__/_mock'

import { ComicBookType } from 'types/graphql-schema'
import { defaultComicBook } from '__mocks__/ComicBook.mock'

import {
  ComicBookRepository,
  comicBookCollection as collection,
} from '../ComicBook.repository'

// TODO: type of options is lost, dataLayer and logger are any here
const repo = new ComicBookRepository({ dataLayer, logger })

describe('[ComicBookRepository.getById]', () => {
  it('should return RTE.left in case of Error', async () => {
    const { _id } = defaultComicBook
    const { findOne } = dataLayer
    ;(findOne as jest.Mock).mockReturnValueOnce(
      RTE.left(new MongoError('Failed to find ComicBook')),
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
    expect(logger.error).toBeCalledWith('Failed to find ComicBook')
    expect.assertions(3)
  })

  it('should return RTE.left in case of null', async () => {
    const { _id } = defaultComicBook
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

  it('should find ComicBook using dataLayer and return right with result', async () => {
    const { _id, ...comicBookWithoutId } = defaultComicBook
    const mockComicBook = { _id, ...comicBookWithoutId }
    const { findOne } = dataLayer
    ;(findOne as jest.Mock).mockReturnValueOnce(RTE.right(mockComicBook))

    const res = repo.getById(_id)
    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject(mockComicBook)),
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

describe('[ComicBookRepository.getByIds]', () => {
  it('should return RTE.left in case of Error', async () => {
    const { _id } = defaultComicBook
    const { findMany } = dataLayer
    ;(findMany as jest.Mock).mockReturnValueOnce(
      RTE.left(new MongoError('Failed to find ComicBook')),
    )

    const res = repo.getByIds([_id])
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(findMany).toBeCalledWith(
      collection,
      { _id: { $in: [_id] } },
      undefined,
    )
    expect(logger.error).toBeCalledWith('Failed to find ComicBook')
    expect.assertions(3)
  })

  it('should find ComicBooks using dataLayer and return right with result', async () => {
    const { _id, ...comicBookWithoutId } = defaultComicBook
    const mockComicBook = { _id, ...comicBookWithoutId }
    const { findMany } = dataLayer
    ;(findMany as jest.Mock).mockReturnValueOnce(RTE.right([mockComicBook]))

    const res = repo.getByIds([_id])
    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject([mockComicBook])),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(findMany).toBeCalledWith(
      collection,
      { _id: { $in: [_id] } },
      undefined,
    )
    expect.assertions(2)
  })
})

describe('[ComicBookRepository.getByUrls]', () => {
  it('should return RTE.left in case of Error', async () => {
    const { url } = defaultComicBook
    const { findMany } = dataLayer
    ;(findMany as jest.Mock).mockReturnValueOnce(
      RTE.left(new MongoError('Failed to find ComicBook')),
    )

    const res = repo.getByUrls([url])
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(findMany).toBeCalledWith(
      collection,
      {
        url: { $in: [url] },
      },
      undefined,
    )
    expect(logger.error).toBeCalledWith('Failed to find ComicBook')
    expect.assertions(3)
  })

  it('should find ComicBooks using dataLayer and return right with result', async () => {
    const { url, ...comicBookWithoutUrl } = defaultComicBook
    const mockComicBook = { url, ...comicBookWithoutUrl }
    const { findMany } = dataLayer
    ;(findMany as jest.Mock).mockReturnValueOnce(RTE.right([mockComicBook]))

    const res = repo.getByUrls([url])
    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject([mockComicBook])),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(findMany).toBeCalledWith(
      collection,
      {
        url: { $in: [url] },
      },
      undefined,
    )
    expect.assertions(2)
  })
})

describe('[ComicBookRepository.getBySeriesAndReleaseInMonth]', () => {
  it('should return RTE.left in case of Error', async () => {
    const { comicSeries, ...mockComicBookWithoutSeries } = defaultComicBook
    const { findMany } = dataLayer
    ;(findMany as jest.Mock).mockReturnValueOnce(
      RTE.left(new MongoError('Failed to find ComicBook')),
    )

    const res = repo.getBySeriesAndReleaseInMonth(
      [comicSeries as ObjectID],
      1,
      2020,
      ComicBookType.SINGLEISSUE,
    )
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(findMany).toBeCalledWith(
      collection,
      {
        $and: [
          { comicSeries: { $in: [comicSeries] } },
          {
            releaseDate: {
              $gte: new Date(2020, 0, 1),
              $lt: new Date(2020, 1, 1),
            },
          },
          { type: ComicBookType.SINGLEISSUE },
        ],
      },
      undefined,
    )
    expect(logger.error).toBeCalledWith('Failed to find ComicBook')
    expect.assertions(3)
  })

  it('should find ComicBooks using dataLayer and return right with result', async () => {
    const { comicSeries, ...mockComicBookWithoutSeries } = defaultComicBook
    const mockComicBook = { ...mockComicBookWithoutSeries, comicSeries }
    const { findMany } = dataLayer
    ;(findMany as jest.Mock).mockReturnValueOnce(RTE.right([mockComicBook]))

    const res = repo.getBySeriesAndReleaseInMonth(
      [comicSeries as ObjectID],
      1,
      2020,
      ComicBookType.SINGLEISSUE,
    )
    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject([mockComicBook])),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(findMany).toBeCalledWith(
      collection,
      {
        $and: [
          { comicSeries: { $in: [comicSeries] } },
          {
            releaseDate: {
              $gte: new Date(2020, 0, 1),
              $lt: new Date(2020, 1, 1),
            },
          },
          { type: ComicBookType.SINGLEISSUE },
        ],
      },
      undefined,
    )
    expect.assertions(2)
  })
})

describe('[ComicBookRepository.getByReleaseInMonth]', () => {
  it('should return RTE.left in case of Error', async () => {
    const { findMany } = dataLayer
    ;(findMany as jest.Mock).mockReturnValueOnce(
      RTE.left(new MongoError('Failed to find ComicBook')),
    )

    const res = repo.getByReleaseInMonth(1, 2020, ComicBookType.SINGLEISSUE)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(findMany).toBeCalledWith(
      collection,
      {
        $and: [
          {
            releaseDate: {
              $gte: new Date(2020, 0, 1),
              $lt: new Date(2020, 1, 1),
            },
          },
          { type: ComicBookType.SINGLEISSUE },
        ],
      },
      undefined,
    )
    expect(logger.error).toBeCalledWith('Failed to find ComicBook')
    expect.assertions(3)
  })

  it('should find ComicBooks using dataLayer and return right with result', async () => {
    const mockComicBook = { defaultComicBook }
    const { findMany } = dataLayer
    ;(findMany as jest.Mock).mockReturnValueOnce(RTE.right([mockComicBook]))

    const res = repo.getByReleaseInMonth(1, 2020, ComicBookType.SINGLEISSUE)
    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject([mockComicBook])),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(findMany).toBeCalledWith(
      collection,
      {
        $and: [
          {
            releaseDate: {
              $gte: new Date(2020, 0, 1),
              $lt: new Date(2020, 1, 1),
            },
          },
          { type: ComicBookType.SINGLEISSUE },
        ],
      },
      undefined,
    )
    expect.assertions(2)
  })
})

describe('[ComicBookRepository.getByReleaseBetweenAndLastUpdatedBefore]', () => {
  it('should return RTE.left in case of Error', async () => {
    const mockDate = new Date()
    const { findMany } = dataLayer
    ;(findMany as jest.Mock).mockReturnValueOnce(
      RTE.left(new MongoError('Failed to find ComicBook')),
    )

    const res = repo.getByReleaseBetweenAndLastUpdatedBefore(
      mockDate,
      mockDate,
      mockDate,
    )
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(findMany).toBeCalledWith(
      collection,
      {
        $and: [
          {
            releaseDate: {
              $gte: mockDate,
              $lt: mockDate,
            },
          },
          {
            lastModified: {
              $lte: mockDate,
            },
          },
        ],
      },
      undefined,
    )
    expect(logger.error).toBeCalledWith('Failed to find ComicBook')
    expect.assertions(3)
  })

  it('should find ComicBooks using dataLayer and return right with result', async () => {
    const mockDate = new Date()
    const mockComicBook = { defaultComicBook }
    const { findMany } = dataLayer
    ;(findMany as jest.Mock).mockReturnValueOnce(RTE.right([mockComicBook]))

    const res = repo.getByReleaseBetweenAndLastUpdatedBefore(
      mockDate,
      mockDate,
      mockDate,
    )
    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject([mockComicBook])),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(findMany).toBeCalledWith(
      collection,
      {
        $and: [
          {
            releaseDate: {
              $gte: mockDate,
              $lt: mockDate,
            },
          },
          {
            lastModified: {
              $lte: mockDate,
            },
          },
        ],
      },
      undefined,
    )
    expect.assertions(2)
  })
})

describe('[ComicBookRepository.addComicBook]', () => {
  it('should return RTE.left in case of Error', async () => {
    const { _id, lastModified, ...mockComicBook } = defaultComicBook
    const { insertOne } = dataLayer
    ;(insertOne as jest.Mock).mockReturnValueOnce(
      RTE.left(new MongoError('Failed to find ComicBook')),
    )

    const res = repo.addComicBook(mockComicBook)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(insertOne).toBeCalledWith(
      collection,
      { ...mockComicBook, lastModified: expect.any(Date) },
      undefined,
    )
    expect(logger.error).toBeCalledWith('Failed to find ComicBook')
    expect.assertions(3)
  })

  it('should add ComicBook using dataLayer and return right with result', async () => {
    const { _id, lastModified, ...mockComicBookWithoutId } = defaultComicBook
    const mockComicBook = { ...mockComicBookWithoutId, _id, lastModified }
    const { insertOne } = dataLayer
    ;(insertOne as jest.Mock).mockReturnValueOnce(RTE.right(mockComicBook))

    const res = repo.addComicBook(mockComicBookWithoutId)
    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject(mockComicBook)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(insertOne).toBeCalledWith(
      collection,
      { ...mockComicBookWithoutId, lastModified: expect.any(Date) },
      undefined,
    )
    expect.assertions(2)
  })
})

describe('[ComicBookRepository.addComicBooks]', () => {
  it('should return RTE.left in case of Error', async () => {
    const { _id, lastModified, ...mockComicBook } = defaultComicBook
    const { insertMany } = dataLayer
    ;(insertMany as jest.Mock).mockReturnValueOnce(
      RTE.left(new MongoError('Failed to find ComicBook')),
    )

    const res = repo.addComicBooks([mockComicBook])
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(insertMany).toBeCalledWith(
      collection,
      [{ ...mockComicBook, lastModified: expect.any(Date) }],
      undefined,
    )
    expect(logger.error).toBeCalledWith('Failed to find ComicBook')
    expect.assertions(3)
  })

  it('should add ComicBooks using dataLayer and return right with result', async () => {
    const { _id, lastModified, ...mockComicBookWithoutId } = defaultComicBook
    const mockComicBook = { ...mockComicBookWithoutId, _id, lastModified }
    const { insertMany } = dataLayer
    ;(insertMany as jest.Mock).mockReturnValueOnce(RTE.right([mockComicBook]))

    const res = repo.addComicBooks([mockComicBook])
    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject([mockComicBook])),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(insertMany).toBeCalledWith(
      collection,
      [{ ...mockComicBook, lastModified: expect.any(Date) }],
      undefined,
    )
    expect.assertions(2)
  })
})

describe('[ComicBookRepository.updateReleaseDate]', () => {
  it('should return RTE.left in case of Error', async () => {
    const mockDate = new Date()
    const { _id } = defaultComicBook
    const { updateOne } = dataLayer
    ;(updateOne as jest.Mock).mockReturnValueOnce(
      RTE.left(new MongoError('Failed to find ComicBook')),
    )

    const res = repo.updateReleaseDate(_id, mockDate)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(updateOne).toBeCalledWith(
      collection,
      { _id },
      {
        $set: { releaseDate: mockDate },
        $currentDate: { lastModified: true },
      },
      {},
    )
    expect(logger.error).toBeCalledWith('Failed to find ComicBook')
    expect.assertions(3)
  })

  it('should return RTE.left in case of null', async () => {
    const mockDate = new Date()
    const { _id } = defaultComicBook
    const { updateOne } = dataLayer
    ;(updateOne as jest.Mock).mockReturnValueOnce(RTE.right(null))

    const res = repo.updateReleaseDate(_id, mockDate)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(updateOne).toBeCalledWith(
      collection,
      { _id },
      {
        $set: { releaseDate: mockDate },
        $currentDate: { lastModified: true },
      },
      {},
    )
    expect.assertions(2)
  })

  it('should update ComicBook using dataLayer and return right with result', async () => {
    const mockDate = new Date()
    const {
      _id,
      releaseDate,
      ...mockComicBookWithoutRelease
    } = defaultComicBook
    const mockComicBook = {
      ...mockComicBookWithoutRelease,
      _id,
      releaseDate: mockDate,
    }
    const { updateOne } = dataLayer
    ;(updateOne as jest.Mock).mockReturnValueOnce(RTE.right(mockComicBook))

    const res = repo.updateReleaseDate(_id, mockDate)
    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject(mockComicBook)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(updateOne).toBeCalledWith(
      collection,
      { _id },
      {
        $set: { releaseDate: mockDate },
        $currentDate: { lastModified: true },
      },
      {},
    )
    expect.assertions(2)
  })
})

describe('[ComicBookRepository.updateComicBookDetails]', () => {
  it('should return RTE.left in case of Error', async () => {
    const {
      _id,
      url,
      publisher,
      coverImgUrl,
      releaseDate,
      creators,
      description,
    } = defaultComicBook
    const comicBookDetails = {
      publisher,
      coverImgUrl,
      releaseDate,
      creators,
      description,
    }
    const { updateOne } = dataLayer
    ;(updateOne as jest.Mock).mockReturnValueOnce(
      RTE.left(new MongoError('Failed to find ComicBook')),
    )

    const res = repo.updateComicBookDetails(_id, comicBookDetails)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(updateOne).toBeCalledWith(
      collection,
      { _id },
      {
        $set: { publisher, coverImgUrl, releaseDate, creators, description },
        $currentDate: { lastModified: true },
      },
      {},
    )
    expect(logger.error).toBeCalledWith('Failed to find ComicBook')
    expect.assertions(3)
  })

  it('should return RTE.left in case of null', async () => {
    const {
      _id,
      url,
      publisher,
      coverImgUrl,
      releaseDate,
      creators,
      description,
    } = defaultComicBook
    const comicBookDetails = {
      publisher,
      coverImgUrl,
      releaseDate,
      creators,
      description,
    }
    const { updateOne } = dataLayer
    ;(updateOne as jest.Mock).mockReturnValueOnce(RTE.right(null))

    const res = repo.updateComicBookDetails(_id, comicBookDetails)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(updateOne).toBeCalledWith(
      collection,
      { _id },
      {
        $set: { publisher, coverImgUrl, releaseDate, creators, description },
        $currentDate: { lastModified: true },
      },
      {},
    )
    expect.assertions(2)
  })

  it('should update ComicBook using dataLayer and return right with result', async () => {
    const {
      _id,
      url,
      publisher,
      coverImgUrl,
      releaseDate,
      creators,
      description,
      ...restMockComicBook
    } = defaultComicBook
    const comicBookDetails = {
      publisher,
      coverImgUrl,
      releaseDate,
      creators,
      description,
    }
    const mockComicBook = {
      url,
      publisher,
      coverImgUrl,
      releaseDate,
      creators,
      description,
      ...restMockComicBook,
    }
    const { updateOne } = dataLayer
    ;(updateOne as jest.Mock).mockReturnValueOnce(RTE.right(mockComicBook))

    const res = repo.updateComicBookDetails(_id, comicBookDetails)
    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject(mockComicBook)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(updateOne).toBeCalledWith(
      collection,
      { _id },
      {
        $set: { publisher, coverImgUrl, releaseDate, creators, description },
        $currentDate: { lastModified: true },
      },
      {},
    )
    expect.assertions(2)
  })
})
