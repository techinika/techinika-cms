"use client";

import { useMemo } from "react";
import { LayoutDashboard, Send, UserPlus } from "lucide-react";
import { Tile } from "@/types/main";
import SubPageTemplate from "../parts/SubPageTemplate";
import { useAuth } from "@/lib/AuthContext";

const CompanyTiles: Tile[] = [
  {
    id: "newsletter_subscribers",
    title: "Subscribers List",
    role: ["author", "admin"],
    icon: UserPlus,
    color: "bg-yellow-600",
    stats: [
      { label: "New (7d)", value: "112" },
      { label: "Unsubscribes", value: "15" },
    ],
    children: true,
  },
  {
    id: "newsletter_campaigns",
    title: "Campaigns",
    role: ["author", "admin"],
    icon: Send,
    color: "bg-cyan-600",
    stats: [
      { label: "Drafts", value: "3" },
      { label: "Sent Last Month", value: "4" },
    ],
    children: true,
  },
];

const ContentPage = () => {
  const auth = useAuth();
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
            Your role ({auth?.role}) currently has no active management tiles.
          </p>
        </div>
      </div>
    );
  }

  return <SubPageTemplate tilesToUse={CompanyTiles} page="Newsletter" />;
};

export default ContentPage;
