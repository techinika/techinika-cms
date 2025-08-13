// types/index.ts

/**
 * Represents an item in the article's table of contents.
 */
export type TableOfContentsItem = {
  title: string;
  level: 2 | 3; // Use 2 or 3 to represent h2 and h3 tags
  slug: string; // The URL-friendly ID for the anchor link
};

/**
 * Represents a single blog article with all its properties.
 */
export type Article = {
  title: string;
  slug: string;
  author_id: string | null;
  author: Author | null; // The author can be null if not specified
  category: Category | null; // The category can be null if not specified
  date: string;
  image: string;
  category_id: string;
  summary: string;
  tags: string;
  content: string;
  table_of_contents?: TableOfContentsItem[]; // The table of contents is optional
  read_time: string; // The read time is a string, e.g., "4 min read"
};

export interface JoinedArticle
  extends Omit<Article, "author_id" | "category_id"> {
  author: Author | null;
  category: Category | null;
}

export interface Author {
  id: string;
  created_at: string;
  lang: string;
  name: string;
  bio: string | null;
  image_url: string | null;
  external_link: string | null;
}

export interface Category {
  id: string;
  created_at: string;
  lang: string;
  name: string;
}

export interface TrendingTechnology {
  id: string;
  created_at: string;
  lang: string;
  name: string;
  description: string;
  learn_more_links: LearnMoreLink[] | null;
}

export interface LearnMoreLink {
  title: string;
  href: string;
}

export interface FeaturedStartup {
  id: string;
  created_at: string;
  lang: string;
  name: string;
  logo_url: string | null;
  description: string;
  learn_more_links: string[] | null;
}

export interface QuickByte {
  id: string;
  created_at: string;
  lang: string;
  title: string;
  content: string;
  link: string | null;
}

export interface FeaturedVideo {
  id: string;
  created_at: string;
  lang: string;
  title: string;
  url: string;
  description: string;
  learn_more_links: string[] | null;
}
