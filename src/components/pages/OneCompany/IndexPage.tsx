"use client";

import React, { useMemo } from "react";
import {
  LayoutDashboard,
  Activity,
  Users,
  Zap,
} from "lucide-react";
import { Tile } from "@/types/main";
import SubPageTemplate from "@/components/parts/SubPageTemplate";
import { useAuth } from "@/lib/AuthContext";

const CompanyTiles: Tile[] = [
  {
    id: "company_a_opportunities",
    title: "Opportunities",
    role: ["manager", "admin"],
    icon: Activity,
    color: "bg-sky-500",
    stats: [
      { label: "Open", value: "8" },
      { label: "Closed (30d)", value: "4" },
    ],
    children: false,
  },
  {
    id: "company_a_users",
    title: "Company Users",
    role: ["manager", "admin"],
    icon: Users,
    color: "bg-fuchsia-500",
    stats: [
      { label: "Total", value: "15" },
      { label: "Active (24h)", value: "11" },
    ],
    children: false,
  },
  {
    id: "company_a_events",
    title: "Company Events",
    role: ["manager", "admin"],
    icon: Zap,
    color: "bg-orange-500",
    stats: [
      { label: "Upcoming", value: "3" },
      { label: "Completed (Q)", value: "7" },
    ],
    children: false,
  },
];

const IndexPage = () => {
  const auth = useAuth()
  const filteredTiles = useMemo(() => {
    const tiles = CompanyTiles || [];

    return tiles.filter((tile: Tile) => tile.role.includes(auth?.role ?? ""));
  }, [auth]);

  if (filteredTiles.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 md:p-10 flex flex-col items-center justify-center">
        <div className="text-center">
          <LayoutDashboard className="mx-auto h-16 w-16 text-orange-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800">
            No Dashboard Items Found
          </h1>
          <p className="mt-2 text-gray-600">
            Your role ({auth?.role}) currently has no active management
            tiles.
          </p>
        </div>
      </div>
    );
  }

  return (
    <SubPageTemplate tilesToUse={CompanyTiles} page="Company A"/>
  );
};

export default IndexPage;
