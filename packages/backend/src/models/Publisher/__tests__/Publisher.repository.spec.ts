import { MongoError, ObjectID, Db } from 'mongodb'
import { pipe } from 'fp-ts/lib/pipeable'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'

import { dataLayer, logger } from '../../../__tests__/_mock'

import {
  PublisherRepository,
  publisherCollection as collection,
} from '../Publisher.repository'
import { PublisherDbObject } from 'types/server-schema'

const defaultPublisher: PublisherDbObject = {
  _id: new ObjectID(),
  name: 'Image',
  iconUrl: null,
  url: '/path',
  cxUrl: null,
  comicSeries: [],
}

// TODO: type of options is lost, dataLayer and logger are any here
const repo = new PublisherRepository({ dataLayer, logger })

describe('[PublisherRepository.getById]', () => {
  it('should return RTE.left in case of Error', async () => {
    const { _id } = defaultPublisher
    const { findOne } = dataLayer
    ;(findOne as jest.Mock).mockReturnValueOnce(
      RTE.left(new MongoError('Failed to find Publisher')),
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
    expect(logger.error).toBeCalledWith('Failed to find Publisher')
    expect.assertions(3)
  })

  it('should return RTE.left in case of null', async () => {
    const { _id } = defaultPublisher
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

  it('should find Publisher using dataLayer and return right with result', async () => {
    const { _id, ...publisherWithoutId } = defaultPublisher
    const mockPublisher = { _id, ...publisherWithoutId }
    const { findOne } = dataLayer
    ;(findOne as jest.Mock).mockReturnValueOnce(RTE.right(mockPublisher))

    const res = repo.getById(_id)
    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject(mockPublisher)),
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

describe('[PublisherRepository.getByUrl]', () => {
  it('should return RTE.left in case of Error', async () => {
    const { url } = defaultPublisher
    const { findOne } = dataLayer
    ;(findOne as jest.Mock).mockReturnValueOnce(
      RTE.left(new MongoError('Failed to find Publisher')),
    )

    const res = repo.getByUrl(url!)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(findOne).toBeCalledWith(
      collection,
      {
        cxUrl: url,
      },
      {},
    )
    expect(logger.error).toBeCalledWith('Failed to find Publisher')
    expect.assertions(3)
  })

  it('should return RTE.left in case of null', async () => {
    const { url } = defaultPublisher
    const { findOne } = dataLayer
    ;(findOne as jest.Mock).mockReturnValueOnce(RTE.right(null))

    const res = repo.getByUrl(url!)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(findOne).toBeCalledWith(
      collection,
      {
        cxUrl: url,
      },
      {},
    )
    expect.assertions(2)
  })

  it('should find Publisher using dataLayer and return right with result', async () => {
    const { url, ...publisherWithoutUrl } = defaultPublisher
    const mockPublisher = { url, ...publisherWithoutUrl }
    const { findOne } = dataLayer
    ;(findOne as jest.Mock).mockReturnValueOnce(RTE.right(mockPublisher))

    const res = repo.getByUrl(url!)
    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject(mockPublisher)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(findOne).toBeCalledWith(
      collection,
      {
        cxUrl: url,
      },
      {},
    )
    expect.assertions(2)
  })
})

describe('[PublisherRepository.addComicSeries]', () => {
  it('should return RTE.left in case of Error', async () => {
    const { _id } = defaultPublisher
    const comicSeriesId = new ObjectID()
    const { updateOne } = dataLayer
    ;(updateOne as jest.Mock).mockReturnValueOnce(
      RTE.left(new MongoError('Failed to find Publisher')),
    )

    const res = repo.addComicSeries(_id, comicSeriesId)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(updateOne).toBeCalledWith(
      collection,
      { _id },
      { $addToSet: { comicSeries: comicSeriesId } },
      {},
    )
    expect(logger.error).toBeCalledWith('Failed to find Publisher')
    expect.assertions(3)
  })

  it('should return RTE.left in case of null', async () => {
    const { _id } = defaultPublisher
    const comicSeriesId = new ObjectID()
    const { updateOne } = dataLayer
    ;(updateOne as jest.Mock).mockReturnValueOnce(RTE.right(null))

    const res = repo.addComicSeries(_id, comicSeriesId)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(updateOne).toBeCalledWith(
      collection,
      { _id },
      { $addToSet: { comicSeries: comicSeriesId } },
      {},
    )
    expect.assertions(2)
  })

  it('should add ComicBooks using dataLayer and return right with result', async () => {
    const { _id, ...publisherWithoutId } = defaultPublisher
    const mockPublisher = { _id, ...publisherWithoutId }
    const comicSeriesId = new ObjectID()
    const { updateOne } = dataLayer
    ;(updateOne as jest.Mock).mockReturnValueOnce(RTE.right(mockPublisher))

    const res = repo.addComicSeries(_id, comicSeriesId)
    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject(mockPublisher)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(updateOne).toBeCalledWith(
      collection,
      { _id },
      { $addToSet: { comicSeries: comicSeriesId } },
      {},
    )
    expect.assertions(2)
  })
})
