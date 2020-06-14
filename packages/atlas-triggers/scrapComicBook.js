exports = function scrapComicBookList(changeEvent) {
  const { url } = changeEvent.fullDocument
  const query = ` mutation scrapComicBook($comicBookUrl: String!) {
      scrapComicBook(comicBookUrl: $comicBookUrl) {
        _id
      }
    }
  `

  context.http.post({
    url: 'https://exqir2.uber.space/comic-surfer/api',
    body: {
      operationName: 'scrapComicBook',
      query,
      variables: { comicBookUrl: url },
    },
    encodeBodyAsJSON: true,
  })
}