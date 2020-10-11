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
  const comicBookMutation = `mutation updateComicBookRelease($comicBookId: ID!) {
      updateComicBookRelease(comicBookId: $comicBookId) {
          _id
      }
    }
    `
  const publisherMutation = `mutation updateComicSeriesPublisher($comicSeriesId: ID!) {
      updateComicSeriesPublisher(comicSeriesId: $comicSeriesId) {
        _id
      }
    }
    `
  const scrapComicBookMutation = `mutation scrapComicBook($comicBookUrl: String!) {
      scrapComicBook(comicBookUrl: $comicBookUrl) {
        _id
      }
    }
  `

  let body

  switch (type) {
    case 'SCRAP_SINGLE_ISSUE_LIST': {
      body = {
        operationName: 'scrapSingleIssuesList',
        query: singleIssuesMutation,
        variables: {
          comicSeriesId: data.comicSeriesId,
          comicBookListUrl: data.url,
        },
      }
      break
    }
    case 'SCRAP_COLLECTION_LIST': {
      body = {
        operationName: 'scrapCollectionsList',
        query: collectionsMutation,
        variables: {
          comicSeriesId: data.comicSeriesId,
          comicBookListUrl: data.url,
        },
      }
      break
    }
    case 'UPDATE_COMIC_BOOK_RELEASE': {
      body = {
        operationName: 'updateComicBookRelease',
        query: comicBookMutation,
        variables: {
          comicBookId: data.comicBookId,
        },
      }
      break
    }
    case 'UPDATE_COMIC_SERIES_PUBLISHER': {
      body = {
        operationName: 'updateComicSeriesPublisher',
        query: publisherMutation,
        variables: { comicSeriesId: data.comicSeriesId },
      }
      break
    }
    case 'SCRAP_COMIC_BOOK': {
      body = {
        operationName: 'scrapComicBook',
        query: scrapComicBookMutation,
        variables: { comicBookUrl: data.comicBookUrl },
      }
      break
    }
  }

  return context.http
    .post({
      url: 'https://exqir2.uber.space/comic-surfer/api',
      body,
      encodeBodyAsJSON: true,
    })
    .then((response) => {
      if (response.statusCode !== 200) {
        throw new Error(
          `GraphQL API responded with status code ${response.statusCode} : ${response.status}.`,
        )
      }
      const { data, error } = EJSON.parse(response.body.text())
      if (Array.isArray(error) && error.length > 0) {
        throw new Error(
          `${error[0].message}.\n` + `Body: ${JSON.stringify(body)}`,
        )
      }
      return data
    })
}
