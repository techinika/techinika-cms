"use client";

import React, { useMemo } from "react";
import { LayoutDashboard, Zap, Briefcase, Feather } from "lucide-react";
import { MOCK_USER } from "@/lib/utils";
import { Tile } from "@/types/main";
import SubPageTemplate from "../parts/SubPageTemplate";

const CompanyTiles: Tile[] = [
  {
    id: "content_articles",
    title: "Manage Articles",
    role: ["author", "admin"],
    icon: Feather,
    color: "bg-emerald-600",
    stats: [
      { label: "In Review", value: "5" },
      { label: "Total", value: "150" },
    ],
    children: true,
  },
  {
    id: "content_library",
    title: "Resource Library",
    role: ["author", "admin"],
    icon: Briefcase,
    color: "bg-indigo-600",
    stats: [
      { label: "Unused", value: "450" },
      { label: "New (7d)", value: "25" },
    ],
    children: true,
  },
  {
    id: "content_technologies",
    title: "Technologies",
    role: ["author", "admin"],
    icon: Zap,
    color: "bg-pink-600",
    stats: [
      { label: "Active Tags", value: "88" },
      { label: "Needs Cleanup", value: "12" },
    ],
    children: true,
  },
];

const ContentPage = () => {
  const filteredTiles = useMemo(() => {
    const tiles = CompanyTiles || [];

    return tiles.filter((tile: Tile) => tile.role.includes(MOCK_USER.role));
  }, []);

  if (filteredTiles.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 md:p-10 flex flex-col items-center justify-center">
        <div className="text-center">
          <LayoutDashboard className="mx-auto h-16 w-16 text-orange-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800">
            No Dashboard Items Found
          </h1>
          <p className="mt-2 text-gray-600">
            Your role ({MOCK_USER.role}) currently has no active management
            tiles.
          </p>
        </div>
      </div>
    );
  }

  return <SubPageTemplate tilesToUse={CompanyTiles} page="Content" />;
};

export default ContentPage;
