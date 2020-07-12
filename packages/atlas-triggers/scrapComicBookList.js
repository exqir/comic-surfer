exports = function scrapComicBookList(changeEvent) {
  const { _id, singleIssuesUrl, collectionsUrl } = changeEvent.fullDocument
  const singleIssuesMutation = `mutation scrapSingleIssuesList($comicSeriesId: ID!, $comicBookListUrl: String!) {
      scrapSingleIssuesList(comicSeriesId: $comicSeriesId, comicBookListUrl: $comicBookListUrl) {
        _id
      }
    }
    `
  const collectionsMutation = `mutation scrapCollectionsList($comicSeriesId: ID!, $comicBookListUrl: String!) {
      scrapCollectionsList(comicSeriesId: $comicSeriesId, comicBookListUrl: $comicBookListUrl) {
          _id
      }
    }
    `

  context.http.post({
    url: 'https://exqir2.uber.space/comic-surfer/api',
    body: {
      // TODO: Can this be different then the name in the query?
      operationName: 'scrapSingleIssuesList',
      query: singleIssuesMutation,
      variables: { comicSeriesId: _id, comicBookListUrl: singleIssuesUrl },
    },
    encodeBodyAsJSON: true,
  })

  context.http.post({
    url: 'https://exqir2.uber.space/comic-surfer/api',
    body: {
      operationName: 'scrapCollectionsList',
      query: collectionsMutation,
      variables: { comicSeriesId: _id, comicBookListUrl: collectionsUrl },
    },
    encodeBodyAsJSON: true,
  })
}
