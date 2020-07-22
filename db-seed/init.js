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
  comicSeries: comicSeries._id,
  type: 'SINGLEISSUE',
  lastModified: new Date('2020-01-05'),
})
db.comicBook.insertOne({
  title: 'Descender #2',
  issueNo: '2',
  releaseDate: new Date('2020-08-15'),
  creators: [{ name: 'Jeff Lemire' }],
  coverImgUrl: '/descender/2/cover.jpg',
  url: '/descender/2',
  publisher: publisher._id,
  comicSeries: comicSeries._id,
  type: 'SINGLEISSUE',
  lastModified: new Date('2020-07-07'),
})
const comicBook_1 = db.comicBook.findOne({ title: 'Descender #1' })
const comicBook_2 = db.comicBook.findOne({ title: 'Descender #2' })

// prettier-ignore
db.comicSeries.updateOne(
  { _id: comicSeries._id },
  { $addToSet: { singleIssues: { $each: [comicBook_1._id, comicBook_2._id] } } }
)
// prettier-ignore
db.publisher.updateOne(
  { _id: publisher._id },
  { $push: { comicSeries: comicSeries._id } }
)
// Sealed { issuer: 'some-user-id' } for with dev secret
// Fe26.2**bacf7acc45a3dae5b11b56085d4902f8f0e1b284f22632873393af6a72a5eb75*TtCd6ZvEXJMvsFXumkBxOw*xSPWBOpQLhUCwOEoctj_MA1u-pAQuOVhG-0uZgstrao**369bf4bbc9ccbe511010b1a1a37942216b4f85e7e5c6f88c0276f2e0da46f2ba*cCy4AVzkjFWN0dwYRGfochpFii00xv7SmRfoLM1MuoI
db.pullList.insertOne({ owner: 'some-user-id', list: [comicSeries._id] })
