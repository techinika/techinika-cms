"use client";

import React, { useState, useMemo } from "react";
import { Search, Filter, Zap } from "lucide-react";
import { TrendingTechnology } from "@/types/main";
import { TechnologyList } from "@/components/parts/TechList";
import { NewTechnologyForm } from "@/components/parts/NewTechForm";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export const MOCK_LANGUAGES = [
  { code: "english", name: "English" },
  { code: "kinyarwanda", name: "Kinyarwanda" },
];

const MOCK_TECHNOLOGIES = [
  {
    id: "tech_001",
    name: "React",
    lang: "english",
    description: "A JavaScript library for building user interfaces.",
    icon: "https://placehold.co/40x40/61DAFB/000?text=R",
    tags: "Frontend, JavaScript, Library",
    slug: "react",
    created_at: "2024-05-01T10:00:00Z",
  },
  {
    id: "tech_002",
    name: "Tailwind CSS",
    lang: "english",
    description: "A utility-first CSS framework.",
    icon: "https://placehold.co/40x40/06B6D4/fff?text=T",
    tags: "CSS, Utility, Design",
    slug: "tailwind-css",
    created_at: "2024-05-05T12:00:00Z",
  },
  {
    id: "tech_003",
    name: "Node.js",
    lang: "english",
    description: "JavaScript runtime built on Chrome's V8 engine.",
    icon: "https://placehold.co/40x40/68A063/fff?text=N",
    tags: "Backend, JavaScript, Runtime",
    slug: "nodejs",
    created_at: "2024-04-20T08:30:00Z",
  },
  {
    id: "tech_004",
    name: "TypeScript",
    lang: "english",
    description: "Superset of JavaScript that adds static types.",
    icon: "https://placehold.co/40x40/3178C6/fff?text=TS",
    tags: "Language, Type Safety, JavaScript",
    slug: "typescript",
    created_at: "2024-05-15T15:45:00Z",
  },
  {
    id: "tech_005",
    name: "PostgreSQL",
    lang: "kinyarwanda",
    description: "Powerful, open source object-relational database system.",
    icon: "https://placehold.co/40x40/336791/fff?text=PG",
    tags: "Database, SQL, Data",
    slug: "postgresql",
    created_at: "2024-04-10T11:20:00Z",
  },
  {
    id: "tech_006",
    name: "Vue.js",
    lang: "english",
    description: "The Progressive JavaScript Framework.",
    icon: "https://placehold.co/40x40/4FC08D/fff?text=V",
    tags: "Frontend, JavaScript, Framework",
    slug: "vuejs",
    created_at: "2024-03-25T09:10:00Z",
  },
  {
    id: "tech_007",
    name: "Python",
    lang: "kinyarwanda",
    description:
      "Interpreted, high-level, general-purpose programming language.",
    icon: "https://placehold.co/40x40/FFD43B/000?text=P",
    tags: "Language, Backend, AI",
    slug: "python",
    created_at: "2024-05-20T14:50:00Z",
  },
  {
    id: "tech_008",
    name: "MongoDB",
    lang: "english",
    description: "A document database platform.",
    icon: "https://placehold.co/40x40/47A248/fff?text=M",
    tags: "Database, NoSQL, Data",
    slug: "mongodb",
    created_at: "2024-05-22T16:00:00Z",
  },
  {
    id: "tech_009",
    name: "Sass",
    lang: "english",
    description: "A professional-grade CSS extension language.",
    icon: "https://placehold.co/40x40/CC6699/fff?text=S",
    tags: "CSS, Preprocessor, Design",
    slug: "sass",
    created_at: "2024-05-24T18:00:00Z",
  },
  {
    id: "tech_010",
    name: "Firebase",
    lang: "english",
    description: "Backend-as-a-Service platform.",
    icon: "https://placehold.co/40x40/FFCA28/000?text=F",
    tags: "Backend, BaaS, Cloud",
    slug: "firebase",
    created_at: "2024-05-28T09:45:00Z",
  },
];

const TechnologyManagementPage = () => {
  const [technologies, setTechnologies] =
    useState<TrendingTechnology[]>(MOCK_TECHNOLOGIES);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLang, setFilterLang] = useState("all");
  const [filterTag, setFilterTag] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const availableTags = useMemo(() => {
    const allTags = technologies.flatMap((t) =>
      t.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag)
    );
    return [...new Set(allTags)].sort();
  }, [technologies]);

  const filteredTechnologies = useMemo(() => {
    let filtered = technologies;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(searchLower) ||
          t.description.toLowerCase().includes(searchLower)
      );
    }

    if (filterLang !== "all") {
      filtered = filtered.filter((t) => t.lang === filterLang);
    }

    if (filterTag !== "all") {
      filtered = filtered.filter((t) =>
        t.tags
          .split(",")
          .map((tag) => tag.trim())
          .includes(filterTag)
      );
    }

    setCurrentPage(1);

    return filtered;
  }, [technologies, searchTerm, filterLang, filterTag]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb />

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Technology Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage and categorize all technical platforms used across our
            articles.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <NewTechnologyForm />
          </div>

          <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-fit">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center border-b pb-2">
              <Filter className="w-5 h-5 mr-2" /> Filters
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Search Name/Description
                </label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search technology..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              {/* Language Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Filter by Language
                </label>
                <select
                  value={filterLang}
                  onChange={(e) => setFilterLang(e.target.value)}
                  className="block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary p-2.5 mt-1"
                >
                  <option value="all">All Languages</option>
                  {MOCK_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tag Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Filter by Tag
                </label>
                <select
                  value={filterTag}
                  onChange={(e) => setFilterTag(e.target.value)}
                  className="block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary p-2.5 mt-1"
                >
                  <option value="all">All Tags</option>
                  {availableTags.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Technology List */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <Zap className="w-6 h-6 mr-2 text-yellow-600" /> Existing Technologies
          ({filteredTechnologies.length})
        </h2>
        <TechnologyList
          technologies={filteredTechnologies}
          itemsPerPage={ITEMS_PER_PAGE}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default TechnologyManagementPage;
