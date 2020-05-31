export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: ObjectID;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
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
  releaseDate: Maybe<Scalars['Int']>;
  creators: Array<Maybe<Creator>>;
  comicSeries: Maybe<ComicSeries>;
  publisher: Maybe<Publisher>;
  coverImgUrl: Maybe<Scalars['String']>;
  url: Scalars['String'];
};

export type ComicSeries = {
   __typename?: 'ComicSeries';
  _id: Scalars['ID'];
  title: Scalars['String'];
  url: Scalars['String'];
  collectionsUrl: Maybe<Scalars['String']>;
  issuesUrl: Maybe<Scalars['String']>;
  publisher: Maybe<Publisher>;
  collections: Maybe<Array<ComicBook>>;
  issues: Maybe<Array<ComicBook>>;
};

export type Creator = {
   __typename?: 'Creator';
  _id: Scalars['ID'];
  firstname: Maybe<Scalars['String']>;
  lastname: Scalars['String'];
  series: Maybe<Array<ComicSeries>>;
};

export type Mutation = {
   __typename?: 'Mutation';
  _empty: Maybe<Scalars['String']>;
  createPullList: PullList;
  pullSeries: PullList;
  removeSeries: PullList;
};


export type MutationCreatePullListArgs = {
  owner: Scalars['String'];
};


export type MutationPullSeriesArgs = {
  owner: Scalars['String'];
  publisher: Scalars['String'];
  seriesUrl: Scalars['String'];
};


export type MutationRemoveSeriesArgs = {
  owner: Scalars['String'];
  series: Scalars['ID'];
};

export type Publisher = {
   __typename?: 'Publisher';
  _id: Scalars['String'];
  name: Scalars['String'];
  iconUrl: Maybe<Scalars['String']>;
  url: Maybe<Scalars['String']>;
  basePath: Maybe<Scalars['String']>;
  seriesPath: Maybe<Scalars['String']>;
  searchPath: Maybe<Scalars['String']>;
  searchPathSeries: Maybe<Scalars['String']>;
  series: Maybe<Array<ComicSeries>>;
};

export type PullList = {
   __typename?: 'PullList';
  _id: Scalars['ID'];
  owner: Scalars['String'];
  list: Maybe<Array<ComicSeries>>;
};

export type Query = {
   __typename?: 'Query';
  _empty: Maybe<Scalars['String']>;
  comicBook: Maybe<ComicBook>;
  getComicSeries: Maybe<ComicSeries>;
  getPublisher: Maybe<Publisher>;
  getPublishers: Maybe<Array<Publisher>>;
  getPullList: Maybe<PullList>;
  getSearch: Maybe<Array<Maybe<Search>>>;
};


export type QueryComicBookArgs = {
  id: Scalars['ID'];
};


export type QueryGetComicSeriesArgs = {
  id: Scalars['ID'];
};


export type QueryGetPublisherArgs = {
  name: Scalars['String'];
};


export type QueryGetPublishersArgs = {
  names: Array<Scalars['String']>;
};


export type QueryGetPullListArgs = {
  owner: Scalars['String'];
};


export type QueryGetSearchArgs = {
  q: Scalars['String'];
};

export type Search = {
   __typename?: 'Search';
  title: Scalars['String'];
  url: Scalars['String'];
};


import { ObjectID } from 'mongodb';
export type ComicBookDbObject = {
  _id: ObjectID,
  title: string,
  issueNo: Maybe<string>,
  releaseDate: Maybe<number>,
  creators: Array<Maybe<CreatorDbObject['_id']>>,
  comicSeries: Maybe<ComicSeriesDbObject['_id']>,
  publisher: Maybe<PublisherDbObject['_id']>,
  coverImgUrl: Maybe<string>,
  url: string,
};

export type CreatorDbObject = {
  _id: ObjectID,
  firstname: Maybe<string>,
  lastname: string,
  series: Maybe<Array<ComicSeriesDbObject['_id']>>,
};

export type ComicSeriesDbObject = {
  _id: ObjectID,
  title: string,
  url: string,
  collectionsUrl: Maybe<string>,
  issuesUrl: Maybe<string>,
  publisher: Maybe<PublisherDbObject['_id']>,
  collections: Maybe<Array<ComicBookDbObject['_id']>>,
  issues: Maybe<Array<ComicBookDbObject['_id']>>,
};

export type PublisherDbObject = {
  _id: ObjectID,
  name: string,
  iconUrl: Maybe<string>,
  url: Maybe<string>,
  basePath: Maybe<string>,
  seriesPath: Maybe<string>,
  searchPath: Maybe<string>,
  searchPathSeries: Maybe<string>,
  series: Maybe<Array<ComicSeriesDbObject['_id']>>,
};

export type PullListDbObject = {
  _id: ObjectID,
  owner: string,
  list: Maybe<Array<ComicSeriesDbObject['_id']>>,
};
