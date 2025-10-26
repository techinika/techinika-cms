"use client";

import React from "react";

import {
  CheckSquare,
  Clock,
  Mail,
  MousePointerClick,
  PenTool,
  Send,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { CampaignAnalyticsMetric } from "./AnalyticsCard";
import { getStatusStyles } from "@/lib/functions";
import { Campaign } from "@/types/main";

export const CampaignCard = ({ campaign }: { campaign: Campaign }) => {
  const {
    name,
    status,
    created_at,
    emails_sent,
    opens,
    clicks,
    bounces,
    conversions,
    target,
  } = campaign;

  const sent = emails_sent > 0;

  const openRate = sent ? (opens / emails_sent) * 100 : 0;
  const bounceRate = sent ? (bounces / emails_sent) * 100 : 0;
  const clickRate = sent ? (clicks / emails_sent) * 100 : 0;
  const conversionRate = sent ? (conversions / emails_sent) * 100 : 0;

  const statusStyles = getStatusStyles(status);

  return (
    <div className="bg-white rounded-xl shadow-xl hover:shadow-2xl transition duration-300 border border-gray-100 flex flex-col">
      <div className="p-5 border-b flex justify-between items-start">
        <div>
          <h3
            className="text-xl font-extrabold text-gray-900 mb-1 truncate"
            title={name}
          >
            {name}
          </h3>
          <p className="text-sm text-gray-500 flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            Target: <span className="font-semibold ml-1">{target}</span>
          </p>
        </div>
        <span
          className={`text-xs font-semibold py-1 px-3 rounded-full border ${statusStyles}`}
        >
          {status}
        </span>
      </div>

      <div className="p-5 flex-grow">
        {status === "draft" ? (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <PenTool className="w-8 h-8 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500 font-medium">Drafting in Progress</p>
            <p className="text-xs text-gray-400 mt-1">
              Metrics available after sending.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <CampaignAnalyticsMetric
              Icon={Send}
              title="Emails Sent"
              value={emails_sent}
              colorClass="text-primary"
            />
            <CampaignAnalyticsMetric
              Icon={TrendingUp}
              title="Open Rate"
              value={openRate}
              colorClass="text-green-600"
              isRate
            />
            <CampaignAnalyticsMetric
              Icon={MousePointerClick}
              title="Click Rate"
              value={clickRate}
              colorClass="text-purple-600"
              isRate
            />
            <CampaignAnalyticsMetric
              Icon={CheckSquare}
              title="Conversions"
              value={conversionRate}
              colorClass="text-yellow-600"
              isRate
            />
            <div className="col-span-2 md:col-span-4 grid grid-cols-2 gap-4">
              <CampaignAnalyticsMetric
                Icon={XCircle}
                title="Bounce Rate"
                value={bounceRate}
                colorClass="text-red-600"
                isRate
              />
              <CampaignAnalyticsMetric
                Icon={Mail}
                title="Total Conversions"
                value={conversions}
                colorClass="text-pink-600"
              />
            </div>
          </div>
        )}
      </div>

      <div className="p-5 flex justify-between items-center text-xs text-gray-500 border-t mt-auto">
        {created_at ? (
          <span className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            Sent: {new Date(created_at).toLocaleDateString()}
          </span>
        ) : (
          <span>No send date yet</span>
        )}
        <button className="text-primary font-medium">
          View Details &rarr;
        </button>
      </div>
    </div>
  );
};
