import { ContentBlock } from "./entity-options";
export enum SiteEntityType {
      PROJECT = 'project',
      POST = 'post',
      PAGE = 'page',
      TEAM = 'team',
}

export enum SiteCollectionType {
      PROJECTS = 'projects',
      POSTS = 'posts',
      PAGES = 'pages',
      TEAM = 'team',
}



export enum SiteEntityCollectionType {
      PROJECTS = 'projects',
      POSTS = 'posts',
      PAGES = 'pages',
      TEAM = 'team',
}


export interface DefaultDoc {
      docId?: string;
      docPath?: string;
      updatedAt?: number;
      createdAt?: number;
      publishedAt?: number;
      savedAt?: number;
}

export enum MediaType {
      VIDEO = 'video',
      IMAGE = 'image',
      PDF = 'pdf',
      YOUTUBE = 'youtube',
}

export interface PageDoc extends DefaultDoc {
      handle: string;
      title: string;
      type: SiteEntityType | string;
      pageHeading?: boolean;
      description?: string;
      content?: string;
      excerpt?: string;
      redirects?: string[];
      image?: MediaDoc;
      status?: EntityStatus;
      classes?: { [key: string]: string };
      seo?: EntitySeoData;
      order?: number;
      /* page */
      carousel?: ContentBlock;
      blocks?: ContentBlock[];
      /* team */
      name?: string;
      bio?: string;
      linkedIn?: string;
      jobTitle?: string;
      /* project */
      images?: MediaDoc[];
      client?: string;
      location?: { city?: string; state?: string; address?: string };
      sector?: string;
      /* post */
      category?: string;
      author?: { name: string; image?: MediaDoc;[key: string]: any } | PageDoc_Team;
      featured?: boolean;
}

export interface EntitySeoData {
      title?: string,
      description?: string,
      image?: string,
}


export interface MediaDoc extends DefaultDoc {
      src: string;
      filetype: string;
      thumbs?: { [key: string]: string };
      alt?: string;
      filename?: string;
      mediaType?: MediaType;
      tags?: string[];
      ogSrc?: string;
}

export interface PageDoc_Project extends PageDoc {
      client: string;
      location: { city?: string; state?: string; address?: string };
      sector: string;
      order: number;
      images?: MediaDoc[];
      featured?: boolean;
}

export interface PageDoc_Team extends PageDoc {
      name: string;
      jobTitle: string;
      bio: string;
      image: MediaDoc;
      // funFact?: string;
      linkedIn?: string;
}

export interface PageDoc_Post extends PageDoc {
      handle: string;
      title: string;
      excerpt: string;
      image: MediaDoc;
      content: string;
      category: string;
      featured?: boolean;
      author?: { name: string; image?: MediaDoc; [key:string]: any } | PageDoc_Team;
}


export enum EntityStatus {
      DRAFT = 'draft',
      PUBLISHED = 'published',
      HIDDEN = 'hidden',
      UNSAVED = 'unsaved',
      ARCHIVED = 'archived'
}
export const ENTITY_STATUSES:EntityStatus[] = Object.values(EntityStatus);

export const ENTITY_STATUS_LIST: { color: string, value: EntityStatus}[] = [
      { color: 'yellow', value: EntityStatus.DRAFT },
      { color: 'green', value: EntityStatus.PUBLISHED },
      { color: 'gray-400', value: EntityStatus.HIDDEN },
      // { color: 'red', value: EntityStatus.ARCHIVED },
]
export const ENTITY_STATUS_COLORS = ENTITY_STATUS_LIST.reduce((obj, itm) => {
    return { ...obj, [itm.value]: itm.color }
  }, {});


export const DEFAULT_PAGE_ATTRIBUTES = ['title', 'handle', 'status']

export const PAGE_KEYS_BY_TYPE = {
  [SiteEntityType.PAGE]: [...DEFAULT_PAGE_ATTRIBUTES, 'image'],
  [SiteEntityType.PROJECT]: [...DEFAULT_PAGE_ATTRIBUTES, 'images', 'sector', 'featured'],
  [SiteEntityType.POST]: [...DEFAULT_PAGE_ATTRIBUTES, 'image', 'category', 'featured', 'content'],
  [SiteEntityType.TEAM]: [ 'name', 'image', 'jobTitle', 'bio', 'linkedIn'],
}


export const getDefaultDoc = (entityType:SiteEntityType) => {
      const globalDefaults:PageDoc = { type: entityType, title: null, handle: null, image: null, publishedAt: null, updatedAt: Date.now(), createdAt: Date.now(), savedAt: 0, status: EntityStatus.DRAFT };
      if (entityType === SiteEntityType.TEAM) {
            delete globalDefaults.status;
            delete globalDefaults.title;
            delete globalDefaults.handle;
      }
      if (entityType === SiteEntityType.PROJECT) {
            delete globalDefaults.image;
      }
      const defaultDocs: { [key: string]: PageDoc | PageDoc_Team | PageDoc_Post | PageDoc_Project } = {
            [SiteEntityType.PAGE]: { ...globalDefaults, blocks: [] },
            [SiteEntityType.PROJECT]: { ...globalDefaults, sector:'', location: {state: 'IL', city: null}, images: null },
            [SiteEntityType.POST]: { ...globalDefaults,  },
            [SiteEntityType.TEAM]: { ...globalDefaults, name: null, jobTitle: null, bio: '', linkedIn: null },
      }
      if (!!!defaultDocs[entityType]) return null;
      return defaultDocs[entityType];
}

export enum SiteMediaType {
      IMAGE = 'image',
      PDF = 'pdf',
      VIMEO = 'vimeo',
      VIDEO = 'video',
}