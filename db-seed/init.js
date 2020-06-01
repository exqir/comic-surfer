db.creator.insertOne({
  firstname: 'Jeff',
  lastname: 'Lemire',
  series: [],
})
const creator = db.creator.findOne({ firstname: 'Jeff' })

db.publisher.insertOne({
  name: 'Image',
  iconUrl: '/image/icon.jpg',
  url: '/image',
  basePath: '/',
  seriesPath: '/',
  searchPath: '/',
  searchPathSeries: '/',
  series: [],
})
const publisher = db.publisher.findOne({ name: 'Image' })

db.comicSeries.insertOne({
  title: 'Descender',
  url: '/descender',
  collectionsUrl: '/descender/collections',
  singleIssuesUrl: '/descender/issues',
  collections: [],
  singleIssues: [],
  publisher: publisher._id,
})
const comicSeries = db.comicSeries.findOne({ title: 'Descender' })

db.comicBook.insertOne({
  title: 'Descender #1',
  issueNo: '1',
  releaseDate: new Date('2020-01-15'),
  creators: [],
  coverImgUrl: '/descender/1/cover.jpg',
  url: '/descender/1',
  publisher: publisher._id,
})
const comicBook = db.comicBook.findOne({ title: 'Descender #1' })

// prettier-ignore
db.comicSeries.updateOne(
  { _id: comicSeries._id },
  { $push: { singleIssues: comicBook._id } }
)
// prettier-ignore
db.comicBook.updateOne(
  { _id: comicBook._id },
  { $set: { comicSeries: comicSeries._id, }, $push: { creators: creator._id } }
)
// prettier-ignore
db.publisher.updateOne(
  { _id: publisher._id },
  { $push: { series: comicSeries._id } }
)
db.pullList.insertOne({ owner: 'John Rambo', list: [comicSeries._id] })
