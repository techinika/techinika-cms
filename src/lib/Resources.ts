import {
  Activity,
  Briefcase,
  Building,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";

export const COMPANY_DETAIL_TILES = [
  {
    id: "opportunities",
    title: "Opportunities Tied",
    role: ["manager", "admin"],
    icon: Activity,
    color: "bg-sky-500",
    stats: [
      { label: "Open", value: "8" },
      { label: "Closed (30d)", value: "4" },
    ],
    isGroup: false,
  },
  {
    id: "users",
    title: "Company Users",
    role: ["manager", "admin"],
    icon: Users,
    color: "bg-fuchsia-500",
    stats: [
      { label: "Total", value: "15" },
      { label: "Active (24h)", value: "11" },
    ],
    isGroup: false,
  },
  {
    id: "events",
    title: "Scheduled Events",
    role: ["manager", "admin"],
    icon: Zap,
    color: "bg-orange-500",
    stats: [
      { label: "Upcoming", value: "3" },
      { label: "Completed (Q)", value: "7" },
    ],
    isGroup: false,
  },
];

export const MOCK_COMPANY_LIST = [
  {
    id: "company-techinika",
    title: "Techinika Inc.",
    role: ["manager", "admin"],
    icon: Building,
    color: "bg-indigo-600",
    stats: [
      { label: "Projects", value: "12" },
      { label: "Employees", value: "120" },
    ],
    isGroup: true,
  },
  {
    id: "company-innovate",
    title: "Innovate Solutions",
    role: ["admin"],
    icon: Building,
    color: "bg-purple-600",
    stats: [
      { label: "Projects", value: "4" },
      { label: "Employees", value: "45" },
    ],
    isGroup: true,
  },
  {
    id: "company-future",
    title: "Future Ventures",
    role: ["manager", "admin"],
    icon: Building,
    color: "bg-teal-600",
    stats: [
      { label: "Projects", value: "25" },
      { label: "Employees", value: "300" },
    ],
    isGroup: true,
  },
];

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
