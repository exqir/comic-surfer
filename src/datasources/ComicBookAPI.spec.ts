import { MongoError } from 'mongodb'
import { ComicBookAPI, collection } from './ComicBookAPI'
import { createMockConfig, createMockReaderWithReturnValue, foldOptionPromise } from 'tests/_utils'
import { ComicBook } from 'types/schema'

const config = createMockConfig()

const ds = new ComicBookAPI()
ds.initialize(config)

describe('[ComicBookAPI.getById]', () => {
  it('should query dataLayer for ComicBook with id and return left in case of Error', async () => {
    const { findOne } = config.context.dataLayer
    findOne.mockReturnValueOnce(createMockReaderWithReturnValue({}, true))

    const res = ds.getById('')

    foldOptionPromise(res, err => expect(err).toBeInstanceOf(MongoError), d => { })
    expect(findOne).toBeCalledWith(collection, { _id: '' })
    // TODO: The mock function is actually being called which can be tested by
    // a mock implementation and via debugger. However, this information
    // (config.context.logger.error.mock) seems to be reseted before it can be checked here.
    // expect(config.context.logger.error.mock).toBeCalledWith('TestError')
  });

  it('should query dataLayer for ComicBook with id and return right with result', async () => {
    const mockComicBook = { _id: '1', title: 'Comic', url: '/path' }
    const { findOne } = config.context.dataLayer
    findOne.mockReturnValueOnce(createMockReaderWithReturnValue<ComicBook>(mockComicBook))

    const res = ds.getById('1')

    foldOptionPromise(res, err => { throw err }, d => expect(d).toMatchObject(mockComicBook))
    expect(findOne).toBeCalledWith(collection, { _id: '1' })
  });
});

describe('[ComicBookAPI.getByIds]', () => {
  it('should query dataLayer for ComicBooks with ids and return left in case of Error', async () => {
    const { findMany } = config.context.dataLayer
    findMany.mockReturnValueOnce(createMockReaderWithReturnValue({}, true))

    const res = ds.getByIds([''])

    foldOptionPromise(res, err => expect(err).toBeInstanceOf(MongoError), d => { })
    expect(findMany).toBeCalledWith(collection, { _id: { $in: [''] } })
    // TODO: The mock function is actually being called which can be tested by
    // a mock implementation and via debugger. However, this information
    // (config.context.logger.error.mock) seems to be reseted before it can be checked here.
    // expect(config.context.logger.error.mock).toBeCalledWith('TestError')
  });

  it('should query dataLayer for ComicBooks with ids and return right with result', async () => {
    const mockComicBook = [{ _id: '1', title: 'Comic', url: '/path' }]
    const { findMany } = config.context.dataLayer
    findMany.mockReturnValueOnce(createMockReaderWithReturnValue<ComicBook>(mockComicBook))

    const res = ds.getByIds(['1'])

    foldOptionPromise(res, err => { throw err }, d => expect(d).toMatchObject(mockComicBook))
    expect(findMany).toBeCalledWith(collection, { _id: { $in: ['1'] } })
  });
});