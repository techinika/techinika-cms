"use client";

import { useMemo } from "react";
import {
  LayoutDashboard,
  Briefcase,
  Activity,
  Building,
  Zap,
  Users,
  UserPlus,
} from "lucide-react";
import { Tile } from "@/types/main";
import SubPageTemplate from "../parts/SubPageTemplate";
import { useAuth } from "@/lib/AuthContext";

const MainTiles: Tile[] = [
  {
    id: "system_companies",
    title: "All System Companies",
    role: ["admin"],
    icon: Building,
    color: "bg-cyan-600",
    stats: [
      { label: "Total Count", value: "15" },
      { label: "Active", value: "14" },
    ],
    children: false,
  },
  {
    id: "system_opportunities",
    title: "All Opportunities",
    role: ["admin"],
    icon: Activity,
    color: "bg-orange-500",
    stats: [
      { label: "Open", value: "45" },
      { label: "New (24h)", value: "2" },
    ],
    children: false,
  },
  {
    id: "system_events",
    title: "All System Events",
    role: ["admin"],
    icon: Zap,
    color: "bg-pink-600",
    stats: [
      { label: "Upcoming", value: "12" },
      { label: "Past (Q)", value: "45" },
    ],
    children: false,
  },

  {
    id: "system_users",
    title: "Manage System Users",
    role: ["admin"],
    icon: Users,
    color: "bg-primary",
    stats: [
      { label: "Total", value: "188" },
      { label: "New (7d)", value: "8" },
    ],
    children: true,
  },
  {
    id: "system_queries",
    title: "Contact Queries",
    role: ["admin"],
    icon: Briefcase,
    color: "bg-yellow-600",
    stats: [
      { label: "Open", value: "3" },
      { label: "Closed (7d)", value: "12" },
    ],
    children: true,
  },
  {
    id: "requests",
    title: "Author Requests",
    role: ["admin"],
    icon: UserPlus,
    color: "bg-emerald-600",
    stats: [
      { label: "Pending", value: "5" },
      { label: "Rejected (M)", value: "2" },
    ],
    children: false,
  },
];

const SystemPage = () => {
  const auth = useAuth();
  const filteredTiles = useMemo(() => {
    const tiles = MainTiles || [];

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
            Your role ({auth?.role}) currently has no active management tiles.
          </p>
        </div>
      </div>
    );
  }

  return <SubPageTemplate tilesToUse={MainTiles} page="Administrator View" />;
};

export default SystemPage;
