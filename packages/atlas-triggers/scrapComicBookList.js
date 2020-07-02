exports = function scrapComicBookList(changeEvent) {
  const { _id, singleIssuesUrl, collectionsUrl } = changeEvent.fullDocument
  const query = `mutation scrapComicBookList($comicSeriesId: ID!, $comicBookListUrl: String!) {
        scrapComicBookList(comicSeriesId: $comicSeriesId, comicBookListUrl: $comicBookListUrl) {
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
      variables: { comicSeriesId: _id, comicBookListUrl: singleIssuesUrl },
    },
    encodeBodyAsJSON: true,
  })

  context.http.post({
    url: 'https://exqir2.uber.space/comic-surfer/api',
    body: {
      operationName: 'scrapComicBookListCollectionsUrl',
      query,
      variables: { comicSeriesId: _id, comicBookListUrl: collectionsUrl },
    },
    encodeBodyAsJSON: true,
  })
}
