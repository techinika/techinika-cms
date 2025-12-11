import { Tile } from "@/types/main";
import Link from "next/link";

export const DashboardTile = ({
  tile,
  title,
  icon: Icon,
  color,
  stats,
}: {
  tile: Tile;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  stats: { value: string | number; label: string }[];
  onClick: () => void;
}) => {
  const url = `/${tile.id.split("_").join("/")}`;

  return (
    <Link
      href={url}
      className="block p-6 rounded-xl shadow-lg bg-white border border-gray-200 hover:border-primary transition-all duration-300 transform hover:scale-[1.01] hover:shadow-xl text-left w-full h-full"
    >
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <div className={`p-2 rounded-lg text-white ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>

      <p className="text-sm font-medium text-gray-500 mb-4">
        Click to enter this management area.
      </p>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
        {stats.map((stat, index) => (
          <div key={index} className="flex flex-col">
            <span className="text-2xl font-bold text-tech-dark">
              {stat.value}
            </span>
            <span className="text-xs text-gray-500 uppercase tracking-wider">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </Link>
  );
};
