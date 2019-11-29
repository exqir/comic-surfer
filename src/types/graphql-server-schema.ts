import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
};









export type AdditionalEntityFields = {
  path?: Maybe<Scalars['String']>,
  type?: Maybe<Scalars['String']>,
};

export type ComicBook = {
   __typename?: 'ComicBook',
  _id: Scalars['ID'],
  title: Scalars['String'],
  issue?: Maybe<Scalars['String']>,
  releaseDate?: Maybe<Scalars['String']>,
  creators?: Maybe<Array<Maybe<Creator>>>,
  series?: Maybe<ComicSeries>,
  publisher?: Maybe<Publisher>,
  coverUrl?: Maybe<Scalars['String']>,
  url: Scalars['String'],
};

export type ComicSeries = {
   __typename?: 'ComicSeries',
  _id: Scalars['ID'],
  title: Scalars['String'],
  url: Scalars['String'],
  collectionsUrl?: Maybe<Scalars['String']>,
  issuesUrl?: Maybe<Scalars['String']>,
  publisher?: Maybe<Publisher>,
  collections?: Maybe<Array<Maybe<ComicBook>>>,
  issues?: Maybe<Array<Maybe<ComicBook>>>,
};

export type Creator = {
   __typename?: 'Creator',
  _id: Scalars['ID'],
  firstname?: Maybe<Scalars['String']>,
  lastname: Scalars['String'],
  series?: Maybe<Array<Maybe<ComicSeries>>>,
};

export type Mutation = {
   __typename?: 'Mutation',
  createPullList: PullList,
  pullSeries: PullList,
  removeSeries: PullList,
  _empty?: Maybe<Scalars['String']>,
};


export type MutationCreatePullListArgs = {
  owner: Scalars['String']
};


export type MutationPullSeriesArgs = {
  owner: Scalars['String'],
  publisher: Scalars['String'],
  seriesUrl: Scalars['String']
};


export type MutationRemoveSeriesArgs = {
  owner: Scalars['String'],
  series: Scalars['ID']
};

export type Publisher = {
   __typename?: 'Publisher',
  _id: Scalars['String'],
  name: Scalars['String'],
  iconUrl?: Maybe<Scalars['String']>,
  url?: Maybe<Scalars['String']>,
  basePath?: Maybe<Scalars['String']>,
  seriesPath?: Maybe<Scalars['String']>,
  searchPath?: Maybe<Scalars['String']>,
  searchPathSeries?: Maybe<Scalars['String']>,
  series?: Maybe<Array<Maybe<ComicSeries>>>,
};

export type PullList = {
   __typename?: 'PullList',
  _id: Scalars['ID'],
  owner: Scalars['String'],
  list?: Maybe<Array<Maybe<ComicSeries>>>,
};

export type Query = {
   __typename?: 'Query',
  getComicBook?: Maybe<ComicBook>,
  getComicSeries?: Maybe<ComicSeries>,
  getPublishers?: Maybe<Array<Publisher>>,
  getPublisher?: Maybe<Publisher>,
  getPullList?: Maybe<PullList>,
  _empty?: Maybe<Scalars['String']>,
  getSearch?: Maybe<Array<Maybe<Search>>>,
  getSearchByPublishers?: Maybe<Array<Maybe<Search>>>,
};


export type QueryGetComicBookArgs = {
  id: Scalars['ID']
};


export type QueryGetComicSeriesArgs = {
  id: Scalars['ID']
};


export type QueryGetPublishersArgs = {
  names: Array<Scalars['String']>
};


export type QueryGetPublisherArgs = {
  name: Scalars['String']
};


export type QueryGetPullListArgs = {
  owner: Scalars['String']
};


export type QueryGetSearchArgs = {
  q: Scalars['String']
};


export type QueryGetSearchByPublishersArgs = {
  q: Scalars['String'],
  publishers: Array<Scalars['String']>
};

export type Search = {
   __typename?: 'Search',
  title: Scalars['String'],
  url: Scalars['String'],
  publisher: Publisher,
};


import { ObjectID } from 'mongodb';
export type ComicBookDbObject = {
  _id: ObjectID,
  title: string,
  issue?: Maybe<string>,
  releaseDate?: Maybe<string>,
  creators?: Maybe<Array<Maybe<CreatorDbObject['_id']>>>,
  series?: Maybe<ComicSeriesDbObject['_id']>,
  publisher?: Maybe<PublisherDbObject['_id']>,
  coverUrl?: Maybe<string>,
  url: string,
};

export type CreatorDbObject = {
  _id: ObjectID,
  firstname?: Maybe<string>,
  lastname: string,
  series?: Maybe<Array<Maybe<ComicSeriesDbObject['_id']>>>,
};

export type ComicSeriesDbObject = {
  _id: ObjectID,
  title: string,
  url: string,
  collectionsUrl?: Maybe<string>,
  issuesUrl?: Maybe<string>,
  publisher?: Maybe<PublisherDbObject['_id']>,
  collections?: Maybe<Array<Maybe<ComicBookDbObject['_id']>>>,
  issues?: Maybe<Array<Maybe<ComicBookDbObject['_id']>>>,
};

export type PublisherDbObject = {
  _id: ObjectID,
  name: string,
  iconUrl?: Maybe<string>,
  url?: Maybe<string>,
  basePath?: Maybe<string>,
  seriesPath?: Maybe<string>,
  searchPath?: Maybe<string>,
  searchPathSeries?: Maybe<string>,
  series?: Maybe<Array<Maybe<ComicSeriesDbObject['_id']>>>,
};

export type PullListDbObject = {
  _id: ObjectID,
  owner: string,
  list?: Maybe<Array<Maybe<ComicSeriesDbObject['_id']>>>,
};

export type SearchDbObject = {
  title: string,
  url: string,
  publisher: PublisherDbObject['_id'],
};



export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;


export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Query: ResolverTypeWrapper<{}>,
  ID: ResolverTypeWrapper<Scalars['ID']>,
  ComicBook: ResolverTypeWrapper<ComicBook>,
  String: ResolverTypeWrapper<Scalars['String']>,
  Creator: ResolverTypeWrapper<Creator>,
  ComicSeries: ResolverTypeWrapper<ComicSeries>,
  Publisher: ResolverTypeWrapper<Publisher>,
  PullList: ResolverTypeWrapper<PullList>,
  Search: ResolverTypeWrapper<Search>,
  Mutation: ResolverTypeWrapper<{}>,
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>,
  AdditionalEntityFields: AdditionalEntityFields,
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {},
  ID: Scalars['ID'],
  ComicBook: ComicBook,
  String: Scalars['String'],
  Creator: Creator,
  ComicSeries: ComicSeries,
  Publisher: Publisher,
  PullList: PullList,
  Search: Search,
  Mutation: {},
  Boolean: Scalars['Boolean'],
  AdditionalEntityFields: AdditionalEntityFields,
};

export type UnionDirectiveResolver<Result, Parent, ContextType = any, Args = {   discriminatorField?: Maybe<Maybe<Scalars['String']>>,
  additionalFields?: Maybe<Maybe<Array<Maybe<AdditionalEntityFields>>>> }> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AbstractEntityDirectiveResolver<Result, Parent, ContextType = any, Args = {   discriminatorField?: Maybe<Scalars['String']>,
  additionalFields?: Maybe<Maybe<Array<Maybe<AdditionalEntityFields>>>> }> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type EntityDirectiveResolver<Result, Parent, ContextType = any, Args = {   embedded?: Maybe<Maybe<Scalars['Boolean']>>,
  additionalFields?: Maybe<Maybe<Array<Maybe<AdditionalEntityFields>>>> }> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type ColumnDirectiveResolver<Result, Parent, ContextType = any, Args = {   overrideType?: Maybe<Maybe<Scalars['String']>> }> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type IdDirectiveResolver<Result, Parent, ContextType = any, Args = {  }> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type LinkDirectiveResolver<Result, Parent, ContextType = any, Args = {   overrideType?: Maybe<Maybe<Scalars['String']>> }> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type EmbeddedDirectiveResolver<Result, Parent, ContextType = any, Args = {  }> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type MapDirectiveResolver<Result, Parent, ContextType = any, Args = {   path?: Maybe<Scalars['String']> }> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type ComicBookResolvers<ContextType = any, ParentType extends ResolversParentTypes['ComicBook'] = ResolversParentTypes['ComicBook']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  issue?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  releaseDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  creators?: Resolver<Maybe<Array<Maybe<ResolversTypes['Creator']>>>, ParentType, ContextType>,
  series?: Resolver<Maybe<ResolversTypes['ComicSeries']>, ParentType, ContextType>,
  publisher?: Resolver<Maybe<ResolversTypes['Publisher']>, ParentType, ContextType>,
  coverUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
};

export type ComicSeriesResolvers<ContextType = any, ParentType extends ResolversParentTypes['ComicSeries'] = ResolversParentTypes['ComicSeries']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  collectionsUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  issuesUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  publisher?: Resolver<Maybe<ResolversTypes['Publisher']>, ParentType, ContextType>,
  collections?: Resolver<Maybe<Array<Maybe<ResolversTypes['ComicBook']>>>, ParentType, ContextType>,
  issues?: Resolver<Maybe<Array<Maybe<ResolversTypes['ComicBook']>>>, ParentType, ContextType>,
};

export type CreatorResolvers<ContextType = any, ParentType extends ResolversParentTypes['Creator'] = ResolversParentTypes['Creator']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  firstname?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  lastname?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  series?: Resolver<Maybe<Array<Maybe<ResolversTypes['ComicSeries']>>>, ParentType, ContextType>,
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createPullList?: Resolver<ResolversTypes['PullList'], ParentType, ContextType, RequireFields<MutationCreatePullListArgs, 'owner'>>,
  pullSeries?: Resolver<ResolversTypes['PullList'], ParentType, ContextType, RequireFields<MutationPullSeriesArgs, 'owner' | 'publisher' | 'seriesUrl'>>,
  removeSeries?: Resolver<ResolversTypes['PullList'], ParentType, ContextType, RequireFields<MutationRemoveSeriesArgs, 'owner' | 'series'>>,
  _empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
};

export type PublisherResolvers<ContextType = any, ParentType extends ResolversParentTypes['Publisher'] = ResolversParentTypes['Publisher']> = {
  _id?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  iconUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  basePath?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  seriesPath?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  searchPath?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  searchPathSeries?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  series?: Resolver<Maybe<Array<Maybe<ResolversTypes['ComicSeries']>>>, ParentType, ContextType>,
};

export type PullListResolvers<ContextType = any, ParentType extends ResolversParentTypes['PullList'] = ResolversParentTypes['PullList']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  owner?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  list?: Resolver<Maybe<Array<Maybe<ResolversTypes['ComicSeries']>>>, ParentType, ContextType>,
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getComicBook?: Resolver<Maybe<ResolversTypes['ComicBook']>, ParentType, ContextType, RequireFields<QueryGetComicBookArgs, 'id'>>,
  getComicSeries?: Resolver<Maybe<ResolversTypes['ComicSeries']>, ParentType, ContextType, RequireFields<QueryGetComicSeriesArgs, 'id'>>,
  getPublishers?: Resolver<Maybe<Array<ResolversTypes['Publisher']>>, ParentType, ContextType, RequireFields<QueryGetPublishersArgs, 'names'>>,
  getPublisher?: Resolver<Maybe<ResolversTypes['Publisher']>, ParentType, ContextType, RequireFields<QueryGetPublisherArgs, 'name'>>,
  getPullList?: Resolver<Maybe<ResolversTypes['PullList']>, ParentType, ContextType, RequireFields<QueryGetPullListArgs, 'owner'>>,
  _empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  getSearch?: Resolver<Maybe<Array<Maybe<ResolversTypes['Search']>>>, ParentType, ContextType, RequireFields<QueryGetSearchArgs, 'q'>>,
  getSearchByPublishers?: Resolver<Maybe<Array<Maybe<ResolversTypes['Search']>>>, ParentType, ContextType, RequireFields<QueryGetSearchByPublishersArgs, 'q' | 'publishers'>>,
};

export type SearchResolvers<ContextType = any, ParentType extends ResolversParentTypes['Search'] = ResolversParentTypes['Search']> = {
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  publisher?: Resolver<ResolversTypes['Publisher'], ParentType, ContextType>,
};

export type Resolvers<ContextType = any> = {
  ComicBook?: ComicBookResolvers<ContextType>,
  ComicSeries?: ComicSeriesResolvers<ContextType>,
  Creator?: CreatorResolvers<ContextType>,
  Mutation?: MutationResolvers<ContextType>,
  Publisher?: PublisherResolvers<ContextType>,
  PullList?: PullListResolvers<ContextType>,
  Query?: QueryResolvers<ContextType>,
  Search?: SearchResolvers<ContextType>,
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
*/
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
export type DirectiveResolvers<ContextType = any> = {
  union?: UnionDirectiveResolver<any, any, ContextType>,
  abstractEntity?: AbstractEntityDirectiveResolver<any, any, ContextType>,
  entity?: EntityDirectiveResolver<any, any, ContextType>,
  column?: ColumnDirectiveResolver<any, any, ContextType>,
  id?: IdDirectiveResolver<any, any, ContextType>,
  link?: LinkDirectiveResolver<any, any, ContextType>,
  embedded?: EmbeddedDirectiveResolver<any, any, ContextType>,
  map?: MapDirectiveResolver<any, any, ContextType>,
};


/**
* @deprecated
* Use "DirectiveResolvers" root object instead. If you wish to get "IDirectiveResolvers", add "typesPrefix: I" to your config.
*/
export type IDirectiveResolvers<ContextType = any> = DirectiveResolvers<ContextType>;