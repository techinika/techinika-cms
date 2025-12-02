"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Plus,
  Search,
  BookOpen,
  BarChart,
  Calendar,
  Feather,
  ChevronsRight,
} from "lucide-react";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Category, JoinedArticle } from "@/types/main";
import { ArticleList } from "@/components/parts/ArticlesList";
import { AnalyticsCard } from "@/components/parts/AnalyticsCard";
import Loading from "@/app/loading";
import { getCategories } from "@/supabase/CRUD/GET";
import { useAuth } from "@/lib/AuthContext";
import { getArticles } from "@/supabase/CRUD/GET/getArticle";

const ARTICLE_STATUSES = ["published", "draft", "archived", "cancelled"];

const ArticleAnalytics = ({ articles }: { articles: JoinedArticle[] }) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const analytics = useMemo(() => {
    const totalViews = articles.reduce((sum, a) => sum + a.views, 0);
    const cancelledCount = articles.filter(
      (a) => a.status === "cancelled"
    ).length;
    const publishedCount = articles.filter(
      (a) => a.status === "published"
    ).length;
    const newThisMonth = articles.filter(
      (a) => new Date(a.created_at) >= startOfMonth
    ).length;

    return {
      total: articles.length,
      published: publishedCount,
      cancelled: cancelledCount,
      newThisMonth: newThisMonth,
      totalViews: totalViews,
    };
  }, [articles, startOfMonth]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
      <AnalyticsCard
        icon={Feather}
        title="Total Articles"
        value={analytics.total}
        color="bg-blue-600"
      />
      <AnalyticsCard
        icon={BookOpen}
        title="Published Articles"
        value={analytics.published}
        color="bg-green-600"
      />
      <AnalyticsCard
        icon={ChevronsRight}
        title="New This Month"
        value={analytics.newThisMonth}
        color="bg-yellow-600"
      />
      <AnalyticsCard
        icon={BarChart}
        title="Total Views"
        value={analytics.totalViews.toLocaleString()}
        color="bg-red-600"
      />
    </div>
  );
};

export const ArticleManagementPage = () => {
  const auth = useAuth();
  const currentUser = auth?.user;

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [articles, setArticles] = useState<JoinedArticle[]>([]);
  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [fetchedArticles, fetchedCategories] = await Promise.all([
          getArticles(),
          getCategories(),
        ]);
        setArticles(fetchedArticles);
        setCategoriesList(fetchedCategories);

        console.log(fetchedArticles, fetchedCategories);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const viewableArticles: JoinedArticle[] = useMemo(() => {
    let viewable = articles;
    if (auth?.role !== "admin") {
      viewable = articles.filter((a) => a?.author?.id === currentUser?.id);
    }

    if (filterStatus !== "all") {
      viewable = viewable.filter((a) => a.status === filterStatus);
    }

    if (filterCategory !== "all") {
      viewable = viewable.filter((a) => a?.category?.id === filterCategory);
    }

    if (filterDate) {
      viewable = viewable.filter((a) => a.date === filterDate);
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      viewable = viewable.filter((a) =>
        a.title.toLowerCase().includes(searchLower)
      );
    }

    setCurrentPage(1);

    return viewable;
  }, [
    articles,
    auth?.role,
    currentUser?.id,
    filterStatus,
    filterCategory,
    filterDate,
    searchTerm,
  ]);

  const statusesList = ARTICLE_STATUSES;

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 bg-white rounded-xl">
      <Breadcrumb />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Articles Management
          </h1>
          <p className="text-gray-500 mt-1">
            {auth?.role === "admin"
              ? "Viewing all articles across the platform."
              : `Viewing your articles (ID: ${currentUser?.id}).`}
          </p>
        </div>
        <Link
          href="/content/articles/new"
          className="flex items-center px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary/50 transition w-full md:w-auto"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create New Article
        </Link>
      </div>

      <ArticleAnalytics articles={viewableArticles} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl mb-8 border border-gray-100">
        {/* Search */}
        <div className="lg:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Article Title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Filter by Status */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
        >
          <option value="all">All Statuses</option>
          {statusesList.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        {/* Filter by Category */}
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
        >
          <option value="all">All Categories</option>
          {categoriesList.map((cat) => (
            <option key={cat?.id} value={cat.id}>
              {cat?.name}
            </option>
          ))}
        </select>

        <div className="lg:col-span-1">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-700"
            />
          </div>
        </div>
      </div>

      <ArticleList
        articles={viewableArticles}
        itemsPerPage={ITEMS_PER_PAGE}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};
