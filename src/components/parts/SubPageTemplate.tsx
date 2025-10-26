"use client";

import React, { useMemo } from "react";
import { LayoutDashboard, CornerUpLeft, Send, UserPlus } from "lucide-react";
import { MOCK_USER } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { handleTileClick } from "@/lib/functions";
import { Tile } from "@/types/main";
import { DashboardTile } from "@/components/parts/DashboardTile";
import { Breadcrumb } from "@/components/ui/breadcrumb";

const SubPageTemplate = ({
  tilesToUse,
  page,
}: {
  tilesToUse: Tile[];
  page: string;
}) => {
  const router = useRouter();

  const filteredTiles = useMemo(() => {
    const tiles = tilesToUse || [];

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
      <main className="page py-10">
        <Breadcrumb />
        <header className="mb-5">
          <h1 className="text-3xl font-extrabold text-tech-dark">
            {`You are now managing the ${page}`}!
          </h1>
          <p className="text-gray-500 mt-1">
            Select a submodule to manage detailed data.
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

export default SubPageTemplate;
