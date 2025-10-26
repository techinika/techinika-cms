"use client";

import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard } from "lucide-react";
import React from "react";

export const PATH_TITLE_MAP: Record<string, string> = {
  dashboard: "Dashboard",
  companies: "Companies",
  opportunities: "Opportunities",
  articles: "Articles",
  library: "Library",
  campaigns: "Campaigns",
  subscribers: "Subscribers",
};

export const Breadcrumb: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const segments = pathname.split("/").filter((segment) => segment.length > 0);

  const handleNavigate = (index: number) => {
    const newPath = "/" + segments.slice(0, index + 1).join("/");
    router.push(newPath);
  };

  return (
    <nav className="flex items-center space-x-2 text-sm p-4 bg-white rounded-lg shadow-sm border border-gray-100 max-w-7xl mx-auto sm:px-6 lg:px-8 mb-6">
      <button
        onClick={() => router.push("/")}
        className={`flex items-center text-gray-500 hover:text-tech-primary hover:underline`}
      >
        <LayoutDashboard className="h-4 w-4 mr-2" />
        Main Lobby
      </button>

      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1;
        const title =
          PATH_TITLE_MAP[segment] ||
          segment.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

        return (
          <React.Fragment key={segment}>
            <span className="text-gray-400">/</span>
            <button
              onClick={() => !isLast && handleNavigate(index)}
              className={`transition duration-150 ${
                isLast
                  ? "text-gray-900 font-semibold cursor-default"
                  : "text-gray-500 hover:text-tech-primary hover:underline"
              }`}
              disabled={isLast}
            >
              {title}
            </button>
          </React.Fragment>
        );
      })}
    </nav>
  );
};
