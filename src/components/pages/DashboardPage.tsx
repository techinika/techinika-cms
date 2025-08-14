// app/(dashboard)/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, Users, Eye, ArrowUpRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import Loading from "@/app/loading";
import { fetchDashboardAnalytics } from "@/supabase/CRUD/ANALYTICS";

type DashboardAnalytics = {
  totalArticles: number | null;
  totalAuthors: number | null;
  totalViews: number;
  recentArticles: {
    slug: string;
    title: string;
    views: number;
    status: string;
  }[];
};

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await fetchDashboardAnalytics();
      setAnalytics(data);
      setIsLoading(false);
    }
    loadData();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (!analytics) {
    return (
      <div className="text-center p-8 text-red-600">
        <p>
          Could not load dashboard analytics. Please check your Supabase
          connection.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Articles Card */}
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Articles
            </CardTitle>
            <FileText className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalArticles}</div>
            <p className="text-xs text-slate-500">+20.1% from last month</p>
          </CardContent>
        </Card>

        {/* Total Authors Card */}
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Authors</CardTitle>
            <Users className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalAuthors}</div>
            <p className="text-xs text-slate-500">+5 new authors this year</p>
          </CardContent>
        </Card>

        {/* Total Views Card */}
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.totalViews.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500">+19% since last week</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Articles Section */}
      <Card className="rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Articles</CardTitle>
          <Link
            href="/articles"
            className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            View All <ArrowUpRight className="h-4 w-4" />
          </Link>
        </CardHeader>
        <CardContent>
          {analytics.recentArticles && analytics.recentArticles.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analytics.recentArticles.map((article) => (
                  <TableRow key={article?.slug}>
                    <TableCell className="font-medium">
                      {article.title}
                    </TableCell>
                    <TableCell className="text-right">
                      {article.views.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {article.status}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center p-8">
              <span className="text-5xl">📝</span>
              <p className="mt-4 text-center text-slate-500">
                No articles found. Start writing your first blog post!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
