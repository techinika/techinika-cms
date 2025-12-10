"use client";

import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  CornerUpLeft,
  Feather,
  Send,
  Plus,
} from "lucide-react";
import { DashboardTile } from "../parts/DashboardTile";
import { useRouter } from "next/navigation";
import { handleTileClick } from "@/lib/functions";
import { Tile } from "@/types/main";
import { useAuth } from "@/lib/AuthContext";
import { getArticlesStats } from "@/supabase/CRUD/GET/getNumbers";
import { ContentStats } from "@/types/stats";
import { getUserOrganizations } from "@/supabase/CRUD/GET/getOrganizations";
import { mapCompaniesToCards } from "@/lib/utils";
import Loading from "@/app/loading";

const MainPage = () => {
  const auth = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<ContentStats>({
    totalArticles: 0,
    monthlyArticles: 0,
    drafts: 0,
    totalSubscribers: 0,
  });
  const [companies, setCompanies] = useState<Tile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStats = async () => {
      if (!auth?.user) return;

      try {
        setLoading(true);

        const data = await getArticlesStats();
        const rawCompanies = await getUserOrganizations(auth?.user?.id);
        const mapped = mapCompaniesToCards(rawCompanies);

        setStats(data);
        setCompanies(mapped);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getStats();
  }, [auth?.user]);

  const filteredTiles = useMemo(() => {
    const MainTiles: Tile[] = [
      {
        id: "content",
        title: "Content Drafting",
        role: ["author", "admin"],
        icon: Feather,
        color: "bg-emerald-600",
        stats: [
          { label: "All Articles", value: `${stats?.totalArticles}` },
          { label: "Published Last Month", value: `${stats?.monthlyArticles}` },
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
          { label: "Subscribers", value: `${stats?.totalSubscribers}` },
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
      ...companies,
    ];
    const tiles = MainTiles || [];

    return tiles.filter((tile: Tile) => tile.role.includes(auth?.role ?? ""));
  }, [auth?.role, stats, companies]);

  if (loading) return <Loading />;

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

  if (!auth) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-tech-dark">
            Welcome back, {auth?.user?.email}!
            <span className="text-xl font-semibold text-gray-500 ml-3 capitalize">
              ({auth?.role})
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
            {auth?.role.toLowerCase() === "manager" && (
              <div className="p-6 rounded-xl shadow-lg bg-white border border-gray-200 hover:border-primary transition-all duration-300 transform hover:scale-[1.01] hover:shadow-xl w-full h-full flex items-center justify-center flex-col cursor-pointer">
                <Plus className="h-15 w-15 text-primary" />

                <p className="text-xl font-bold text-primary mb-4">
                  Add a New Company
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center p-12 bg-white rounded-xl shadow-lg border border-gray-200">
            <CornerUpLeft className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-xl font-bold text-gray-700">
              No Modules Available
            </h2>
            <p className="mt-2 text-gray-500">
              There are no available sections for your current role{" "}
              <b>({auth?.role})</b> at this level.
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
