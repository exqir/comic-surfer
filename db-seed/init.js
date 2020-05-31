db.comicSeries.insertOne({
  title: 'Descender',
  url: '/descender',
  collectionsUrl: '/descender/collections',
  issuesUrl: '/descender/issues',
  collections: [],
  issues: [],
})
const comicSeries = db.comicSeries.findOne({ title: 'Descender' })

db.comicBook.insertOne({
  title: 'Descender #1',
  issue: '1',
  releaseDate: 1473199200000,
  creators: [],
  series: [],
  coverUrl: '/descender/1/cover.jpg',
  url: '/descender/1',
})
const comicBook = db.comicBook.findOne({ title: 'Descender #1' })
// prettier-ignore
db.comicSeries.updateOne(
  { _id: comicSeries._id },
  { $push: { issues: comicBook._id } }
)
// prettier-ignore
db.comicBook.updateOne(
  { _id: comicBook._id },
  { $set: { series: comicSeries._id } }
)
db.pullList.insertOne({ owner: 'John Rambo', list: [comicSeries._id] })
