"use client";

import React from "react";
import { ArrowLeft, ArrowRight, Filter } from "lucide-react";

import { JoinedArticle } from "@/types/main";
import { ArticleRow } from "./Rows";

interface ArticleListProps {
  articles: JoinedArticle[];
  itemsPerPage: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export const ArticleList = ({
  articles,
  itemsPerPage,
  currentPage,
  setCurrentPage,
}: ArticleListProps) => {
  const totalItems = articles.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const currentArticles = articles.slice(start, end);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (totalItems === 0) {
    return (
      <div className="text-center p-16 bg-gray-50 border border-dashed border-gray-300 rounded-xl">
        <Filter className="w-10 h-10 mx-auto text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-700">
          No articles match your current filters.
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Try broadening your filters or create a new article.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="font-bold text-gray-500 uppercase text-xs p-4 flex border-b border-gray-100 bg-gray-50">
        <div className="w-5/12">Title / Author</div>
        <div className="w-2/12 hidden sm:block">Status</div>
        <div className="w-2/12 hidden md:block">Created</div>
        <div className="w-2/12 hidden lg:block">Views</div>
        <div className="w-1/12 text-right">Actions</div>
      </div>

      <div>
        {currentArticles.map((article) => (
          <ArticleRow key={article?.id} article={article} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center p-4 border-t border-gray-100">
          <div className="text-sm text-gray-600">
            Showing {start + 1} to {Math.min(end, totalItems)} of {totalItems}{" "}
            results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="flex items-center px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="flex items-center px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition"
            >
              Next <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
