import { CardStyle, CARD_STYLES } from "../@site-library/site-shared/card/card.component";
import { DbQueryObject } from "../services/db.service";
import { DefaultDoc, SiteCollectionType, MediaDoc } from "./docs";

export const entityOptions = {
      status: {
            options: [
                  { value: 'published', label: 'Published', color: 'green-400' },
                  { value: 'draft', label: 'Draft', color: 'yellow-400' },
                  { value: 'hidden', label: 'Hidden', color: 'gray-300' },
                  { value: 'archived', label: 'Archived', color: 'red-500' },
            ],
            default: 'draft'
      }
}


export enum BlockType {
      WYSIWYG = 'wysiwyg',
      CARD = 'card',
      COLLECTION = 'collection',
      CAROUSEL = 'carousel',
}

export const BLOCK_TYPES: BlockType[] = Object.values(BlockType);


export interface ContentBlock extends DefaultDoc{
      blockType: BlockType;
      title?: string;
      text?: string;
      link?: string;
      linkText?: string;
      image?: MediaDoc;
      vimeoId?: string;
      aspectRatio?: string;
      classes?: {
            title?: string;
            text?: string;
            block?: string;
            content?: string;
            [key: string]: string;
      };
      /* card */
      isTestimonial?: boolean;
      /* carousel */
      slides?: ContentBlock[];
      autoplay?: number;
      arrows?: boolean;
      dots?: boolean;
      /* wysiwyg */
      content?: string;
      /* collection */
      collectionType?: 'manual' | 'query';
      items?: any[];
      query?: DbQueryObject;
      collection?: SiteCollectionType;
}




export enum BlockOptionKey {
      WIDTH = 'width',
      PADDING = 'padding',
      MEDIA = 'media',
      TITLE = 'title',
      TEXT = 'text',
      LINK_TEXT = 'linkText',
      LINK = 'link',
      VIMEO_ID = 'vimeoId',
      ASPECT_RATIO = 'aspectRatio',
      HANDLE = 'handle',
      BLOCKS = 'blocks',
      REDIRECTS = 'redirects'
}

export type BlockInputType = BlockOptionKey | CustomInputType;

export enum BlockOption_CustomInputType {
      TEXT_SIZE = 'textSize',
      ASPECT_RATIO = 'aspectRatio',
      WIDTH = 'width',
      SPACING = 'spacing',
      PADDING = 'padding',
      ALIGN_TEXT = 'alignText',
      ALIGN_CONTENT = 'alignContent',
      COLOR = 'colors',
      LINK = 'link',
      MEDIA = 'media',
      STATUS = 'status',
      STATUS_BUTTONS = 'statusButtons',
}


export enum CustomInputType {
      ICONS = 'icons',
      TOGGLE = 'toggle',
      TEXTAREA = 'textarea',
      WYSIWYG = 'wysiwyg',
      TEXT = 'text',
      NUMBER = 'number',
      SIMPLE_TEXT = 'simple-text',
      SLIDER = 'slider',
      ICON_CHECKBOX = 'iconCheckbox',
      IMAGE = 'image',
      IMAGES = 'images',
      VIMEO = 'vimeoSrc',
      SELECT = 'select',
}
export interface BlockOption_InputOption {
      label: string;
      value: any;
      optionType: BlockInputType;
      options?: { value: any, label: string, icon?: string }[];
      DEFAULT?: any;
}


export const defaultContentBlock = (blockType, subType: CardStyle | 'carouselSlide' | 'manual' | 'query' = null) => {
      const DEFAULT_VALUES = {
            textClasses: 'text-sm sm:text-base md:text-base',
            manualCollection: { items: [] },
            queryCollection: { path: null, limit: 6, query: null },
      }
      const DEFAULT_CLASSES = {
            [BlockType.CARD]: {
                  carouselSlide: { title: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl', block: 'col-span-12', width: 'col-span-12', text: DEFAULT_VALUES.textClasses },
                  [CardStyle.OVERLAY]: { title: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl', block: 'col-span-6', width: 'col-span-6', text: DEFAULT_VALUES.textClasses },
                  [CardStyle.TESTIMONIAL]: { title: `${DEFAULT_VALUES.textClasses} font-serif`, block: 'col-span-6', width: 'col-span-6', text: DEFAULT_VALUES.textClasses },
                  [CardStyle.TEXT]: { title: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl', block: 'col-span-6', width: 'col-span-6', text: DEFAULT_VALUES.textClasses },
            },
            [BlockType.WYSIWYG]:{
                  block: 'col-span-12',
                  content: 'New text block...'
            },
            [BlockType.COLLECTION]:{
                  block: 'col-span-12',
                  content: 'grid grid-cols-2 gap-4',
            },
            [BlockType.CAROUSEL]: {
                  block: 'col-span-12 md:col-span-12',
                  width: 'col-span-12 md:col-span-12',
            },
      }
      const DEFAULTS_BLOCKS: { [key: string]: ContentBlock } = {
            [BlockType.CARD]: {
                  blockType,
                  classes: DEFAULT_CLASSES[BlockType.CARD][subType],
                  title: 'New...', text: null, image: null,
                  link: null, linkText: null,
                  aspectRatio: !!subType && [CardStyle.TESTIMONIAL, 'carouselSlide'].includes(subType) ? null : '1:1',
                  isTestimonial: subType === CardStyle.TESTIMONIAL
            },
            [BlockType.COLLECTION]: {
                  blockType,
                  ...DEFAULT_VALUES[`${subType}Collection`],
                  collectionType: subType === 'query' ? 'query' : 'manual',
                  classes: DEFAULT_CLASSES[BlockType.COLLECTION]
            },
            [BlockType.WYSIWYG]: {
                  blockType, content: '...',
                  classes: DEFAULT_CLASSES[BlockType.WYSIWYG]
            },
            [BlockType.CAROUSEL]: {
                  blockType, slides: [],
                  aspectRatio: '6:4',
                  classes: DEFAULT_CLASSES[BlockType.CAROUSEL]
            }
      }

      return DEFAULTS_BLOCKS[blockType]
}