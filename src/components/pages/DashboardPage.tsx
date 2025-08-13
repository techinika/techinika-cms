// app/(dashboard)/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, Users, Eye, ArrowUpRight, Loader2 } from "lucide-react";
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

// This is a mock function to simulate fetching data from Supabase.
// You will replace this with your actual Supabase data fetching logic.
async function fetchAnalyticsData() {
  // Simulate a network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Replace this with your Supabase calls
  // const totalArticles = await supabase.from('articles').count();
  // const totalAuthors = await supabase.from('authors').count();
  // const totalViews = await supabase.from('views').sum('count');
  // const recentArticles = await supabase.from('articles').select('*').order('created_at', { ascending: false }).limit(5);

  return {
    totalArticles: 124,
    totalAuthors: 7,
    totalViews: 34567,
    recentArticles: [
      {
        id: 1,
        title: "Getting Started with Next.js 14",
        views: 1200,
        status: "Published",
      },
      {
        id: 2,
        title: "Mastering Supabase for Full-Stack Apps",
        views: 850,
        status: "Published",
      },
      { id: 3, title: "The Power of Shadcn UI", views: 670, status: "Draft" },
      {
        id: 4,
        title: "Optimizing Your Blog for SEO",
        views: 420,
        status: "Published",
      },
      {
        id: 5,
        title: "Writing Compelling Article Titles",
        views: 310,
        status: "Draft",
      },
    ],
  };
}

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await fetchAnalyticsData();
      setAnalytics(data);
      setIsLoading(false);
    }
    loadData();
  }, []);

  if (isLoading) {
    return <Loading />;
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
                <TableRow key={article.id}>
                  <TableCell className="font-medium">{article.title}</TableCell>
                  <TableCell className="text-right">
                    {article.views.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">{article.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
