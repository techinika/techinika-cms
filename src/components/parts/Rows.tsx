"use client";

import React from "react";

import { JoinedArticle } from "@/types/main";

export const ArticleRow = ({ article }: { article: JoinedArticle }) => {
  const statusClasses: Record<string, string> = {
    published: "bg-green-100 text-green-800 border-green-300",
    draft: "bg-yellow-100 text-yellow-800 border-yellow-300",
    archived: "bg-gray-100 text-gray-600 border-gray-300",
    cancelled: "bg-red-100 text-red-800 border-red-300",
  };

  const date = new Date(article.created_at).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex items-center p-4 border-b border-gray-100 hover:bg-gray-50 transition">
      <div className="w-5/12 min-w-[150px] pr-4">
        <h3
          className="font-semibold text-gray-800 truncate"
          title={article.title}
        >
          {article.title}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          <span className="font-medium text-primary">
            {article?.category?.name}
          </span>
          <span className="mx-2">•</span>
          {article?.author?.name}
        </p>
      </div>

      <div className="w-2/12 hidden sm:block">
        <span
          className={`text-xs font-medium px-3 py-1 rounded-full border ${
            statusClasses[article?.status]
          }`}
        >
          {article.status}
        </span>
      </div>

      <div className="w-2/12 hidden md:block text-sm text-gray-600">{date}</div>

      <div className="w-2/12 hidden lg:block text-sm text-gray-600">
        {article.views.toLocaleString()} views
      </div>

      <div className="w-1/12 flex justify-end space-x-2 text-sm">
        <button className="text-primary hover:text-blue-800 font-medium">
          Edit
        </button>
        <button className="text-red-600 hover:text-red-800 font-medium">
          Delete
        </button>
      </div>
    </div>
  );
};
