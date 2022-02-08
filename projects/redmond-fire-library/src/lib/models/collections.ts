import { DefaultDoc, SiteEntityType } from "./docs"


export interface CollectionFilterOption { handle?: any; label: string };

export interface CollectionFilterOptions {
  [key: string]: CollectionFilterOption[];
}
export interface CollectionDoc extends DefaultDoc {
  title: string;
  handle: CollectionType;
  filters?: CollectionFilterOptions;
  description?: string;
  state?: {
    [key: string]: { title: string, description: string, handle: string };
  }
}


export enum PostCollectionType {
  NEWS = 'news',
  PRESS = 'press',
  THOUGHT = 'thought',
  POSTS = 'posts'
}

export enum CollectionType {
  PAGES = 'pages',
  POSTS = 'posts',
  PROJECTS = 'projects',
  TEAM = 'team',
  USERS = 'users',
  UPLOADS = 'uploads',
}

export enum SiteCollectionPageType {
  PROJECTS = 'projects',
  POSTS = 'posts',
  NEWS = 'news',
  PRESS = 'press',
  THOUGHT = 'thought',
}

export const SITE_COLLECTION_TYPES = Object.values(SiteCollectionPageType);

export enum OptionsCollectionType {
  SECTORS = 'sectors',
  POST_CATEGORIES = 'post_categories',
}

export enum SimpleCollectionType {
  NAVIGATION = 'navigation',
  FOOTER = 'footer',
  HIRING = 'hiring'
}
export const SIMPLE_COLLECTION_TYPES = Object.values(SimpleCollectionType);

export enum CollectionTypeSingular {
  PAGE = 'page',
  POST = 'post',
  PROJECT = 'project',
  TEAM = 'team',
  USER = 'user',
  SECTOR = 'sector',
  UPLOAD = 'upload',
}

export const COLLECTION_TYPE_SINGULAR = {
  pages: 'page',
  posts: 'post',
  projects: 'project',
  team: 'team',
  users: 'user',
  sectors: 'sector',
  uploads: 'media',
}

export const ENTITY_TYPE_FROM_COLLECTION: {[key:string]: SiteEntityType} = {
  pages:  SiteEntityType.PAGE,
  posts: SiteEntityType.POST,
  projects: SiteEntityType.PROJECT,
  team: SiteEntityType.TEAM,
}

export const COLLECTION_TYPE_FROM_SINGULAR = {
  page: 'pages',
  post: 'posts',
  project: 'projects',
  team: 'team',
  user: 'users',
  sector: 'sectors',
  upload: 'medias',
  media: 'uploads',
}

export const COLLECTION_DOC_ADMIN_PATH = {
  pages: 'admin/pages/collection',
  posts: 'admin/posts/collection',
  projects: 'admin/projects/collection',
  team: 'admin/team/collection',
  users: 'users',
  uploads: 'uploads',
}
export const COLLECTION_DOC_PUBLIC_PATH = {
  pages: 'public/pages/collection',
  posts: 'public/posts/collection',
  projects: 'public/projects/collection',
  team: 'public/team/collection',
}




export const collectionSearchData = (collectionType: CollectionType | OptionsCollectionType) => {
  const path = COLLECTION_DOC_PUBLIC_PATH[collectionType];
  const query = { orderBy: 'createdAt,desc', limit: 6 };
  const searchData = {
    [CollectionType.PROJECTS]: { path, filterOptionTypes: ['sort', 'status', 'sector'], query },
    [CollectionType.POSTS]: { path, filterOptionTypes: ['sort', 'status', 'post_categories'], query },
    [CollectionType.PAGES]: { path, filterOptionTypes: ['sort', 'status'], query },
    [CollectionType.UPLOADS]: { path, filterOptionTypes: ['sort', 'status', 'mediaType'], query },
    [CollectionType.TEAM]: { path, filterOptionTypes: ['sort'], query },
    [CollectionType.USERS]: { path, filterOptionTypes: ['sort'], query },
  }
  
  return !!searchData[collectionType] ? searchData[collectionType] : null;
}




export const COLLECTION_TYPES: CollectionType[] = Object.values(CollectionType)
export const OPTIONS_COLLECTION_TYPES: OptionsCollectionType[] = Object.values(OptionsCollectionType)

export const POST_COLLECTION_TYPES: PostCollectionType[] = Object.values(PostCollectionType);

export enum CollectionDocType {
      PROJECTS = 'projects',
      POSTS = 'posts',
}


export enum PostType {
  DEFAULT = 'posts',
  NEWS = 'news',
  THOUGHT = 'thought',
  PRESS = 'press',
}

export const POST_TYPES = Object.keys(PostType).map(key => PostType[key])