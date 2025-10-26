"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Plus, Search, Filter } from "lucide-react";
import { ResourceCard } from "@/components/parts/ResourceCard";
import { AddResourceModal } from "@/components/parts/AddResourceModal";
import { ResourceFile } from "@/types/main";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { getResources } from "@/supabase/CRUD/GET";

const RESOURCE_CATEGORIES = [
  "articles",
  "technology",
  "companies",
  "authors",
  "article-videos",
];

export const ResourceLibraryPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resources, setResources] = useState<ResourceFile[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getResources([
          "articles",
          "companies",
          "technology",
          "authors",
          "article-videos",
        ]);
        setResources(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const filteredAndSortedResources = useMemo(() => {
    let filtered = resources;

    if (filterType !== "all") {
      filtered = filtered.filter((r) => r?.metadata?.mimetype === filterType);
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter((r) => r.category === filterCategory);
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((r) =>
        r.name.toLowerCase().includes(searchLower)
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return Date.parse(b.created_at) - Date.parse(a.created_at);
        case "oldest":
          return Date.parse(a.created_at) - Date.parse(b.created_at);
        case "name":
          return a.name.localeCompare(b.name);
        case "size":
          return b?.metadata?.size - a?.metadata?.size;
        default:
          return 0;
      }
    });

    return filtered;
  }, [resources, filterType, filterCategory, searchTerm, sortBy]);

  const uniqueCategories = useMemo(() => {
    const categories = ["all"];
    if (filterType === "all") {
      Object.values(RESOURCE_CATEGORIES).forEach((cats) => {
        categories.push(...cats);
      });
    } else {
      categories.push(...(RESOURCE_CATEGORIES || []));
    }
    return [...new Set(categories)].sort();
  }, [filterType]);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 bg-white rounded-xl">
      <Breadcrumb />
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
        Resource Library
      </h1>
      <p className="text-gray-500 mb-6">
        Central repository for all static media assets (Mock Data Mode).
      </p>

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-3 md:space-y-0">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary transition w-full md:w-auto"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Resource (Mock)
        </button>
        <div className="text-lg font-medium text-gray-600">
          Showing {filteredAndSortedResources.length} of {resources.length}{" "}
          Total
        </div>
      </div>

      {/* Filtering Controls */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl mb-8 border border-gray-100">
        {/* Search */}
        <div className="col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Filter by Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        <select
          value={filterType}
          onChange={(e) => {
            setFilterType(RESOURCE_CATEGORIES | "all");
            setFilterCategory("all");
          }}
          className="block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary p-2.5"
        >
          <option value="all">All Types</option>
          <option value="image">Image</option>
          <option value="video">Video</option>
          <option value="document">Document</option>
        </select>

        {/* Filter by Category */}
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary p-2.5"
        >
          <option value="all">All Categories</option>
          {uniqueCategories
            .filter((c) => c !== "all")
            .map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
        </select>

        {/* Sort By */}
        <div className="col-span-2 md:col-span-1">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary p-2.5"
          >
            <option value="newest">Sort by Newest</option>
            <option value="oldest">Sort by Oldest</option>
            <option value="name">Sort by Name (A-Z)</option>
            <option value="size">Sort by Size (Large)</option>
          </select>
        </div>
      </div>

      {/* Resources Grid */}
      {filteredAndSortedResources.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredAndSortedResources.map((resource) => (
            <div key={resource?.id}>
              <ResourceCard resource={resource} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-16 bg-gray-50 border border-dashed border-gray-300 rounded-xl">
          <Filter className="w-10 h-10 mx-auto text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-700">
            No resources match your current filters.
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Try broadening your search or check your inputs.
          </p>
        </div>
      )}

      <AddResourceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
