import { pipe } from 'fp-ts/lib/pipeable'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import { MongoError, ObjectID, Db } from 'mongodb'

import { dataLayer, logger } from '../../__tests__/_mock'
import { MongoDataSource } from '../MongoDataSource'

const collection = 'collection'

const ds = new MongoDataSource<{ _id: ObjectID; prop: string }>({
  collection,
  dataLayer,
  logger,
})

describe('[MongoDataSource.insertOne]', () => {
  it('should return RTE.left in case of Error', async () => {
    const document = { prop: 'value' }
    const { insertOne } = dataLayer
    ;(insertOne as jest.Mock).mockReturnValueOnce(
      RTE.left(new MongoError('Failure')),
    )

    const res = ds.insertOne(document)

    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(insertOne).toBeCalledWith(collection, document, undefined)
    expect.assertions(2)
  })

  it('should call logger.error in case of Error', async () => {
    const document = { prop: 'value' }
    const { insertOne } = dataLayer
    ;(insertOne as jest.Mock).mockReturnValueOnce(
      RTE.left(new MongoError('Failure')),
    )

    const res = ds.insertOne(document)

    await pipe(res, (rte) => RTE.run(rte, {} as Db))
    expect(logger.error).toBeCalledWith('Failure')
    expect.assertions(1)
  })

  it('should insert document using dataLayer and return right with result', async () => {
    const document = { prop: 'value' }
    const documentWithId = { _id: new ObjectID(), ...document }
    const { insertOne } = dataLayer
    ;(insertOne as jest.Mock).mockReturnValueOnce(RTE.right(documentWithId))

    const res = ds.insertOne(document)

    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject(documentWithId)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(insertOne).toBeCalledWith(collection, document, undefined)
    expect.assertions(2)
  })

  it('should forward options to the dataLayer', async () => {
    const document = { prop: 'value' }
    const options = { forceServerObjectId: true }
    const { insertOne } = dataLayer
    ;(insertOne as jest.Mock).mockReturnValueOnce(RTE.right({}))

    const res = ds.insertOne(document, options)

    await pipe(res, (rte) => RTE.run(rte, {} as Db))
    expect(insertOne).toBeCalledWith(collection, document, options)
    expect.assertions(1)
  })
})

describe('[MongoDataSource.insertMany]', () => {
  it('should return RTE.left in case of Error', async () => {
    const documents = [{ prop: 'value' }]
    const { insertMany } = dataLayer
    ;(insertMany as jest.Mock).mockReturnValueOnce(
      RTE.left(new MongoError('Failure')),
    )

    const res = ds.insertMany(documents)

    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(insertMany).toBeCalledWith(collection, documents, undefined)
    expect.assertions(2)
  })

  it('should call logger.error in case of Error', async () => {
    const documents = [{ prop: 'value' }]
    const { insertMany } = dataLayer
    ;(insertMany as jest.Mock).mockReturnValueOnce(
      RTE.left(new MongoError('Failure')),
    )

    const res = ds.insertMany(documents)

    await pipe(res, (rte) => RTE.run(rte, {} as Db))
    expect(logger.error).toBeCalledWith('Failure')
    expect.assertions(1)
  })

  it('should insert documents using dataLayer and return right with result', async () => {
    const documents = [{ prop: 'value' }]
    const documentsWithId = [{ _id: new ObjectID(), ...documents[0] }]
    const { insertMany } = dataLayer
    ;(insertMany as jest.Mock).mockReturnValueOnce(RTE.right(documentsWithId))

    const res = ds.insertMany(documents)

    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject(documentsWithId)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(insertMany).toBeCalledWith(collection, documents, undefined)
    expect.assertions(2)
  })

  it('should forward options to the dataLayer', async () => {
    const options = { forceServerObjectId: true }
    const { insertMany } = dataLayer
    ;(insertMany as jest.Mock).mockReturnValueOnce(RTE.right({}))

    const res = ds.insertMany([{ prop: '' }], options)

    await pipe(res, (rte) => RTE.run(rte, {} as Db))
    expect(insertMany).toBeCalledWith(collection, [{ prop: '' }], options)
    expect.assertions(1)
  })
})

describe('[MongoDataSource.findOne]', () => {
  it('should return RTE.left in case of Error', async () => {
    const query = { prop: 'value' }
    const { findOne } = dataLayer
    ;(findOne as jest.Mock).mockReturnValueOnce(
      RTE.left(new MongoError('Failure')),
    )

    const res = ds.findOne(query)

    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(findOne).toBeCalledWith(collection, query, {})
    expect.assertions(2)
  })

  it('should call logger.error in case of Error', async () => {
    const query = { prop: 'value' }
    const { findOne } = dataLayer
    ;(findOne as jest.Mock).mockReturnValueOnce(
      RTE.left(new MongoError('Failure')),
    )

    const res = ds.findOne(query)

    await pipe(res, (rte) => RTE.run(rte, {} as Db))
    expect(logger.error).toBeCalledWith('Failure')
    expect.assertions(1)
  })

  it('should retrieve document matching the query using dataLayer and return right with result', async () => {
    const query = { prop: 'value' }
    const document = { _id: new ObjectID(), ...query }
    const { findOne } = dataLayer
    ;(findOne as jest.Mock).mockReturnValueOnce(RTE.right(document))

    const res = ds.findOne(query)

    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject(document)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(findOne).toBeCalledWith(collection, query, {})
    expect.assertions(2)
  })

  it('should forward options to the dataLayer', async () => {
    const options = { max: 5 }
    const { findOne } = dataLayer
    ;(findOne as jest.Mock).mockReturnValueOnce(RTE.right({}))

    const res = ds.findOne({}, options)

    await pipe(res, (rte) => RTE.run(rte, {} as Db))
    expect(findOne).toBeCalledWith(collection, {}, options)
    expect.assertions(1)
  })

  it('should return null as RTE.left when `nonNullable` is `true`', async () => {
    const query = { prop: 'value' }
    const options = { nonNullable: true }
    const { findOne } = dataLayer
    ;(findOne as jest.Mock).mockReturnValueOnce(RTE.right(null))

    const res = ds.findOne(query, options)

    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(findOne).toBeCalledWith(collection, query, {})
    expect.assertions(2)
  })

  it('should return null as RTE.right when `nonNullable` is falsy', async () => {
    const query = { prop: 'value' }
    const { findOne } = dataLayer
    ;(findOne as jest.Mock).mockReturnValueOnce(RTE.right(null))

    const res = ds.findOne(query)

    await pipe(
      res,
      RTE.map((d) => expect(d).toBeNull()),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(findOne).toBeCalledWith(collection, query, {})
    expect.assertions(2)
  })
})

describe('[MongoDataSource.findMany]', () => {
  it('should return RTE.left in case of Error', async () => {
    const query = { prop: 'value' }
    const { findMany } = dataLayer
    ;(findMany as jest.Mock).mockReturnValueOnce(
      RTE.left(new MongoError('Failure')),
    )

    const res = ds.findMany(query)

    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(findMany).toBeCalledWith(collection, query, undefined)
    expect.assertions(2)
  })

  it('should call logger.error in case of Error', async () => {
    const query = { prop: 'value' }
    const { findMany } = dataLayer
    ;(findMany as jest.Mock).mockReturnValueOnce(
      RTE.left(new MongoError('Failure')),
    )

    const res = ds.findMany(query)

    await pipe(res, (rte) => RTE.run(rte, {} as Db))
    expect(logger.error).toBeCalledWith('Failure')
    expect.assertions(1)
  })

  it('should retrieve documents matching the query using dataLayer and return right with result', async () => {
    const query = { prop: 'value' }
    const documents = [{ _id: new ObjectID(), ...query }]
    const { findMany } = dataLayer
    ;(findMany as jest.Mock).mockReturnValueOnce(RTE.right(documents))

    const res = ds.findMany(query)

    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject(documents)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(findMany).toBeCalledWith(collection, query, undefined)
    expect.assertions(2)
  })

  it('should forward options to the dataLayer', async () => {
    const options = { max: 5 }
    const { findMany } = dataLayer
    ;(findMany as jest.Mock).mockReturnValueOnce(RTE.right([{}]))

    const res = ds.findMany({}, options)

    await pipe(res, (rte) => RTE.run(rte, {} as Db))
    expect(findMany).toBeCalledWith(collection, {}, options)
    expect.assertions(1)
  })
})

describe('[MongoDataSource.updateOne]', () => {
  it('should return RTE.left in case of Error', async () => {
    const query = { prop: 'value' }
    const update = { prop: 'new' }
    const { updateOne } = dataLayer
    ;(updateOne as jest.Mock).mockReturnValueOnce(
      RTE.left(new MongoError('Failure')),
    )

    const res = ds.updateOne(query, update)

    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(updateOne).toBeCalledWith(collection, query, update, {})
    expect.assertions(2)
  })

  it('should call logger.error in case of Error', async () => {
    const query = { prop: 'value' }
    const update = { prop: 'new' }
    const { updateOne } = dataLayer
    ;(updateOne as jest.Mock).mockReturnValueOnce(
      RTE.left(new MongoError('Failure')),
    )

    const res = ds.updateOne(query, update)

    await pipe(res, (rte) => RTE.run(rte, {} as Db))
    expect(logger.error).toBeCalledWith('Failure')
    expect.assertions(1)
  })

  it('should retrieve document matching the query using dataLayer and return right with result', async () => {
    const query = { prop: 'value' }
    const update = { prop: 'new' }
    const document = { _id: new ObjectID(), ...update }
    const { updateOne } = dataLayer
    ;(updateOne as jest.Mock).mockReturnValueOnce(RTE.right(document))

    const res = ds.updateOne(query, update)

    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject(document)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(updateOne).toBeCalledWith(collection, query, update, {})
    expect.assertions(2)
  })

  it('should forward options to the dataLayer', async () => {
    const options = { upsert: true }
    const { updateOne } = dataLayer
    ;(updateOne as jest.Mock).mockReturnValueOnce(RTE.right({}))

    const res = ds.updateOne({}, {}, options)

    await pipe(res, (rte) => RTE.run(rte, {} as Db))
    expect(updateOne).toBeCalledWith(collection, {}, {}, options)
    expect.assertions(1)
  })

  it('should return null as RTE.left when `nonNullable` is `true`', async () => {
    const query = { prop: 'value' }
    const options = { nonNullable: true }
    const { updateOne } = dataLayer
    ;(updateOne as jest.Mock).mockReturnValueOnce(RTE.right(null))

    const res = ds.updateOne(query, {}, options)

    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(updateOne).toBeCalledWith(collection, query, {}, {})
    expect.assertions(2)
  })

  it('should return null as RTE.right when `nonNullable` is falsy', async () => {
    const query = { prop: 'value' }
    const { updateOne } = dataLayer
    ;(updateOne as jest.Mock).mockReturnValueOnce(RTE.right(null))

    const res = ds.updateOne(query, {})

    await pipe(
      res,
      RTE.map((d) => expect(d).toBeNull()),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(updateOne).toBeCalledWith(collection, query, {}, {})
    expect.assertions(2)
  })
})

describe('[MongoDataSource.updateMany]', () => {
  it('should return RTE.left in case of Error', async () => {
    const query = { prop: 'value' }
    const update = { prop: 'new' }
    const { updateMany } = dataLayer
    ;(updateMany as jest.Mock).mockReturnValueOnce(
      RTE.left(new MongoError('Failure')),
    )

    const res = ds.updateMany(query, update)

    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(updateMany).toBeCalledWith(collection, query, update, undefined)
    expect.assertions(2)
  })

  it('should call logger.error in case of Error', async () => {
    const query = { prop: 'value' }
    const update = { prop: 'new' }
    const { updateMany } = dataLayer
    ;(updateMany as jest.Mock).mockReturnValueOnce(
      RTE.left(new MongoError('Failure')),
    )

    const res = ds.updateMany(query, update)

    await pipe(res, (rte) => RTE.run(rte, {} as Db))
    expect(logger.error).toBeCalledWith('Failure')
    expect.assertions(1)
  })

  it('should retrieve documents matching the query using dataLayer and return right with result', async () => {
    const query = { prop: 'value' }
    const update = { prop: 'new' }
    const documents = [{ _id: new ObjectID(), ...update }]
    const { updateMany } = dataLayer
    ;(updateMany as jest.Mock).mockReturnValueOnce(RTE.right(documents))

    const res = ds.updateMany(query, update)

    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject(documents)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(updateMany).toBeCalledWith(collection, query, update, undefined)
    expect.assertions(2)
  })

  it('should forward options to the dataLayer', async () => {
    const options = { upsert: true }
    const { updateMany } = dataLayer
    ;(updateMany as jest.Mock).mockReturnValueOnce(RTE.right([{}]))

    const res = ds.updateMany({}, {}, options)

    await pipe(res, (rte) => RTE.run(rte, {} as Db))
    expect(updateMany).toBeCalledWith(collection, {}, {}, options)
    expect.assertions(1)
  })
})

describe('[MongoDataSource.deleteOne]', () => {
  it('should return RTE.left in case of Error', async () => {
    const query = { prop: 'value' }
    const { deleteOne } = dataLayer
    ;(deleteOne as jest.Mock).mockReturnValueOnce(
      RTE.left(new MongoError('Failure')),
    )

    const res = ds.deleteOne(query)

    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(deleteOne).toBeCalledWith(collection, query, {})
    expect.assertions(2)
  })

  it('should call logger.error in case of Error', async () => {
    const query = { prop: 'value' }
    const { deleteOne } = dataLayer
    ;(deleteOne as jest.Mock).mockReturnValueOnce(
      RTE.left(new MongoError('Failure')),
    )

    const res = ds.deleteOne(query)

    await pipe(res, (rte) => RTE.run(rte, {} as Db))
    expect(logger.error).toBeCalledWith('Failure')
    expect.assertions(1)
  })

  it('should retrieve document matching the query using dataLayer and return right with result', async () => {
    const query = { prop: 'value' }
    const document = { _id: new ObjectID(), ...query }
    const { deleteOne } = dataLayer
    ;(deleteOne as jest.Mock).mockReturnValueOnce(RTE.right(document))

    const res = ds.deleteOne(query)

    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject(document)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(deleteOne).toBeCalledWith(collection, query, {})
    expect.assertions(2)
  })

  it.skip('should forward options to the dataLayer', async () => {
    const options = { session: {} }
    const { deleteOne } = dataLayer
    ;(deleteOne as jest.Mock).mockReturnValueOnce(RTE.right({}))

    // @ts-ignore
    const res = ds.deleteOne({}, {}, options)

    await pipe(res, (rte) => RTE.run(rte, {} as Db))
    expect(deleteOne).toBeCalledWith(collection, {}, options)
    expect.assertions(1)
  })

  it('should return null as RTE.left when `nonNullable` is `true`', async () => {
    const query = { prop: 'value' }
    const options = { nonNullable: true }
    const { deleteOne } = dataLayer
    ;(deleteOne as jest.Mock).mockReturnValueOnce(RTE.right(null))

    const res = ds.deleteOne(query, options)

    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(deleteOne).toBeCalledWith(collection, query, {})
    expect.assertions(2)
  })

  it('should return null as RTE.right when `nonNullable` is falsy', async () => {
    const query = { prop: 'value' }
    const { deleteOne } = dataLayer
    ;(deleteOne as jest.Mock).mockReturnValueOnce(RTE.right(null))

    const res = ds.deleteOne(query, {})

    await pipe(
      res,
      RTE.map((d) => expect(d).toBeNull()),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(deleteOne).toBeCalledWith(collection, query, {})
    expect.assertions(2)
  })
})

describe('[MongoDataSource.deleteMany]', () => {
  it('should return RTE.left in case of Error', async () => {
    const query = { prop: 'value' }
    const { deleteMany } = dataLayer
    ;(deleteMany as jest.Mock).mockReturnValueOnce(
      RTE.left(new MongoError('Failure')),
    )

    const res = ds.deleteMany(query)

    await pipe(
      res,
      RTE.mapLeft((err) => expect(err).toBeInstanceOf(MongoError)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(deleteMany).toBeCalledWith(collection, query, undefined)
    expect.assertions(2)
  })

  it('should call logger.error in case of Error', async () => {
    const query = { prop: 'value' }
    const { deleteMany } = dataLayer
    ;(deleteMany as jest.Mock).mockReturnValueOnce(
      RTE.left(new MongoError('Failure')),
    )

    const res = ds.deleteMany(query)

    await pipe(res, (rte) => RTE.run(rte, {} as Db))
    expect(logger.error).toBeCalledWith('Failure')
    expect.assertions(1)
  })

  it('should retrieve documents matching the query using dataLayer and return right with result', async () => {
    const query = { prop: 'value' }
    const documents = [{ _id: new ObjectID(), ...query }]
    const { deleteMany } = dataLayer
    ;(deleteMany as jest.Mock).mockReturnValueOnce(RTE.right(documents))

    const res = ds.deleteMany(query)

    await pipe(
      res,
      RTE.map((d) => expect(d).toMatchObject(documents)),
      (rte) => RTE.run(rte, {} as Db),
    )
    expect(deleteMany).toBeCalledWith(collection, query, undefined)
    expect.assertions(2)
  })

  it.skip('should forward options to the dataLayer', async () => {
    const options = { session: {} }
    const { deleteMany } = dataLayer
    ;(deleteMany as jest.Mock).mockReturnValueOnce(RTE.right({}))

    // @ts-ignore
    const res = ds.deleteMany({}, {}, options)

    await pipe(res, (rte) => RTE.run(rte, {} as Db))
    expect(deleteMany).toBeCalledWith(collection, {}, options)
    expect.assertions(1)
  })
})
