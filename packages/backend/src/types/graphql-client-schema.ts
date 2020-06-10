export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
};

export type ComicBook = {
   __typename?: 'ComicBook';
  _id: Scalars['ID'];
  title: Scalars['String'];
  issueNo?: Maybe<Scalars['String']>;
  releaseDate?: Maybe<Scalars['Date']>;
  creators: Array<Creator>;
  comicSeries?: Maybe<ComicSeries>;
  publisher?: Maybe<Publisher>;
  coverImgUrl?: Maybe<Scalars['String']>;
  url: Scalars['String'];
};

export type ComicSeries = {
   __typename?: 'ComicSeries';
  _id: Scalars['ID'];
  title: Scalars['String'];
  url: Scalars['String'];
  collectionsUrl?: Maybe<Scalars['String']>;
  singleIssuesUrl?: Maybe<Scalars['String']>;
  publisher?: Maybe<Publisher>;
  collections: Array<ComicBook>;
  singleIssues: Array<ComicBook>;
};

export type Creator = {
   __typename?: 'Creator';
  _id: Scalars['ID'];
  firstname?: Maybe<Scalars['String']>;
  lastname: Scalars['String'];
  comicSeries: Array<ComicSeries>;
};


export type Mutation = {
   __typename?: 'Mutation';
  _empty?: Maybe<Scalars['String']>;
  scrapComicBook?: Maybe<ComicBook>;
  scrapComicBookList: Array<ComicBook>;
  subscribeComicSeries: PullList;
  subscribeExistingComicSeries: PullList;
  unsubscribeComicSeries: PullList;
};


export type MutationScrapComicBookArgs = {
  comicBookUrl: Scalars['String'];
};


export type MutationScrapComicBookListArgs = {
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

export type Publisher = {
   __typename?: 'Publisher';
  _id: Scalars['String'];
  name: Scalars['String'];
  iconUrl?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  cxUrl?: Maybe<Scalars['String']>;
  comicSeries: Array<ComicSeries>;
};

export type PullList = {
   __typename?: 'PullList';
  _id: Scalars['ID'];
  owner: Scalars['String'];
  list: Array<ComicSeries>;
};

export type Query = {
   __typename?: 'Query';
  _empty?: Maybe<Scalars['String']>;
  comicBook?: Maybe<ComicBook>;
  comicSeries?: Maybe<ComicSeries>;
  publisher?: Maybe<Publisher>;
  publishers: Array<Publisher>;
  pullList?: Maybe<PullList>;
  search: Array<Search>;
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
  names?: Maybe<Array<Scalars['String']>>;
};


export type QuerySearchArgs = {
  q: Scalars['String'];
};

export type Search = {
   __typename?: 'Search';
  title: Scalars['String'];
  url: Scalars['String'];
};

