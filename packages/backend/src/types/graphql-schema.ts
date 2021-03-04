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
  /** ID of the ComicBook. */
  _id: Scalars['ID'];
  /** Title of the ComicBook. */
  title: Scalars['String'];
  /** Issue Number of the ComicBook. */
  issueNo: Maybe<Scalars['String']>;
  /** Release Date of the ComicBook. */
  releaseDate: Maybe<Scalars['Date']>;
  /** List of Creators of the ComicBook. */
  creators: Array<Creator>;
  /** ComicSeries the ComicBook belongs to. */
  comicSeries: Maybe<ComicSeries>;
  /** Publisher of the ComicBook. */
  publisher: Maybe<Publisher>;
  /** URL of the Cover Image of the ComicBook. */
  coverImgUrl: Maybe<Scalars['String']>;
  /** URL of the ComicBook on Comixology. */
  url: Scalars['String'];
  /** Description for the ComicBook. HTML containing Tags for basic text styling. */
  description: Maybe<Scalars['String']>;
  /** Type of ComicBook */
  type: ComicBookType;
  /** Date the ComicBook was last modified. */
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
  /** The last time the ComicSeries was modified. */
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
  /** Name of the Creator. */
  name: Scalars['String'];
};


export type Mutation = {
   __typename?: 'Mutation';
  _empty: Maybe<Scalars['String']>;
  /**
   * Internal: Add new colletions and single issue releases of ComicSeries.
   * Enqueues looking for new releases of ComicSeries which releases have not been updated for the longest time.
   */
  addNewReleases: Maybe<Array<ComicSeries>>;
  /** Add a ComicSeries to the users PullList based on its url. */
  addToPullList: Maybe<PullList>;
  /**
   * Login a user based on the token given in the Authorization header.
   * If the user does not exist yet, a new one will be created.
   */
  login: PullList;
  /** Logout the current user. */
  logout: Scalars['Boolean'];
  /** Remove a ComicSeries from the users PullList based on its id. */
  removeFromPullList: Maybe<PullList>;
  /** Internal: Update ComicBook data. */
  updateComicBook: Maybe<ComicBook>;
  /** Internal: Update the release date of the ComicBook. */
  updateComicBookRelease: Maybe<ComicBook>;
  /** Internal: Set the Publisher of a ComicSeries. */
  updateComicSeriesPublisher: Maybe<ComicSeries>;
  /**
   * Internal: Verfies release dates of upcoming ComicBook releases.
   * Enqueues looking for updates to ComicBooks that are released soon but have not been updated.
   */
  verifyUpcomingReleases: Maybe<Array<ComicBook>>;
};


export type MutationAddToPullListArgs = {
  comicSeriesUrl: Scalars['String'];
};


export type MutationRemoveFromPullListArgs = {
  comicSeriesId: Scalars['ID'];
};


export type MutationUpdateComicBookArgs = {
  comicBookId: Scalars['ID'];
};


export type MutationUpdateComicBookReleaseArgs = {
  comicBookId: Scalars['ID'];
};


export type MutationUpdateComicSeriesPublisherArgs = {
  comicSeriesId: Scalars['ID'];
};

export type Publisher = {
   __typename?: 'Publisher';
  /** ID of the Publisher. */
  _id: Scalars['String'];
  /** Name of the Publisher. */
  name: Scalars['String'];
  /** URL of the Icon of the Publisher. */
  iconUrl: Maybe<Scalars['String']>;
  /** URL of the Publisher. */
  url: Maybe<Scalars['String']>;
  /** URL of the Publisher on Comixology. */
  cxUrl: Maybe<Scalars['String']>;
  /** List of ComicSeries published by the Publisher. */
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
  /** Get the ComicBook matching the provided ID. */
  comicBook: Maybe<ComicBook>;
  /** Get the ComicSeries matching the provided ID. */
  comicSeries: Maybe<ComicSeries>;
  /** The PullList of the currently loggedin user. */
  pullList: PullList;
  /**
   * The ComicBooks released within the given month and year.
   * In case of a logged-in user only ComicBooks from ComicSeries of the users PullList are included.
   */
  releases: Maybe<Array<ComicBook>>;
  /** Searchs for ComicSeries containing the given query. */
  search: Maybe<Array<SearchResult>>;
};


export type QueryComicBookArgs = {
  id: Scalars['ID'];
};


export type QueryComicSeriesArgs = {
  id: Scalars['ID'];
};


export type QueryReleasesArgs = {
  month: Maybe<Scalars['Int']>;
  year: Maybe<Scalars['Int']>;
  type: Maybe<ComicBookType>;
};


export type QuerySearchArgs = {
  query: Scalars['String'];
};

export type SearchResult = {
   __typename?: 'SearchResult';
  /** The title of the ComicSeries. */
  title: Scalars['String'];
  /** The url from which the data for the ComicSeries is retrieved from. */
  url: Scalars['String'];
  /**
   * Indicating if the ComicSeries is on the PullList of the current user.
   * Will always be false when there is no current user.
   */
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
  description: Maybe<string>,
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
