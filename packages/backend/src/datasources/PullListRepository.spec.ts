import { MongoError, ObjectID } from 'mongodb'
import {
  PullListRepository,
  pullListCollection as collection,
} from './PullListRepository'
import { PullListDbObject } from '../types/graphql-server-schema'
import { DataLayer } from '../types/types'
import { pipe } from 'fp-ts/lib/pipeable'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as IO from 'fp-ts/lib/IO'

const defaultPullList: PullListDbObject = {
  _id: new ObjectID(),
  owner: 'John',
  list: [],
}

const dataLayer = ({
  findOne: jest.fn(),
  findMany: jest.fn(),
  insertOne: jest.fn(),
  insertMany: jest.fn(),
  updateOne: jest.fn(),
  updateMany: jest.fn(),
  deleteOne: jest.fn(),
  deleteMany: jest.fn(),
} as unknown) as DataLayer

const logger = {
  log: IO.of(jest.fn()),
  error: IO.of(jest.fn()),
  warn: IO.of(jest.fn()),
  info: IO.of(jest.fn()),
}
const repo = new PullListRepository({ dataLayer, logger })

describe('[PullListRepository.createPullList]', () => {
  it('should insert PullList using dataLayer and return left in case of Error', async () => {
    const { _id: _, ...mockPullList } = defaultPullList
    const { insertOne } = dataLayer
    // insertOne.mockReturnValueOnce(
    //   RTE.left(new MongoError('Failed to create PullList')),
    // )

    const res = repo.createPullList(mockPullList.owner)

    expect.assertions(2)
    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      (rte) => RTE.run(rte, {}),
    )
    expect(insertOne).toBeCalledWith(collection, mockPullList)
    // TODO: The mock function is actually being called which can be tested by
    // a mock implementation and via debugger. However, this information
    // (config.context.logger.error.mock) seems to be reseted before it can be checked here.
    // expect(config.context.logger.error.mock).toBeCalledWith('TestError')
  })

  // it('should insert PullList using dataLayer and return right with result', async () => {
  //   const mockPullList = { ...defaultPullList }
  //   delete mockPullList._id
  //   const { insertOne } = config.context.dataLayer
  //   ;(insertOne as jest.Mock).mockReturnValueOnce(
  //     createMockReaderWithReturnValue<PullListDbObject>({
  //       ...mockPullList,
  //       _id: new ObjectID(),
  //     }),
  //   )

  //   const res = ds.insert(mockPullList)

  //   expect.assertions(2)
  //   await pipe(
  //     res,
  //     RTE.map((d) => expect(d).toMatchObject(mockPullList)),
  //     runRTEwithMockDb,
  //   )
  //   expect(insertOne).toBeCalledWith(collection, mockPullList)
  // })
})

// describe('[PullListAPI.addComicSeries]', () => {
//   it('should add ComicSeries to PullList using dataLayer and return left in case of Error', async () => {
//     const mockPullList = { ...defaultPullList }
//     const mockComicSeriesId = new ObjectID()
//     const { updateOne } = config.context.dataLayer
//     ;(updateOne as jest.Mock).mockReturnValueOnce(
//       createMockReaderWithReturnValue({}, true),
//     )

//     const res = ds.addComicSeries(mockPullList.owner, mockComicSeriesId)

//     expect.assertions(2)
//     await pipe(
//       res,
//       RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
//       runRTEwithMockDb,
//     )
//     expect(updateOne).toBeCalledWith(
//       collection,
//       { owner: mockPullList.owner },
//       { $addToSet: { list: mockComicSeriesId } },
//     )
//     // TODO: The mock function is actually being called which can be tested by
//     // a mock implementation and via debugger. However, this information
//     // (config.context.logger.error.mock) seems to be reseted before it can be checked here.
//     // expect(config.context.logger.error.mock).toBeCalledWith('TestError')
//   })

//   it('should add ComicSeries to PullList using dataLayer and return right with result', async () => {
//     const mockComicSeries = {
//       _id: new ObjectID(),
//       title: 'Comic',
//       url: '/path',
//     }
//     const mockPullList = {
//       ...defaultPullList,
//       list: [mockComicSeries._id],
//     }
//     const { updateOne } = config.context.dataLayer
//     ;(updateOne as jest.Mock).mockReturnValueOnce(
//       createMockReaderWithReturnValue<PullListDbObject>(mockPullList),
//     )

//     const res = ds.addComicSeries(mockPullList.owner, mockComicSeries._id)

//     expect.assertions(2)
//     await pipe(
//       res,
//       RTE.map((d) => expect(d).toMatchObject(mockPullList)),
//       runRTEwithMockDb,
//     )
//     expect(updateOne).toBeCalledWith(
//       collection,
//       { owner: mockPullList.owner },
//       { $addToSet: { list: mockComicSeries._id } },
//     )
//   })
// })

// describe('[PullListAPI.removeComicSeries]', () => {
//   it('should remove ComicSeries from PullList using dataLayer and return left in case of Error', async () => {
//     const mockPullList = { ...defaultPullList }
//     const mockComicSeriesId = new ObjectID()
//     const { updateOne } = config.context.dataLayer
//     ;(updateOne as jest.Mock).mockReturnValueOnce(
//       createMockReaderWithReturnValue({}, true),
//     )

//     const res = ds.removeComicSeries(mockPullList.owner, mockComicSeriesId)

//     expect.assertions(2)
//     await pipe(
//       res,
//       RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
//       runRTEwithMockDb,
//     )
//     expect(updateOne).toBeCalledWith(
//       collection,
//       { owner: mockPullList.owner },
//       { $pull: { list: mockComicSeriesId } },
//     )
//     // TODO: The mock function is actually being called which can be tested by
//     // a mock implementation and via debugger. However, this information
//     // (config.context.logger.error.mock) seems to be reseted before it can be checked here.
//     // expect(config.context.logger.error.mock).toBeCalledWith('TestError')
//   })

//   it('should remove ComicSeries from PullList using dataLayer and return right with result', async () => {
//     const mockComicSeries = {
//       _id: new ObjectID(),
//       title: 'Comic',
//       url: '/path',
//     }
//     const mockPullList = {
//       ...defaultPullList,
//       list: [],
//     }
//     const { updateOne } = config.context.dataLayer
//     ;(updateOne as jest.Mock).mockReturnValueOnce(
//       createMockReaderWithReturnValue<PullListDbObject>(mockPullList),
//     )

//     const res = ds.removeComicSeries(mockPullList.owner, mockComicSeries._id)

//     expect.assertions(2)
//     await pipe(
//       res,
//       RTE.map((d) => expect(d).toMatchObject(mockPullList)),
//       runRTEwithMockDb,
//     )
//     expect(updateOne).toBeCalledWith(
//       collection,
//       { owner: mockPullList.owner },
//       { $pull: { list: mockComicSeries._id } },
//     )
//   })
// })
