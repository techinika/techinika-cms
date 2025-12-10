/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import {
  Save,
  Send,
  BookOpen,
  Clock,
  Calendar,
  User,
  Upload,
  Building,
  Zap,
  PenTool,
  Hash,
  Maximize,
  Minimize,
} from "lucide-react";
import { TagInput } from "@/components/ui/tag-input";
import { Breadcrumb } from "@/components/ui/breadcrumb";

const MOCK_AUTHORS = [
  { id: "auth_1", name: "Alex Johnson" },
  { id: "auth_2", name: "Jane Doe" },
  { id: "auth_3", name: "Mike Ross" },
];

const MOCK_CATEGORIES = [
  { id: "cat_1", name: "Technology" },
  { id: "cat_2", name: "Finance" },
  { id: "cat_3", name: "Legal" },
  { id: "cat_4", name: "Marketing" },
];

const ARTICLE_STATUSES = ["Draft", "Published", "Archived", "Cancelled"];

const INITIAL_ARTICLE_STATE = {
  title: "Draft: Optimizing Content Delivery Networks with Edge Computing",
  slug: "optimizing-cdn-edge-computing-draft-2025",
  summary:
    "A brief, 160-character summary explaining how modern CDN architectures are leveraging edge computing principles to drastically reduce latency and improve resource utilization for large-scale applications.",
  content:
    "## Introduction\n\nCDNs have evolved significantly. This section will discuss the shift from traditional caching layers to distributed, compute-capable edge nodes...",
  image: "https://placehold.co/600x300/FACC15/000?text=Featured+Image+URL",
  category_id: "cat_1", // Technology
  author_id: "auth_2", // Jane Doe
  status: "Draft",
  date: new Date().toISOString().split("T")[0],
  tags: "CDN, Edge Computing, Cloud, Infrastructure, Performance",
  companies: "Google, Amazon Web Services, Cloudflare",
  technologies: "Kubernetes, Serverless, HTTP/3",
};

const NewArticleEditorPage = () => {
  const [articleData, setArticleData] = useState(INITIAL_ARTICLE_STATE);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    const newSlug =
      name === "title"
        ? value
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
            .substring(0, 50)
        : articleData.slug;

    setArticleData((prev) => ({
      ...prev,
      [name]: value,
      slug: name === "title" ? newSlug : prev.slug,
    }));
  };

  const handleAction = (action: string) => {
    setIsSaving(true);
    console.log(`Attempting to ${action} article...`);

    setTimeout(() => {
      setIsSaving(false);
      alert(
        `Mock Success! Article ${articleData.title} was set to ${action}. Check the console for data.`
      );
      console.log("Final Article Data:", articleData);
    }, 1200);
  };

  const readTime = useMemo(() => {
    const wordsPerMinute = 200;
    const wordCount = articleData.content
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    const time = Math.ceil(wordCount / wordsPerMinute);
    return `${time} min`;
  }, [articleData.content]);

  const selectedCategory =
    MOCK_CATEGORIES.find((c) => c.id === articleData.category_id)?.name ||
    "N/A";

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10">
      <div className="max-w-7xl mx-auto sm:p-4">
        <Breadcrumb />
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold text-gray-900 ml-3">
              {articleData.title ? articleData.title : "New Article Draft"}
            </h1>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => handleAction("Draft")}
              disabled={isSaving}
              className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
            >
              <Save className="w-5 h-5 mr-2" />
              {isSaving ? "Saving..." : "Save Draft"}
            </button>
            <button
              onClick={() => handleAction("Publish")}
              disabled={isSaving}
              className="flex items-center px-6 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-blue-800 transition disabled:opacity-50"
            >
              <Send className="w-5 h-5 mr-2" />
              {isSaving ? "Publishing..." : "Publish Article"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Slug */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <label className="block mb-4">
                <span className="text-xl font-bold text-gray-800">
                  Article Title
                </span>
                <input
                  type="text"
                  name="title"
                  value={articleData.title}
                  onChange={handleInputChange}
                  className="mt-2 block w-full text-3xl font-bold p-3 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-blue-500 transition"
                  placeholder="Enter a compelling article title"
                />
              </label>

              <label className="block mt-4">
                <span className="text-sm font-semibold text-gray-700">
                  Slug (URL Path)
                </span>
                <div className="flex items-center mt-1">
                  <span className="text-gray-500 text-sm mr-2">/</span>
                  <input
                    type="text"
                    name="slug"
                    value={articleData.slug}
                    onChange={handleInputChange}
                    className="block flex-grow rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-sm bg-gray-50"
                    placeholder="article-title-goes-here"
                  />
                </div>
              </label>
            </div>

            {/* <LexicalEditorSimulation
              value={articleData.content}
              onChange={handleInputChange}
            /> */}
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 space-y-4">
              <h3 className="font-bold text-lg text-gray-800 border-b pb-2 mb-3">
                Publishing Status
              </h3>

              <label className="block">
                <span className="text-sm font-semibold text-gray-700 flex items-center mb-1">
                  <Clock className="w-4 h-4 mr-1 text-gray-500" /> Current
                  Status
                </span>
                <select
                  name="status"
                  value={articleData.status}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 text-sm"
                >
                  {ARTICLE_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-gray-700 flex items-center mb-1">
                  <Calendar className="w-4 h-4 mr-1 text-gray-500" />{" "}
                  Publication Date
                </span>
                <input
                  type="date"
                  name="date"
                  value={articleData.date}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 text-sm"
                />
              </label>

              <div className="pt-2 text-sm text-gray-600">
                <span className="font-medium">Estimated Read Time:</span>{" "}
                {readTime}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 space-y-4">
              <h3 className="font-bold text-lg text-gray-800 border-b pb-2 mb-3">
                Core Metadata
              </h3>

              <label className="block">
                <span className="text-sm font-semibold text-gray-700 flex items-center mb-1">
                  <User className="w-4 h-4 mr-1 text-gray-500" /> Author
                </span>
                <select
                  name="author_id"
                  value={articleData.author_id}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 text-sm"
                >
                  {MOCK_AUTHORS.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-gray-700 flex items-center mb-1">
                  <BookOpen className="w-4 h-4 mr-1 text-gray-500" /> Category
                </span>
                <select
                  name="category_id"
                  value={articleData.category_id}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 text-sm"
                >
                  {MOCK_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-gray-700 flex items-center mb-1">
                  <Upload className="w-4 h-4 mr-1 text-gray-500" /> Featured
                  Image URL
                </span>
                <input
                  type="url"
                  name="image"
                  value={articleData.image}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-sm"
                  placeholder="https://example.com/image.jpg"
                />
                <img
                  src={articleData.image}
                  alt="Featured Preview"
                  className="mt-2 w-full h-auto rounded-lg object-cover max-h-32"
                />
              </label>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 space-y-4">
              <h3 className="font-bold text-lg text-gray-800 border-b pb-2 mb-3">
                SEO & Context
              </h3>

              <label className="block">
                <span className="text-sm font-semibold text-gray-700 flex items-center mb-1">
                  <PenTool className="w-4 h-4 mr-1 text-gray-500" /> Article
                  Summary
                </span>
                <textarea
                  name="summary"
                  value={articleData.summary}
                  onChange={handleInputChange}
                  rows={3}
                  maxLength={300}
                  className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-sm resize-none"
                  placeholder="Write a concise summary for search engines and social media."
                />
                <div className="text-xs text-gray-500 mt-1">
                  {articleData.summary.length} / 300 characters
                </div>
              </label>

              <TagInput
                label="Keywords / Tags"
                icon={Hash}
                name="tags"
                value={articleData.tags}
                onChange={handleInputChange}
                placeholder="e.g., SEO, tech, category, etc. (comma separated)"
                infoText="Tags help categorize content internally and externally."
              />

              <TagInput
                label="Companies Mentioned"
                icon={Building}
                name="companies"
                value={articleData.companies}
                onChange={handleInputChange}
                placeholder="e.g., Google, Microsoft, Meta (comma separated)"
                infoText="List specific companies relevant to the article content."
              />

              <TagInput
                label="Technologies Mentioned"
                icon={Zap}
                name="technologies"
                value={articleData.technologies}
                onChange={handleInputChange}
                placeholder="e.g., React, AI, Blockchain (comma separated)"
                infoText="List key technological concepts or products discussed."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewArticleEditorPage;
