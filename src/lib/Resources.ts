import {
  Briefcase,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";

export const PATH_TITLE_MAP = {
  root: "Home",
  companies: "Companies List",
  content: "Content",
  newsletter: "Newsletter",
  system: "System Admin",
  users: "Users",
  articles: "Articles",
  images: "Image Library",
  technologies: "Tech Tags",
  opportunities: "Opportunities",
  subscribers: "Subscribers",
  campaigns: "Campaigns",
  queries: "Contact Queries",
  all: "All Users",
  authors: "Authors",
  managers: "Managers",
};

export const RESOURCE_CATEGORIES = {
  image: [
    "Company Logo",
    "Article Content",
    "Author Image",
    "Social Media",
    "Uncategorized",
  ],
  video: ["Tutorial", "Promo", "Webinar Clip", "Uncategorized"],
  document: ["Whitepaper", "Contract", "Internal Memo", "Uncategorized"],
};

export const DASHBOARD_STRUCTURE = {
  system_users: [
    {
      id: "all_users",
      title: "All Registered Users",
      role: ["admin"],
      icon: Users,
      color: "bg-red-600",
      stats: [
        { label: "Total", value: "188" },
        { label: "Banned", value: "2" },
      ],
      children: false,
    },
    {
      id: "authors_only",
      title: "Manage Author Role",
      role: ["admin"],
      icon: UserPlus,
      color: "bg-yellow-600",
      stats: [
        { label: "Total Authors", value: "34" },
        { label: "New (M)", value: "4" },
      ],
      children: false,
    },
    {
      id: "managers_only",
      title: "Manage Manager Role",
      role: ["admin"],
      icon: Briefcase,
      color: "bg-cyan-600",
      stats: [
        { label: "Total Managers", value: "12" },
        { label: "Inactive", value: "1" },
      ],
      children: false,
    },
  ],
};
