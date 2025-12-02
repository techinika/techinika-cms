import { TrendingUp } from "lucide-react";
import React from "react";

type AnalyticsCardProps = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  value: React.ReactNode;
  unit?: string;
  color?: string;
};

const formatRate = (rate: number) => rate.toFixed(2) + "%";
const formatNumber = (num: number) => num.toLocaleString();

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  icon: Icon,
  title,
  value,
  unit,
  color,
}) => (
  <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100 transition-all hover:ring-2 hover:ring-offset-2 hover:ring-primary/50">
    <div className={`flex items-center justify-between`}>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <span className="text-2xl font-bold text-gray-900">{value}</span>
    </div>
    <p className="text-sm font-medium text-gray-500 mt-3">{title}</p>
    {unit && <p className="text-xs text-gray-400">{unit}</p>}
  </div>
);

export const SubAnalyticsCard = ({
  title,
  value,
  icon: Icon,
  colorClass,
  increase,
}: {
  title: string;
  value: React.ReactNode;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  colorClass: string;
  increase?: number;
}) => (
  <div
    className="bg-white p-6 rounded-xl shadow-lg border-l-4"
    style={{ borderColor: colorClass }}
  >
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-extrabold text-gray-900 mt-1">{value}</p>
      </div>
      <div
        className={`p-3 rounded-full bg-opacity-20`}
        style={{ backgroundColor: `${colorClass}20` }}
      >
        <Icon className="w-6 h-6" style={{ color: colorClass }} />
      </div>
    </div>
    {increase !== undefined && (
      <div className="mt-4 flex items-center text-sm">
        <TrendingUp
          className={`w-4 h-4 mr-1 ${
            increase > 0 ? "text-green-500" : "text-gray-500"
          }`}
        />
        <span
          className={`${
            increase > 0 ? "text-green-600 font-semibold" : "text-gray-600"
          }`}
        >
          {increase} new this month
        </span>
      </div>
    )}
  </div>
);

export const CampaignAnalyticsMetric = ({
  Icon,
  title,
  value,
  colorClass,
  isRate = false,
}: {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  value: number;
  colorClass: string;
  isRate?: boolean;
}) => (
  <div className="flex flex-col items-center p-3 border rounded-lg bg-white shadow-sm hover:shadow-md transition">
    <Icon className={`w-6 h-6 mb-1 ${colorClass}`} />
    <span className="text-sm font-bold text-gray-800">
      {isRate ? formatRate(value) : formatNumber(value)}
    </span>
    <span className="text-xs text-gray-500 mt-0.5">{title}</span>
  </div>
);
