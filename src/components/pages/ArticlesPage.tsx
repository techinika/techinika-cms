// app/articles/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Search } from "lucide-react";
import Loading from "@/app/loading";
import { fetchArticles } from "@/supabase/CRUD/GET";

type Article = {
  slug: string;
  status: string;
  created_at: string;
  views: number;
  title: string;
};

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    async function loadArticles() {
      setIsLoading(true);
      const { success, data } = await fetchArticles({
        query: searchQuery,
        status: filterStatus,
      });

      if (success) {
        setArticles(data);
      }
      setIsLoading(false);
    }
    loadArticles();
  }, [searchQuery, filterStatus]);

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Articles</h1>

      <div className="flex items-center gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            type="text"
            placeholder="Search articles by title..."
            className="w-full pl-9 rounded-2xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px] rounded-2xl">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl">
            <SelectGroup>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Published">Published</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Archived">Archived</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Link href="/articles/new">
          <Button className="rounded-2xl flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            New Article
          </Button>
        </Link>
      </div>

      <div className="rounded-2xl overflow-hidden shadow-sm border">
        {isLoading ? (
          <Loading />
        ) : articles.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead className="text-right">Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article) => (
                <TableRow key={article.slug}>
                  <TableCell className="font-medium">
                    {article?.title}
                  </TableCell>
                  <TableCell>{article.status}</TableCell>
                  <TableCell className="text-right">
                    {article.views.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {new Date(article.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center p-8">
            <span className="text-5xl">🤷‍♂️</span>
            <p className="mt-4 text-center text-slate-500">
              No articles match your search or filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
