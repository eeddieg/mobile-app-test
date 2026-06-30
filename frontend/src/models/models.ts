// export interface Todo {
//   id: number;
//   content: string;
// }

// export interface Meta {
//   totalCount: number;
// }

export interface WPPost {
  id: number
  date: string
  slug: string
  link: string
  title: {
    rendered: string
  }
  excerpt: {
    rendered: string
    protected: boolean
  }
  content: {
    rendered: string
    protected: boolean
  }
}

export interface WPPostExtended extends WPPost {
  uagb_featured_image_src?: {
    full?: [string, number, number, boolean]
    large?: [string, number, number, boolean]
    medium_large?: [string, number, number, boolean]
  }
}

export interface MediaCarouselResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: MediaItem[];
}

export interface RenderedField {
  rendered: string;
}

export interface MediaSize {
  file: string;
  width: number;
  height: number;
  filesize: number;
  mime_type: string;
  source_url: string;
}
export interface MediaDetails {
  width: number;
  height: number;
  file: string;
  filesize: number;

  sizes: {
    thumbnail?: MediaSize;
    medium?: MediaSize;
    medium_large?: MediaSize;
    large?: MediaSize;
    full: MediaSize;
    [key: string]: MediaSize | undefined;
  };

  image_meta: ImageMeta;
}

export interface ImageMeta {
  aperture: string;
  credit: string;
  camera: string;
  caption: string;
  created_timestamp: string;
  copyright: string;
  focal_length: string;
  iso: string;
  shutter_speed: string;
  title: string;
  orientation: string;
  keywords: string[];
}

export interface MediaMeta {
  [key: string]: unknown;
}

export interface WordPressLinks {
  self: LinkItem[];
  collection: LinkItem[];
  about: LinkItem[];
  author: LinkItem[];
  replies: LinkItem[];
}

export interface LinkItem {
  href: string;
  embeddable?: boolean;
  targetHints?: {
    allow: string[];
  };
}
export interface MediaItem {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: RenderedField;
  caption: RenderedField;
  description: RenderedField;
  alt_text: string;
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  template: string;
  guid: {
    rendered: string;
  };
  media_type: string;
  mime_type: string;
  source_url: string;
  filename: string;
  filesize: number;
  class_list: string[];
  post: number | null;
  media_details: MediaDetails;
  meta: MediaMeta;
  _links: WordPressLinks;
}

export interface CarouselSlide {
  id: number;
  title: string;
  alt: string;
  imageUrl: string;
}

export interface WpPage {
  id: number
  slug: string
  link: string
  title:   { rendered: string }
  content: { rendered: string }
  excerpt: { rendered: string }
  menu_order: number
  parent: number
  modified: string
  status: 'publish' | 'draft'
}
