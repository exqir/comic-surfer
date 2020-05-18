db.comicSeries.insertOne({
  title: 'Descender',
  url: '/descender',
  collectionsUrl: '/descender/collections',
  issuesUrl: '/descender/issues',
  collections: [],
  issues: [],
})
const decender = db.comicSeries.findOne({ title: 'Descender' })
db.pullList.insertOne({ owner: 'John Rambo', list: [decender._id] })
