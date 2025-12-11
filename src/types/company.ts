import { IconNode } from "lucide-react";

export interface MenuCompanyCard {
  id: string;
  title: string;
  role: string[];
  icon: IconNode;
  color: string;
  stats: { label: string; value: string | number }[];
  children: boolean;
}

export interface Company {
  id: string;
  created_at: string;
  lang: string;
  name: string;
  country: string;
  logo_url: string | null;
  description: string;
  learn_more_links: string[] | null;
  industry: string;
  location: string;
  avg_rating: number;
  reviews_count: number;
  status: string;
  roles: string[];
  is_featured: boolean;
  website: string;
  email: string;
  tags: string;
  slug: string;
}

export const COMPANY_STATUSES = ["Active", "Hiring", "Dormant", "Acquired"];
