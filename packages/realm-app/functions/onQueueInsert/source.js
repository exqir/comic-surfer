exports = function onQueueInsert(changeEvent) {
  const { _id, type, data } = changeEvent.fullDocument;
  const updateComicSeriesBooks = `mutation updateComicSeriesBooks($comicSeriesId: ID!, $comicBookType: ComicBookType!, $comicBookListPath: String) {
      updateComicSeriesBooks(comicSeriesId: $comicSeriesId, comicBookType: $comicBookType, comicBookListPath: $comicBookListPath) {
        _id
      }
    }
    `;
  const updateComicBookRelease = `mutation updateComicBookRelease($comicBookId: ID!) {
      updateComicBookRelease(comicBookId: $comicBookId) {
          _id
      }
    }
    `;
  const updateComicSeriesPublisher = `mutation updateComicSeriesPublisher($comicSeriesId: ID!) {
      updateComicSeriesPublisher(comicSeriesId: $comicSeriesId) {
        _id
      }
    }
    `;
  const updateComicBook = `mutation updateComicBook($comicBookUrl: String!) {
      updateComicBook(comicBookUrl: $comicBookUrl) {
        _id
      }
    }
  `;

  let body;

  switch (type) {
    case 'SCRAP_COMIC_BOOK_LIST': {
      body = {
        operationName: 'updateComicSeriesBooks',
        query: updateComicSeriesBooks,
        variables: {
          comicSeriesId: data.comicSeriesId,
          comicBookType: data.type,
          comicBookListPath: data.url,
        },
      };
      break;
    }
    case 'UPDATE_COMIC_BOOK_RELEASE': {
      body = {
        operationName: 'updateComicBookRelease',
        query: updateComicBookRelease,
        variables: {
          comicBookId: data.comicBookId,
        },
      };
      break;
    }
    case 'UPDATE_COMIC_SERIES_PUBLISHER': {
      body = {
        operationName: 'updateComicSeriesPublisher',
        query: updateComicSeriesPublisher,
        variables: { comicSeriesId: data.comicSeriesId },
      };
      break;
    }
    case 'SCRAP_COMIC_BOOK': {
      body = {
        operationName: 'scrapComicBook',
        query: updateComicBook,
        variables: { comicBookUrl: data.comicBookUrl },
      };
      break;
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
        );
      }
      const { data, error } = EJSON.parse(response.body.text());
      if (Array.isArray(error) && error.length > 0) {
        throw new Error(
          `${error[0].message}.\n` + `Body: ${JSON.stringify(body)}`,
        );
      }
      return data;
    });
};
