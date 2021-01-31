import { MongoError, ObjectID, Db } from 'mongodb'
import { pipe } from 'fp-ts/lib/pipeable'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'

import { dataLayer, logger } from '../__tests__/_mock'
import {
  PullListRepository,
  pullListCollection as collection,
} from './PullListRepository'
import { PullListDbObject } from 'types/server-schema'

const defaultPullList: PullListDbObject = {
  _id: new ObjectID(),
  owner: 'John',
  list: [],
}

// TODO: type of options is lost, dataLayer and logger are any here
const repo = new PullListRepository({ dataLayer, logger })

describe('[PullListRepository.createPullList]', () => {
  it('should return RTE.left in case of Error', async () => {
    const { _id: _, ...mockPullList } = defaultPullList
    const { insertOne } = dataLayer
    ;(insertOne as jest.Mock).mockReturnValueOnce(
      RTE.left(new MongoError('Failed to create PullList')),
    )

    const res = repo.createPullList(mockPullList.owner)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(insertOne).toBeCalledWith(collection, mockPullList, undefined)
    expect(logger.error).toBeCalledWith('Failed to create PullList')
    expect.assertions(3)
  })

  it('should insert PullList using dataLayer and return right with result', async () => {
    const { _id, ...mockPullList } = defaultPullList
    const mockPullListWithId = { ...mockPullList, _id }
    const { insertOne } = dataLayer
    ;(insertOne as jest.Mock).mockReturnValueOnce(RTE.right(mockPullListWithId))

    const res = repo.createPullList(mockPullList.owner)

    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject(mockPullListWithId)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(insertOne).toBeCalledWith(collection, mockPullList, undefined)
    expect.assertions(2)
  })
})

describe('[PullListRepository.getPullListByOwner]', () => {
  it('should return RTE.left in case of Error', async () => {
    const { _id: _, ...mockPullList } = defaultPullList
    const { findOne } = dataLayer
    ;(findOne as jest.Mock).mockReturnValueOnce(
      RTE.left(new MongoError('Failed to find PullList')),
    )

    const res = repo.getPullListByOwner(mockPullList.owner)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(findOne).toBeCalledWith(
      collection,
      { owner: mockPullList.owner },
      {},
    )
    expect(logger.error).toBeCalledWith('Failed to find PullList')
    expect.assertions(3)
  })

  it('should return RTE.left in case of null', async () => {
    const { _id: _, ...mockPullList } = defaultPullList
    const { findOne } = dataLayer
    ;(findOne as jest.Mock).mockReturnValueOnce(RTE.right(null))

    const res = repo.getPullListByOwner(mockPullList.owner)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(findOne).toBeCalledWith(
      collection,
      { owner: mockPullList.owner },
      {},
    )
    expect.assertions(2)
  })

  it('should find PullList using dataLayer and return right with result', async () => {
    const { _id, ...mockPullList } = defaultPullList
    const mockPullListWithId = { ...mockPullList, _id }
    const { findOne } = dataLayer
    ;(findOne as jest.Mock).mockReturnValueOnce(RTE.right(mockPullListWithId))

    const res = repo.getPullListByOwner(mockPullList.owner)

    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject(mockPullListWithId)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(findOne).toBeCalledWith(
      collection,
      { owner: mockPullList.owner },
      {},
    )
    expect.assertions(2)
  })
})

describe('[PullListRepository.getPullListByOwnerOrNull]', () => {
  it('should return RTE.left in case of Error', async () => {
    const { _id: _, ...mockPullList } = defaultPullList
    const { findOne } = dataLayer
    ;(findOne as jest.Mock).mockReturnValueOnce(
      RTE.left(new MongoError('Failed to find PullList')),
    )

    const res = repo.getPullListByOwnerOrNull(mockPullList.owner)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(findOne).toBeCalledWith(
      collection,
      { owner: mockPullList.owner },
      {},
    )
    expect(logger.error).toBeCalledWith('Failed to find PullList')
    expect.assertions(3)
  })

  it('should find PullList using dataLayer and return right with result', async () => {
    const { _id, ...mockPullList } = defaultPullList
    const mockPullListWithId = { ...mockPullList, _id }
    const { findOne } = dataLayer
    ;(findOne as jest.Mock).mockReturnValueOnce(RTE.right(mockPullListWithId))

    const res = repo.getPullListByOwnerOrNull(mockPullList.owner)

    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject(mockPullListWithId)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(findOne).toBeCalledWith(
      collection,
      { owner: mockPullList.owner },
      {},
    )
    expect.assertions(2)
  })

  it('should find PullList using dataLayer and return right with null', async () => {
    const { _id, ...mockPullList } = defaultPullList
    const { findOne } = dataLayer
    ;(findOne as jest.Mock).mockReturnValueOnce(RTE.right(null))

    const res = repo.getPullListByOwnerOrNull(mockPullList.owner)

    await pipe(
      res,
      RTE.map((d) => expect(d).toBe(null)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(findOne).toBeCalledWith(
      collection,
      { owner: mockPullList.owner },
      {},
    )
    expect.assertions(2)
  })
})

describe('[PullListRepository.addComicSeriesToPullList]', () => {
  it('should return RTE.left in case of Error', async () => {
    const { _id: _, ...mockPullList } = defaultPullList
    const { updateOne } = dataLayer
    const comicSeriesId = new ObjectID()
    ;(updateOne as jest.Mock).mockReturnValueOnce(
      RTE.left(new MongoError('Failed to find PullList')),
    )

    const res = repo.addComicSeriesToPullList(mockPullList.owner, comicSeriesId)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(updateOne).toBeCalledWith(
      collection,
      { owner: mockPullList.owner },
      { $addToSet: { list: comicSeriesId } },
      {},
    )
    expect(logger.error).toBeCalledWith('Failed to find PullList')
    expect.assertions(3)
  })

  it('should return RTE.left in case of null', async () => {
    const { _id: _, ...mockPullList } = defaultPullList
    const { updateOne } = dataLayer
    const comicSeriesId = new ObjectID()
    ;(updateOne as jest.Mock).mockReturnValueOnce(RTE.right(null))

    const res = repo.addComicSeriesToPullList(mockPullList.owner, comicSeriesId)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(updateOne).toBeCalledWith(
      collection,
      { owner: mockPullList.owner },
      { $addToSet: { list: comicSeriesId } },
      {},
    )
    expect.assertions(2)
  })

  it('should add ComicSeries to PullList using dataLayer and return right with result', async () => {
    const { _id, ...mockPullList } = defaultPullList
    const mockPullListWithId = { ...mockPullList, _id }
    const { updateOne } = dataLayer
    const comicSeriesId = new ObjectID()
    ;(updateOne as jest.Mock).mockReturnValueOnce(RTE.right(mockPullListWithId))

    const res = repo.addComicSeriesToPullList(mockPullList.owner, comicSeriesId)

    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject(mockPullListWithId)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(updateOne).toBeCalledWith(
      collection,
      { owner: mockPullList.owner },
      { $addToSet: { list: comicSeriesId } },
      {},
    )
    expect.assertions(2)
  })
})

describe('[PullListRepository.removeComicSeriesFromPullList]', () => {
  it('should return RTE.left in case of Error', async () => {
    const { _id: _, ...mockPullList } = defaultPullList
    const { updateOne } = dataLayer
    const comicSeriesId = new ObjectID()
    ;(updateOne as jest.Mock).mockReturnValueOnce(
      RTE.left(new MongoError('Failed to find PullList')),
    )

    const res = repo.removeComicSeriesFromPullList(
      mockPullList.owner,
      comicSeriesId,
    )
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(updateOne).toBeCalledWith(
      collection,
      { owner: mockPullList.owner },
      { $pull: { list: comicSeriesId } },
      {},
    )
    expect(logger.error).toBeCalledWith('Failed to find PullList')
    expect.assertions(3)
  })

  it('should return RTE.left in case of null', async () => {
    const { _id: _, ...mockPullList } = defaultPullList
    const { updateOne } = dataLayer
    const comicSeriesId = new ObjectID()
    ;(updateOne as jest.Mock).mockReturnValueOnce(RTE.right(null))

    const res = repo.removeComicSeriesFromPullList(
      mockPullList.owner,
      comicSeriesId,
    )
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(updateOne).toBeCalledWith(
      collection,
      { owner: mockPullList.owner },
      { $pull: { list: comicSeriesId } },
      {},
    )
    expect.assertions(2)
  })

  it('should add ComicSeries to PullList using dataLayer and return right with result', async () => {
    const { _id, ...mockPullList } = defaultPullList
    const mockPullListWithId = { ...mockPullList, _id }
    const { updateOne } = dataLayer
    const comicSeriesId = new ObjectID()
    ;(updateOne as jest.Mock).mockReturnValueOnce(RTE.right(mockPullListWithId))

    const res = repo.removeComicSeriesFromPullList(
      mockPullList.owner,
      comicSeriesId,
    )

    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject(mockPullListWithId)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(updateOne).toBeCalledWith(
      collection,
      { owner: mockPullList.owner },
      { $pull: { list: comicSeriesId } },
      {},
    )
    expect.assertions(2)
  })
})
