"use client";

import React, { useMemo, useState } from "react";
import {
  LayoutDashboard,
  CornerUpLeft,
  Briefcase,
  Feather,
  Send,
} from "lucide-react";
import { MOCK_USER } from "@/lib/utils";
import { DashboardTile } from "../parts/DashboardTile";
import { useRouter } from "next/navigation";
import { handleTileClick } from "@/lib/functions";
import { Tile } from "@/types/main";

const MainTiles: Tile[] = [
  {
    id: "content",
    title: "Content Drafting",
    role: ["author", "admin"],
    icon: Feather,
    color: "bg-emerald-600",
    stats: [
      { label: "Drafts Ready", value: "5" },
      { label: "Published Last Month", value: "12" },
    ],
    children: true,
  },
  {
    id: "newsletter",
    title: "Newsletter Studio",
    role: ["author", "admin"],
    icon: Send,
    color: "bg-yellow-600",
    stats: [
      { label: "Subscribers", value: "7.5K" },
      { label: "Open Rate", value: "45%" },
    ],
    children: true,
  },
  {
    id: "system",
    title: "System Management",
    role: ["admin"],
    icon: LayoutDashboard,
    color: "bg-red-600",
    stats: [
      { label: "Total Entities", value: "240" },
      { label: "Active Admins", value: "5" },
    ],
    children: true,
  },
  {
    id: "techinika",
    title: "Techinika",
    role: ["manager", "admin"],
    icon: Briefcase,
    color: "bg-indigo-600",
    stats: [
      { label: "QTD Revenue", value: "$85K" },
      { label: "Active Projects", value: "12" },
    ],
    children: true,
  },
];

const MainPage = () => {
  const router = useRouter();

  const filteredTiles = useMemo(() => {
    const tiles = MainTiles || [];

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

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-tech-dark">
            Welcome back, {MOCK_USER.name}!
            <span className="text-xl font-semibold text-gray-500 ml-3 capitalize">
              ({MOCK_USER.role})
            </span>
          </h1>
          <p className="text-gray-500 mt-1">
            Select your primary area of focus.
          </p>
        </header>

        {filteredTiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTiles.map((tile: Tile) => (
              <DashboardTile
                tile={tile}
                key={tile.id}
                title={tile.title}
                icon={tile.icon}
                color={tile.color}
                stats={tile.stats}
                onClick={() => handleTileClick(tile)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center p-12 bg-white rounded-xl shadow-lg border border-gray-200">
            <CornerUpLeft className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-xl font-bold text-gray-700">
              No Modules Available
            </h2>
            <p className="mt-2 text-gray-500">
              There are no available sections for your current role{" "}
              <b>({MOCK_USER.role})</b> at this level.
            </p>
            <button
              onClick={() => router.back()}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-tech-primary hover:bg-tech-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tech-primary"
            >
              Go Back
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default MainPage;
