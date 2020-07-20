exports = function onQueueInsert(changeEvent) {
  const { _id, type, data } = changeEvent.fullDocument
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
  const comicBookMutation = `mutation scrapComicBook($comicBookUrl: String!) {
      scrapComicBook(comicBookUrl: $comicBookUrl) {
          _id
      }
    }
    `

  const url = 'https://exqir2.uber.space/comic-surfer/api'

  switch (type) {
    case 'SCRAP_SINGLE_ISSUE_LIST': {
      return context.http.post({
        url,
        body: {
          // TODO: Can this be different then the name in the query?
          operationName: 'scrapSingleIssuesList',
          query: singleIssuesMutation,
          variables: {
            comicSeriesId: data.comicSeriesId,
            comicBookListUrl: data.url,
          },
        },
        encodeBodyAsJSON: true,
      })
    }
    case 'SCRAP_COLLECTION_LIST': {
      return context.http.post({
        url,
        body: {
          operationName: 'scrapCollectionsList',
          query: collectionsMutation,
          variables: {
            comicSeriesId: data.comicSeriesId,
            comicBookListUrl: data.url,
          },
        },
        encodeBodyAsJSON: true,
      })
    }
    case 'SCRAP_COMIC_BOOK': {
      return context.http.post({
        url,
        body: {
          operationName: 'scrapComicBook',
          query: comicBookMutation,
          variables: {
            comicBookUrl: data.url,
          },
        },
        encodeBodyAsJSON: true,
      })
    }
  }
}
