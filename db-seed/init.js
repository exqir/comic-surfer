db.publisher.insertOne({
  name: 'Image',
  iconUrl: '/image/icon.jpg',
  url: 'https://www.image.com',
  cxUrl: '/image',
  comicSeries: [],
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
  creators: [{ name: 'Jeff Lemire' }],
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
  { $set: { comicSeries: comicSeries._id, } }
)
// prettier-ignore
db.publisher.updateOne(
  { _id: publisher._id },
  { $push: { comicSeries: comicSeries._id } }
)
// Sealed { issuer: 'some-user-id' } for with dev secret
// Fe26.2**bacf7acc45a3dae5b11b56085d4902f8f0e1b284f22632873393af6a72a5eb75*TtCd6ZvEXJMvsFXumkBxOw*xSPWBOpQLhUCwOEoctj_MA1u-pAQuOVhG-0uZgstrao**369bf4bbc9ccbe511010b1a1a37942216b4f85e7e5c6f88c0276f2e0da46f2ba*cCy4AVzkjFWN0dwYRGfochpFii00xv7SmRfoLM1MuoI
db.pullList.insertOne({ owner: 'some-user-id', list: [comicSeries._id] })
