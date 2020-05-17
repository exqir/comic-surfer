const { MongoClient } = require('mongodb')

// Replace the following with your Atlas connection string

const url = process.env.MONGO_URL

const client = new MongoClient(url)

// The database to use
const dbName = 'riddler'
const collections = [
  'comicBook',
  'comicSeries',
  'creator',
  'publisher',
  'pullList',
]

async function run() {
  try {
    await client.connect()
    console.log('Connected to server')
    const db = client.db(dbName)

    await Promise.all(collections.map(col => db.createCollection(col)))
  } catch (err) {
    console.log(err.stack)
  } finally {
    await client.close()
  }
}

run().catch(console.dir)
