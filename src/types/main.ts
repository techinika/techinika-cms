export type Article = {
  id: string;
  lang: string;
  created_at: string;
  title: string;
  slug: string;
  author_id: string | null;
  author: Author | null;
  category: Category | null;
  date: string;
  image: string;
  category_id: string;
  views: number;
  summary: string;
  tags: string;
  status: string;
  content: string;
  read_time: string;
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
  tags: string;
  slug: string;
  icon: string;
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

export interface UserType {
  id: string;
  created_at: string;
  lang: string;
  name: string;
  email: string;
  title: string | null;
  bio: string | null;
  image_url: string | null;
  external_link: string | null;
  username: string | null;
  location: string | null;
  x_handle: string | null;
  role: "admin" | "author" | "reader" | "manager";
  github_handle: string | null;
  linkedin_handle: string | null;
}

export interface Tile {
  id: string;
  title: string;
  role: string[];
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  stats: { label: string; value: string }[];
  children?: boolean;
}

export interface DashStructure {
  [key: string]: Tile[];
}

export interface Resource {
  id: string;
  name: string;
  type: "image" | "video" | "document" | "audio" | "other";
  category: string;
  sizeKB: number;
  url: string;
  uploaded_at: string;
  uploaded_by: string;
}

export interface ResourceType {
  [key: string]: string;
}

export interface Subscriber {
  id: string;
  email: string;
  created_at: string;
  subscribed: boolean;
}

export interface Campaign {
  id: string;
  fromName: string;
  name: string;
  created_at: string;
  scheduled_at: string | null;
  sent_at: string | null;
  status: "draft" | "scheduled" | "sent" | "canceled";
  subject: string;
  content: string;
  total_recipients: number;
  preview_html: string;
  emails_sent: number;
  emails_opened: number;
  links_clicked: number;
  unsubscribes: number;
  bounces: number;
  opens: number;
  clicks: number;
  conversions: number;
  scheduled_for: string;
  target: string;
  content_structure: { articles: Article[]; opportunities: Opportunity[] };
}

export interface Opportunity {
  id: string;
  title: string;
  slug: string;
  type: "Job" | "Tender" | "Grant" | "Internship" | "Other";
  organization?: string | null;
  companyId?: string | null;
  company: FeaturedStartup | null;
  location: string;
  salary?: string | null;
  application_link?: string | null;
  contact_email?: string | null;
  tags?: string[];
  description: string;
  full_description: string;
  requirements?: string | null;
  benefits?: string | null;
  status: string;
  featured: boolean;
  views: number;
  created_at: string;
  updated_at: string;
  expires_at?: string;
  seo_description?: string | null;
  hints: {
    bestCandidate: string;
    winningTips: string[];
  };
}

export interface Querry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  feedback: string;
  created_at: string;
}

export interface Category {
  id: string;
  created_at: string;
  lang: string;
  name: string;
}

export interface ResourceMetadata {
  cacheControl: string;
  contentLength: number;
  eTag: string;
  httpStatusCode: number;
  lastModified: string;
  mimetype: string;
  size: number;
}

export interface ResourceFile {
  id: string;
  name: string;
  category: string;
  url: string;
  created_at: string;
  updated_at: string;
  last_accessed_at: string;
  metadata: ResourceMetadata;
}

export interface ResourceCategory {
  bucket: string;
  resources: ResourceFile[];
}
