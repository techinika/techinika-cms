"use client";

import React, { useState, useMemo } from "react";
import {
  Mail,
  Settings,
  User,
  TrendingUp,
  Clock,
  Calendar,
  CheckCircle,
  Send,
  Edit,
  XCircle,
  Info,
  Trash2,
  Layers,
  CornerUpLeft,
  BookOpen,
  Gift,
} from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Campaign } from "@/types/main";

const getStatusStyles = (status: string) => {
  switch (status) {
    case "Sent":
      return "bg-green-600 text-white";
    case "Scheduled":
      return "bg-primary text-white";
    case "Draft":
      return "bg-gray-500 text-white";
    default:
      return "bg-gray-400 text-white";
  }
};

const AnalyticsMetric = ({
  Icon,
  title,
  value,
  unit = "",
  colorClass,
  tooltip,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: number;
  unit?: string;
  colorClass?: string;
  tooltip?: string;
}) => (
  <div className="flex flex-col items-start p-4 bg-white rounded-xl shadow-lg border border-gray-100 transition hover:shadow-xl">
    <Icon className={`w-6 h-6 mb-2 ${colorClass}`} />
    <span className="text-2xl font-extrabold text-gray-900 flex items-end">
      {value.toLocaleString()}
      {unit && (
        <span className="text-base font-semibold ml-1 text-gray-600">
          {unit}
        </span>
      )}
    </span>
    <span className="text-sm text-gray-500 mt-1">{title}</span>
  </div>
);

const CampaignDetailPage = () => {
  const [campaignId, setCampaignId] = useState("101");
  const [campaign, setCampaign] = useState<Campaign>();
  const status = campaign?.status ?? "";

  const articlesCount = Array.isArray(campaign?.content_structure?.articles)
    ? campaign.content_structure.articles.length
    : campaign?.content_structure?.articles ?? 0;

  const opportunitiesCount = Array.isArray(campaign?.content_structure?.opportunities)
    ? campaign.content_structure.opportunities.length
    : campaign?.content_structure?.opportunities ?? 0;

  // Derived analytics metrics (only for Sent campaigns)
  const metrics = useMemo(() => {
    if (!campaign) {
      return { openRate: 0, bounceRate: 0, clickRate: 0, conversionRate: 0 };
    }

    const { emails_sent, opens, clicks, bounces, conversions } = campaign;

    if (status !== "sent" || emails_sent === 0) {
      return { openRate: 0, bounceRate: 0, clickRate: 0, conversionRate: 0 };
    }

    const openRate = (opens / emails_sent) * 100;
    const bounceRate = (bounces / emails_sent) * 100;
    const clickRate = (clicks / emails_sent) * 100;
    // Conversion Rate based on sent emails
    const conversionRate = (conversions / emails_sent) * 100;

    return { openRate, bounceRate, clickRate, conversionRate };
  }, [campaign, status]);

  // --- Action Handlers (Mocked) ---
  const handleEdit = () =>
    alert(`Redirecting to editor for campaign: ${campaign?.name}`);
  const handleSendNow = () => alert(`Sending campaign: ${campaign?.name} NOW!`);
  const handleCancelSchedule = () => {
    alert(`Cancelling scheduled campaign: ${campaign?.name}`);
    setCampaignId("103");
  };
  const handleDuplicate = () =>
    alert(`Duplicating campaign: ${campaign?.name}`);

  const renderActionButtons = () => {
    const baseClasses =
      "flex items-center px-4 py-2.5 font-bold rounded-lg shadow-md transition transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed";

    if (status === "sent") {
      return (
        <button
          onClick={handleDuplicate}
          className={`${baseClasses} bg-purple-600 text-white hover:bg-purple-700`}
        >
          <CornerUpLeft className="w-5 h-5 mr-2" /> Duplicate Campaign
        </button>
      );
    } else if (status === "scheduled") {
      return (
        <div className="flex space-x-4">
          <button
            onClick={handleSendNow}
            className={`${baseClasses} bg-green-600 text-white hover:bg-green-700`}
          >
            <Send className="w-5 h-5 mr-2" /> Send Now
          </button>
          <button
            onClick={handleCancelSchedule}
            className={`${baseClasses} bg-red-500 text-white hover:bg-red-600`}
          >
            <Trash2 className="w-5 h-5 mr-2" /> Cancel Schedule
          </button>
        </div>
      );
    } else if (status === "draft") {
      return (
        <div className="flex space-x-4">
          <button
            onClick={handleEdit}
            className={`${baseClasses} bg-primary text-white`}
          >
            <Edit className="w-5 h-5 mr-2" /> Edit Campaign
          </button>
          <button
            onClick={handleSendNow}
            className={`${baseClasses} bg-green-600 text-white hover:bg-green-700`}
          >
            <Send className="w-5 h-5 mr-2" /> Send Now
          </button>
        </div>
      );
    }
    return null;
  };

  const renderDetailsPanel = () => {
    if (status === "sent") {
      return (
        <>
          <h2 className="text-2xl font-bold text-gray-900 mb-5 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-green-600" /> Performance
            Analytics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <AnalyticsMetric
              Icon={Send}
              title="Emails Sent"
              value={campaign?.emails_sent ?? 0}
              colorClass="text-primary"
            />
            <AnalyticsMetric
              Icon={TrendingUp}
              title="Open Rate"
              value={metrics.openRate}
              unit="%"
              colorClass="text-green-600"
            />
            <AnalyticsMetric
              Icon={Clock}
              title="Click Rate"
              value={metrics.clickRate}
              unit="%"
              colorClass="text-purple-600"
            />
            <AnalyticsMetric
              Icon={CheckCircle}
              title="Conversion Rate"
              value={metrics.conversionRate}
              unit="%"
              colorClass="text-yellow-600"
            />
            <AnalyticsMetric
              Icon={XCircle}
              title="Bounce Rate"
              value={metrics.bounceRate}
              unit="%"
              colorClass="text-red-600"
            />
            <AnalyticsMetric
              Icon={User}
              title="Total Conversions"
              value={campaign?.conversions ?? 0}
              colorClass="text-pink-600"
            />
          </div>
        </>
      );
    } else if (status === "scheduled") {
      return (
        <>
          <h2 className="text-2xl font-bold text-gray-900 mb-5 flex items-center">
            <Calendar className="w-6 h-6 mr-2 text-primary" /> Schedule Details
          </h2>
          <div className="p-6 bg-white rounded-xl shadow-lg border border-blue-100 mb-8">
            <div className="flex items-center text-lg font-semibold text-gray-800">
              <Clock className="w-5 h-5 mr-3 text-primary" />
              Scheduled For:{" "}
              <span className="ml-2 font-extrabold text-primary">
                {new Date(
                  campaign?.scheduled_for ?? new Date()
                ).toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              This campaign is locked and will automatically send at the time
              above unless you cancel it.
            </p>
          </div>
        </>
      );
    } else if (status === "draft") {
      return (
        <div className="p-6 bg-yellow-50 rounded-xl shadow-lg border border-yellow-200 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center">
            <Info className="w-6 h-6 mr-2 text-yellow-600" /> Campaign Status
          </h2>
          <p className="text-sm text-gray-600">
            This campaign is currently a **Draft**. You must complete the
            content and settings, then either send it immediately or schedule it
            for a future date. No analytics are available until the campaign is
            sent.
          </p>
        </div>
      );
    }
    return null;
  };

  const EmailPreviewPlaceholder = () => (
    <div className="mt-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
        <Mail className="w-6 h-6 mr-2 text-primary" /> Email Content Preview
      </h3>
      <div className="p-0 bg-gray-200 min-h-[500px] rounded-xl overflow-hidden shadow-2xl">
        <div className="max-w-xl mx-auto my-8 border-8 border-gray-100 bg-white shadow-xl">
          {/* Header */}
          <div className="bg-primary text-white p-6 rounded-t-lg">
            <h4 className="text-sm font-light">
              From: {campaign?.fromName || "The Blog Team"}
            </h4>
            <h1 className="text-2xl font-extrabold mt-1">
              {campaign?.subject || "No Subject"}
            </h1>
          </div>

          <div className="p-6">
            <div
              className="text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: campaign?.preview_html.replace(/\n/g, "<br />") ?? "",
              }}
            />

            {(() => {
              const articlesCount = Array.isArray(campaign?.content_structure?.articles)
                ? campaign.content_structure.articles.length
                : campaign?.content_structure?.articles ?? 0;
              if (articlesCount <= 0) return null;
              return (
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <h4 className="font-bold text-lg text-gray-900 mb-3 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-primary" /> Latest Articles ({articlesCount} included)
                  </h4>
                  <div className="p-3 bg-blue-50 text-sm rounded">
                    Article Placeholder 1.
                  </div>
                </div>
              );
            })()}

            {opportunitiesCount > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <h4 className="font-bold text-lg text-gray-900 mb-3 flex items-center">
                  <Gift className="w-5 h-5 mr-2 text-yellow-600" /> Opportunities ({opportunitiesCount} included)
                </h4>
                <div className="p-3 bg-yellow-50 text-sm rounded">
                  Opportunity Placeholder 1.
                </div>
              </div>
            )}

            <div className="mt-8 text-xs text-center text-gray-500 border-t pt-4">
              Email Footer and Unsubscribe Links
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10 font-sans">
      <div className="page">
        <Breadcrumb />

        <div className="mb-6 p-4 bg-yellow-100 rounded-xl border border-yellow-300 flex items-center space-x-4">
          <span className="font-semibold text-sm text-yellow-800">
            Mock Status Selector:
          </span>
          {Object.keys([]).map((id) => (
            <button
              key={id}
              onClick={() => setCampaignId(id)}
              className={`py-1 px-3 text-xs font-semibold rounded-full transition ${
                campaignId === id
                  ? "bg-yellow-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-yellow-200"
              }`}
            >
              {campaign?.status} Campaign ({id})
            </button>
          ))}
        </div>

        {/* Header and Actions */}
        <div className="mb-8 flex justify-between items-center pb-4 border-b border-gray-200">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-extrabold text-gray-900">
                {campaign?.name}
              </h1>
              <span
                className={`text-sm font-bold py-1 px-3 rounded-full ${getStatusStyles(
                  status
                )}`}
              >
                {status}
              </span>
            </div>
            <p className="text-gray-500 mt-1">
              {status === "sent"
                ? `Sent on ${new Date(
                    campaign?.sent_at ?? new Date()
                  ).toLocaleDateString()} at ${new Date(
                    campaign?.sent_at ?? new Date()
                  ).toLocaleTimeString()}`
                : `Current Status: ${status}`}
            </p>
          </div>

          {/* Dynamic Action Buttons */}
          <div className="hidden sm:block">{renderActionButtons()}</div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Column 1: Core Information & Audience */}
          <div className="lg:col-span-1 space-y-6">
            {/* Summary Card */}
            <div className="p-5 bg-white rounded-xl shadow-xl border border-gray-100 space-y-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Layers className="w-5 h-5 mr-2 text-primary" /> Campaign Summary
              </h2>
              <div className="flex items-center text-sm text-gray-700">
                  <Settings className="w-4 h-4 mr-2 text-primary" />
                  <span className="font-semibold">Content:</span>
                  <span className="ml-2">
                    {articlesCount} Articles, {opportunitiesCount} Opportunities
                  </span>
                </div>

              {status === "sent" && (
                <div className="flex items-center text-sm text-gray-700">
                  <Clock className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="font-semibold">Total Sent:</span>
                  <span className="ml-2">
                    {campaign?.emails_sent.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            <div className="sm:hidden">{renderActionButtons()}</div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            {renderDetailsPanel()}

            <EmailPreviewPlaceholder />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetailPage;
