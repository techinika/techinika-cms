"use client";

import React, { useEffect, useMemo, useState } from "react";
import { LayoutDashboard, Activity, Users, Zap } from "lucide-react";
import { Tile } from "@/types/main";
import SubPageTemplate from "@/components/parts/SubPageTemplate";
import { useAuth } from "@/lib/AuthContext";
import { getCompanyStats } from "@/supabase/CRUD/GET/getStats";
import { CompanyStats } from "@/types/stats";
import Loading from "@/app/loading";

const IndexPage = ({ companySlug }: { companySlug: string }) => {
  const [companyStats, setCompanyStats] = useState<CompanyStats | null>(null);
  const CompanyTiles = useMemo<Tile[]>(
    () => [
      {
        id: `${companySlug}_opportunities`,
        title: "Opportunities",
        role: ["manager", "admin"],
        icon: Activity,
        color: "bg-sky-500",
        stats: [
          { label: "Open", value: `${companyStats?.activeOpportunities}` },
          { label: "Closed", value: `${companyStats?.closedOpportunities}` },
        ],
        children: false,
      },
      {
        id: `${companySlug}_users`,
        title: "Company Users",
        role: ["manager", "admin"],
        icon: Users,
        color: "bg-fuchsia-500",
        stats: [{ label: "Total", value: `${companyStats?.users}` }],
        children: false,
      },
      {
        id: `${companySlug}_events`,
        title: "Company Events",
        role: ["manager", "admin"],
        icon: Zap,
        color: "bg-orange-500",
        stats: [{ label: "Upcoming", value: `${companyStats?.events}` }],
        children: false,
      },
    ],
    [
      companySlug,
      companyStats?.activeOpportunities,
      companyStats?.closedOpportunities,
      companyStats?.events,
      companyStats?.users,
    ]
  );
  const auth = useAuth();
  const filteredTiles = useMemo(() => {
    const tiles = CompanyTiles || [];

    return tiles.filter((tile: Tile) => tile.role.includes(auth?.role ?? ""));
  }, [auth?.role, CompanyTiles]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getStats = async () => {
      setLoading(true);
      const stat = await getCompanyStats(companySlug);
      setCompanyStats(stat);
      setLoading(false);
    };
    getStats();
  }, [companySlug]);

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

  if (loading) return <Loading />;

  return <SubPageTemplate tilesToUse={CompanyTiles} page="Company A" />;
};

export default IndexPage;
