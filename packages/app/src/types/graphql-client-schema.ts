export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: string;
};

export type ComicBook = {
   __typename?: 'ComicBook';
  _id: Scalars['ID'];
  title: Scalars['String'];
  issueNo: Maybe<Scalars['String']>;
  releaseDate: Maybe<Scalars['Date']>;
  creators: Array<Creator>;
  comicSeries: Maybe<ComicSeries>;
  publisher: Maybe<Publisher>;
  coverImgUrl: Maybe<Scalars['String']>;
  url: Scalars['String'];
  /** Description for the ComicBook. HTML containing Tags for basic text styling. */
  description: Maybe<Scalars['String']>;
  type: ComicBookType;
  lastModified: Scalars['Date'];
};

export enum ComicBookType {
  SINGLEISSUE = 'SINGLEISSUE',
  COLLECTION = 'COLLECTION'
}

export type ComicSeries = {
   __typename?: 'ComicSeries';
  /** ID of the ComicSeries. */
  _id: Scalars['ID'];
  /** The title of the ComicSeries. */
  title: Scalars['String'];
  /** The url from which the data for the ComicSeries is retrieved from. */
  url: Scalars['String'];
  /** The url from which the collections for the ComicSeries are retrieved from. */
  collectionsUrl: Maybe<Scalars['String']>;
  /** The url from which the single issues for the ComicSeries are retrieved from. */
  singleIssuesUrl: Maybe<Scalars['String']>;
  /** The Publisher of the ComicSeries. */
  publisher: Maybe<Publisher>;
  /** The list of collection ComicBooks belonging to the ComicSeries. */
  collections: Array<ComicBook>;
  /** The list of single issue ComicBooks belonging to the ComicSeries. */
  singleIssues: Array<ComicBook>;
  /** The last time the ComicSeries of modified. */
  lastModified: Scalars['Date'];
  /** The url for the cover of the latest single issue or collection of the ComicSeries. */
  coverImgUrl: Maybe<Scalars['String']>;
  /** The number of single issues belonging to the ComicSeries. */
  singleIssuesNumber: Scalars['Int'];
  /** The number of collections belonging to the ComicSeries. */
  collectionsNumber: Scalars['Int'];
};

export type Creator = {
   __typename?: 'Creator';
  name: Scalars['String'];
};


export type Mutation = {
   __typename?: 'Mutation';
  _empty: Maybe<Scalars['String']>;
  /** Login a user based on the token given in the Authorization header. */
  login: PullList;
  /** Logout the current user. */
  logout: Scalars['Boolean'];
  scrapCollectionsList: Array<ComicBook>;
  scrapComicBook: ComicBook;
  scrapSingleIssuesList: Array<ComicBook>;
  /** Add a ComicSeries to the users PullList based on its url. */
  subscribeComicSeries: PullList;
  /** Add a ComicSeries to the users PullList based on its id. */
  subscribeExistingComicSeries: PullList;
  /** Remove a ComicSeries from the users PullList based on its id. */
  unsubscribeComicSeries: PullList;
  updateComicBookRelease: ComicBook;
  updateComicBooks: Array<ComicBook>;
  /**
   * Internal: Enqueue updating the colletions and single issues of ComicSeries
   * that have not been updated for more than a month.
   */
  updateComicSeries: Array<ComicSeries>;
  /** Internal: Update the Publisher of the ComicSeries. */
  updateComicSeriesPublisher: ComicSeries;
};


export type MutationScrapCollectionsListArgs = {
  comicSeriesId: Scalars['ID'];
  comicBookListUrl: Scalars['String'];
};


export type MutationScrapComicBookArgs = {
  comicBookUrl: Scalars['String'];
};


export type MutationScrapSingleIssuesListArgs = {
  comicSeriesId: Scalars['ID'];
  comicBookListUrl: Scalars['String'];
};


export type MutationSubscribeComicSeriesArgs = {
  comicSeriesUrl: Scalars['String'];
};


export type MutationSubscribeExistingComicSeriesArgs = {
  comicSeriesId: Scalars['ID'];
};


export type MutationUnsubscribeComicSeriesArgs = {
  comicSeriesId: Scalars['ID'];
};


export type MutationUpdateComicBookReleaseArgs = {
  comicBookId: Scalars['ID'];
};


export type MutationUpdateComicSeriesPublisherArgs = {
  comicSeriesId: Scalars['ID'];
};

export type Publisher = {
   __typename?: 'Publisher';
  _id: Scalars['String'];
  name: Scalars['String'];
  iconUrl: Maybe<Scalars['String']>;
  url: Maybe<Scalars['String']>;
  cxUrl: Maybe<Scalars['String']>;
  comicSeries: Array<ComicSeries>;
};

export type PullList = {
   __typename?: 'PullList';
  /** ID of the PullList. */
  _id: Scalars['ID'];
  /** The user the PullList belongs to. */
  owner: Scalars['String'];
  /** The list of ComicSeries on the PullList. */
  list: Array<ComicSeries>;
};

export type Query = {
   __typename?: 'Query';
  _empty: Maybe<Scalars['String']>;
  comicBook: Maybe<ComicBook>;
  /** Get the ComicSeries matching the provided ID. */
  comicSeries: Maybe<ComicSeries>;
  publisher: Maybe<Publisher>;
  publishers: Maybe<Array<Publisher>>;
  /** The PullList of the current user. */
  pullList: PullList;
  /**
   * The ComicBooks released within the month matching the arguments.
   * In case of a logged-in user only ComicBooks from ComicSeries of the users PullList are included.
   */
  releases: Maybe<Array<ComicBook>>;
  search: Maybe<Array<Search>>;
};


export type QueryComicBookArgs = {
  id: Scalars['ID'];
};


export type QueryComicSeriesArgs = {
  id: Scalars['ID'];
};


export type QueryPublisherArgs = {
  name: Scalars['String'];
};


export type QueryPublishersArgs = {
  names: Maybe<Array<Scalars['String']>>;
};


export type QueryReleasesArgs = {
  month: Maybe<Scalars['Int']>;
  year: Maybe<Scalars['Int']>;
  type: Maybe<ComicBookType>;
};


export type QuerySearchArgs = {
  q: Scalars['String'];
};

export type Search = {
   __typename?: 'Search';
  title: Scalars['String'];
  url: Scalars['String'];
  inPullList: Scalars['Boolean'];
};

export type GetComicBookQueryVariables = {
  comicBookId: Scalars['ID'];
};


export type GetComicBookQuery = (
  { __typename?: 'Query' }
  & { comicBook: Maybe<(
    { __typename?: 'ComicBook' }
    & Pick<ComicBook, '_id' | 'title' | 'issueNo' | 'coverImgUrl' | 'releaseDate' | 'description' | 'url'>
    & { comicSeries: Maybe<(
      { __typename?: 'ComicSeries' }
      & Pick<ComicSeries, '_id'>
      & { singleIssues: Array<(
        { __typename?: 'ComicBook' }
        & Pick<ComicBook, '_id' | 'title' | 'issueNo' | 'coverImgUrl' | 'releaseDate'>
      )> }
    )> }
  )> }
);

export type GetComicSeriesQueryVariables = {
  comicSeriesId: Scalars['ID'];
};


export type GetComicSeriesQuery = (
  { __typename?: 'Query' }
  & { comicSeries: Maybe<(
    { __typename?: 'ComicSeries' }
    & Pick<ComicSeries, '_id' | 'url' | 'title' | 'coverImgUrl'>
    & { singleIssues: Array<(
      { __typename?: 'ComicBook' }
      & Pick<ComicBook, '_id' | 'title' | 'issueNo' | 'coverImgUrl' | 'releaseDate'>
    )>, collections: Array<(
      { __typename?: 'ComicBook' }
      & Pick<ComicBook, '_id' | 'title' | 'issueNo' | 'coverImgUrl' | 'releaseDate'>
    )>, publisher: Maybe<(
      { __typename?: 'Publisher' }
      & Pick<Publisher, '_id' | 'name'>
    )> }
  )> }
);

export type GetCurrentComicBookReleasesQueryVariables = {};


export type GetCurrentComicBookReleasesQuery = (
  { __typename?: 'Query' }
  & { releases: Maybe<Array<(
    { __typename?: 'ComicBook' }
    & Pick<ComicBook, '_id' | 'title' | 'issueNo' | 'coverImgUrl' | 'releaseDate' | 'url'>
  )>> }
);

export type GetPullListQueryVariables = {};


export type GetPullListQuery = (
  { __typename?: 'Query' }
  & { pullList: (
    { __typename?: 'PullList' }
    & Pick<PullList, '_id' | 'owner'>
    & { list: Array<(
      { __typename?: 'ComicSeries' }
      & Pick<ComicSeries, '_id' | 'title' | 'coverImgUrl'>
    )> }
  ) }
);

export type GetSearchQueryVariables = {
  searchQuery: Scalars['String'];
};


export type GetSearchQuery = (
  { __typename?: 'Query' }
  & { search: Maybe<Array<(
    { __typename?: 'Search' }
    & Pick<Search, 'title' | 'url' | 'inPullList'>
  )>> }
);

export type LoginUserMutationVariables = {};


export type LoginUserMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'PullList' }
    & Pick<PullList, '_id' | 'owner'>
    & { list: Array<(
      { __typename?: 'ComicSeries' }
      & Pick<ComicSeries, '_id' | 'url'>
    )> }
  ) }
);

export type LogoutUserMutationVariables = {};


export type LogoutUserMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type SubscribeToComicSeriesMutationVariables = {
  comicSeriesUrl: Scalars['String'];
};


export type SubscribeToComicSeriesMutation = (
  { __typename?: 'Mutation' }
  & { subscribeComicSeries: (
    { __typename?: 'PullList' }
    & Pick<PullList, '_id' | 'owner'>
    & { list: Array<(
      { __typename?: 'ComicSeries' }
      & Pick<ComicSeries, '_id' | 'url'>
    )> }
  ) }
);

export type UnsubscribeFromComicSeriesMutationVariables = {
  comicSeriesId: Scalars['ID'];
};


export type UnsubscribeFromComicSeriesMutation = (
  { __typename?: 'Mutation' }
  & { unsubscribeComicSeries: (
    { __typename?: 'PullList' }
    & Pick<PullList, '_id' | 'owner'>
    & { list: Array<(
      { __typename?: 'ComicSeries' }
      & Pick<ComicSeries, '_id' | 'url'>
    )> }
  ) }
);
