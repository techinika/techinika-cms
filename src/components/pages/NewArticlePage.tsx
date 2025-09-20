// app/articles/new/page.tsx
"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import RichTextEditor from "../parts/RichEditor";
import { Textarea } from "../ui/textarea";
import { createArticle } from "@/supabase/CRUD/INSERT";

// Use types from the main types file to ensure compatibility
import type { Article, Author, Category } from "@/types/main";
import { useAuth } from "@/lib/AuthProvider";

const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
};

export default function CreateArticlePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<Partial<Article>>({
    title: "",
    slug: "",
    author_id: user?.id,
    category_id: "",
    date: new Date().toISOString().split("T")[0],
    image: "",
    summary: "",
    tags: "",
    status: "draft",
    content: "",
    views: 0,
    read_time: "5 min read",
    table_of_contents: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "title" && { slug: generateSlug(value) }),
    }));
  };

  const handleContentChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      content: value,
    }));
  };

  const handleSelectStatusChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      status: value as "draft" | "published" | "archived",
    }));
  };

  const handleSelectAuthorChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      author_id: value,
    }));
  };

  const handleSelectCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category_id: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const newArticle: Article = {
      ...formData,
      title: formData.title || "",
      slug: formData.slug || generateSlug(formData.title || ""),
      author_id: formData.author_id || user?.id,
      category_id: formData.category_id || "default_category_id",
      date: formData.date || new Date().toISOString().split("T")[0],
      image:
        formData.image ||
        "https://placehold.co/1200x600/E5E7EB/4B5563?text=Article+Image",
      summary: formData.summary || "",
      tags: formData.tags || "",
      views: formData.views || 0,
      status: formData.status || "draft",
      content: formData.content || "",
      read_time: formData.read_time || "5 min read",
      author: null,
      category: null,
      table_of_contents: formData.table_of_contents || [],
    };

    const { success, error: createError } = await createArticle(newArticle);

    if (success) {
      router.push("/articles");
    } else {
      setError(createError || "Failed to create article. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-4">
        <Link href="/articles">
          <Button variant="outline" size="icon" className="rounded-full">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">
          Create New Article
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
        <div className="flex-grow space-y-6">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Article Content</CardTitle>
            </CardHeader>
            <CardContent>
              {error && <p className="text-red-500">{error}</p>}
              <div className="grid gap-2 mb-6">
                <label htmlFor="title">Title</label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter article title"
                  required
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="content-editor">Content</label>
                <RichTextEditor
                  value={formData.content || ""}
                  onChange={handleContentChange}
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-2xl mt-6"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Create Article"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:w-80 space-y-6">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Article Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Author Selection */}
              <div className="grid gap-2">
                <label htmlFor="author-select">Author</label>
                <Select
                  value={formData.author_id}
                  onValueChange={handleSelectAuthorChange}
                  disabled={!user?.is_admin}
                >
                  <SelectTrigger id="author-select">
                    <SelectValue placeholder="Select an author" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {user?.is_admin ? (
                        // If admin, show all authors
                        authors.map((author) => (
                          <SelectItem key={author.id} value={author.id}>
                            {author.name}
                          </SelectItem>
                        ))
                      ) : (
                        // If not admin, show only their own name
                        <SelectItem key={user?.id} value={user?.id ?? ""}>
                          {user?.name}
                        </SelectItem>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Category Selection */}
              <div className="grid gap-2">
                <label htmlFor="category-select">Category</label>
                <Select
                  value={formData.category_id}
                  onValueChange={handleSelectCategoryChange}
                >
                  <SelectTrigger id="category-select">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <label htmlFor="slug">Slug</label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  readOnly
                  placeholder="slug-will-be-auto-generated"
                  className="bg-slate-100"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="summary">Summary</label>
                <Textarea
                  id="summary"
                  name="summary"
                  value={formData.summary}
                  onChange={handleInputChange}
                  placeholder="A short summary of the article"
                  required
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="image">Image URL</label>
                <Input
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="tags">Tags (comma-separated)</label>
                <Input
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="Next.js, Supabase, Tailwind"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="status">Status</label>
                <Select
                  value={formData.status}
                  onValueChange={handleSelectStatusChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
