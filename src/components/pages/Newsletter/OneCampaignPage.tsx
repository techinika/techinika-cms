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

const MOCK_CAMPAIGNS = {
  "101": {
    id: "101",
    name: "Q3 Product Launch Report",
    status: "Sent",
    sent_at: "2024-09-15T10:00:00Z",
    audience: "Users + Subscribers (Combined)",
    emails_sent: 15500,
    opens: 3875,
    clicks: 1240,
    bounces: 155,
    conversions: 250,
    content_structure: {
      articles: 2,
      opportunities: 1,
      custom_text_length: 350,
    },
    subject: "Your Q3 Report: New Features Inside!",
    preview_html:
      "We are excited to share the amazing progress we made this quarter. Check out the articles below for deep dives...",
  },
  // 2. SCHEDULED CAMPAIGN - Focus on Timing & Cancellation
  "102": {
    id: "102",
    name: "Holiday Sales Preview",
    status: "Scheduled",
    scheduled_for: "2024-11-05T08:00:00Z",
    audience: "Mailing List Subscribers",
    emails_sent: 0,
    content_structure: {
      articles: 0,
      opportunities: 2,
      custom_text_length: 200,
    },
    subject: "Sneak Peek: Get Early Access to Holiday Deals!",
    preview_html:
      "Our holiday offers are coming soon! Click the opportunities below to get your exclusive early-bird access.",
  },
  // 3. DRAFT CAMPAIGN - Focus on Editing & Preparation
  "103": {
    id: "103",
    name: "Onboarding Follow-up Series (Draft)",
    status: "Draft",
    created_at: "2024-10-20T12:00:00Z",
    audience: "Registered Users",
    emails_sent: 0,
    content_structure: {
      articles: 1,
      opportunities: 0,
      custom_text_length: 500,
    },
    subject: "Welcome to the Team! Here’s your guide.",
    preview_html:
      "Thanks for joining us! This email is the first in your onboarding series. We've included a great article to get you started.",
  },
};

const getStatusStyles = (status) => {
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
  // Set default to the most complex state (Sent) for demonstration
  const [campaignId, setCampaignId] = useState("101");
  const campaign = MOCK_CAMPAIGNS[campaignId];
  const status = campaign.status;

  // Derived analytics metrics (only for Sent campaigns)
  const metrics = useMemo(() => {
    const { emails_sent, opens, clicks, bounces, conversions } = campaign;

    if (status !== "Sent" || emails_sent === 0) {
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
    alert(`Redirecting to editor for campaign: ${campaign.name}`);
  const handleSendNow = () => alert(`Sending campaign: ${campaign.name} NOW!`);
  const handleCancelSchedule = () => {
    alert(`Cancelling scheduled campaign: ${campaign.name}`);
    // In a real app, this would update the status to 'Draft'
    setCampaignId("103"); // Mock switch to Draft status
  };
  const handleDuplicate = () => alert(`Duplicating campaign: ${campaign.name}`);

  // --- Render Helpers ---

  const renderActionButtons = () => {
    const baseClasses =
      "flex items-center px-4 py-2.5 font-bold rounded-lg shadow-md transition transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed";

    if (status === "Sent") {
      return (
        <button
          onClick={handleDuplicate}
          className={`${baseClasses} bg-purple-600 text-white hover:bg-purple-700`}
        >
          <CornerUpLeft className="w-5 h-5 mr-2" /> Duplicate Campaign
        </button>
      );
    } else if (status === "Scheduled") {
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
    } else if (status === "Draft") {
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

  // Renders the main details based on status
  const renderDetailsPanel = () => {
    if (status === "Sent") {
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
              value={campaign.emails_sent}
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
              value={campaign.conversions}
              colorClass="text-pink-600"
            />
          </div>
        </>
      );
    } else if (status === "Scheduled") {
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
                {new Date(campaign.scheduled_for).toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              This campaign is locked and will automatically send at the time
              above unless you cancel it.
            </p>
          </div>
        </>
      );
    } else if (status === "Draft") {
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

  // Placeholder for the email preview content
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
              From: {campaign.fromName || "The Blog Team"}
            </h4>
            <h1 className="text-2xl font-extrabold mt-1">
              {campaign.subject || "No Subject"}
            </h1>
          </div>

          <div className="p-6">
            <div
              className="text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: campaign.preview_html.replace(/\n/g, "<br />"),
              }}
            />

            {campaign.content_structure.articles > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <h4 className="font-bold text-lg text-gray-900 mb-3 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-primary" /> Latest
                  Articles ({campaign.content_structure.articles} included)
                </h4>
                <div className="p-3 bg-blue-50 text-sm rounded">
                  Article Placeholder 1.
                </div>
              </div>
            )}

            {campaign.content_structure.opportunities > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <h4 className="font-bold text-lg text-gray-900 mb-3 flex items-center">
                  <Gift className="w-5 h-5 mr-2 text-yellow-600" />{" "}
                  Opportunities ({campaign.content_structure.opportunities}{" "}
                  included)
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
          {Object.keys(MOCK_CAMPAIGNS).map((id) => (
            <button
              key={id}
              onClick={() => setCampaignId(id)}
              className={`py-1 px-3 text-xs font-semibold rounded-full transition ${
                campaignId === id
                  ? "bg-yellow-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-yellow-200"
              }`}
            >
              {MOCK_CAMPAIGNS[id].status} Campaign ({id})
            </button>
          ))}
        </div>

        {/* Header and Actions */}
        <div className="mb-8 flex justify-between items-center pb-4 border-b border-gray-200">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-extrabold text-gray-900">
                {campaign.name}
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
              {status === "Sent"
                ? `Sent on ${new Date(
                    campaign.sent_at
                  ).toLocaleDateString()} at ${new Date(
                    campaign.sent_at
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
                <Info className="w-5 h-5 mr-2 text-red-500" /> Core Campaign
                Info
              </h2>
              <p className="text-sm text-gray-600 border-b pb-3">
                **Subject:**{" "}
                <span className="font-semibold">{campaign.subject}</span>
              </p>

              <div className="flex items-center text-sm text-gray-700">
                <User className="w-4 h-4 mr-2 text-green-500" />
                <span className="font-semibold">Audience:</span>
                <span className="ml-2">{campaign.audience}</span>
              </div>

              <div className="flex items-center text-sm text-gray-700">
                <Settings className="w-4 h-4 mr-2 text-primary" />
                <span className="font-semibold">Content:</span>
                <span className="ml-2">
                  {campaign.content_structure.articles} Articles,{" "}
                  {campaign.content_structure.opportunities} Opportunities
                </span>
              </div>

              {status === "Sent" && (
                <div className="flex items-center text-sm text-gray-700">
                  <Clock className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="font-semibold">Total Sent:</span>
                  <span className="ml-2">
                    {campaign.emails_sent.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Dynamic Action Buttons (Mobile View) */}
            <div className="sm:hidden">{renderActionButtons()}</div>
          </div>

          {/* Column 2 & 3: Dynamic Details and Preview */}
          <div className="lg:col-span-2 space-y-8">
            {/* Dynamic Status Panel (Analytics/Schedule Info/Draft Info) */}
            {renderDetailsPanel()}

            {/* Email Preview */}
            <EmailPreviewPlaceholder />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetailPage;
