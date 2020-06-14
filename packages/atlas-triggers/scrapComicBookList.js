exports = function scrapComicBookList(changeEvent) {
  const { _id, singleIssuesUrl, collectionsUrl } = changeEvent.fullDocument
  const query = `mutation scrapComicBookList($comicBookId: ID!, $comicBookUrl: String!) {
        scrapComicBookList(comicSeriesId: $comicBookId, comicBookListUrl: $comicBookUrl) {
            _id
        }
    }
    `

  context.http.post({
    url: 'https://exqir2.uber.space/comic-surfer/api',
    body: {
      // TODO: Can this be different then the name in the query?
      operationName: 'scrapComicBookListSingleIssuesUrl',
      query,
      variables: { comicBookId: _id, comicBookUrl: singleIssuesUrl },
    },
    encodeBodyAsJSON: true,
  })

  context.http.post({
    url: 'https://exqir2.uber.space/comic-surfer/api',
    body: {
      operationName: 'scrapComicBookListCollectionsUrl',
      query,
      variables: { comicBookId: _id, comicBookUrl: collectionsUrl },
    },
    encodeBodyAsJSON: true,
  })
}
