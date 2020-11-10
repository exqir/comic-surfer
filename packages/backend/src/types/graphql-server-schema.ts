export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: ObjectID;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: Date;
};









export type AdditionalEntityFields = {
  path: Maybe<Scalars['String']>;
  type: Maybe<Scalars['String']>;
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
  type: ComicBookType;
  lastModified: Scalars['Date'];
};

export enum ComicBookType {
  SINGLEISSUE = 'SINGLEISSUE',
  COLLECTION = 'COLLECTION'
}

export type ComicSeries = {
   __typename?: 'ComicSeries';
  _id: Scalars['ID'];
  title: Scalars['String'];
  url: Scalars['String'];
  collectionsUrl: Maybe<Scalars['String']>;
  singleIssuesUrl: Maybe<Scalars['String']>;
  publisher: Maybe<Publisher>;
  collections: Array<ComicBook>;
  singleIssues: Array<ComicBook>;
  lastModified: Scalars['Date'];
  /** Url for the cover of the latest single issue or collection of the ComicSeries. */
  coverImgUrl: Maybe<Scalars['String']>;
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
  updateComicSeries: Array<ComicSeries>;
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


import { ObjectID } from 'mongodb';
export type ComicBookDbObject = {
  _id: ObjectID,
  title: string,
  issueNo: Maybe<string>,
  releaseDate: Maybe<Date>,
  creators: Array<CreatorDbObject>,
  comicSeries: Maybe<ComicSeriesDbObject['_id']>,
  publisher: Maybe<PublisherDbObject['_id']>,
  coverImgUrl: Maybe<string>,
  url: string,
  type: string,
  lastModified: Date,
};

export type CreatorDbObject = {
  name: string,
};

export type ComicSeriesDbObject = {
  _id: ObjectID,
  title: string,
  url: string,
  collectionsUrl: Maybe<string>,
  singleIssuesUrl: Maybe<string>,
  publisher: Maybe<PublisherDbObject['_id']>,
  collections: Array<ComicBookDbObject['_id']>,
  singleIssues: Array<ComicBookDbObject['_id']>,
  lastModified: Date,
};

export type PublisherDbObject = {
  _id: ObjectID,
  name: string,
  iconUrl: Maybe<string>,
  url: Maybe<string>,
  cxUrl: Maybe<string>,
  comicSeries: Array<ComicSeriesDbObject['_id']>,
};

export type PullListDbObject = {
  _id: ObjectID,
  owner: string,
  list: Array<ComicSeriesDbObject['_id']>,
};
