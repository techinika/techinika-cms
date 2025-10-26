"use client";

import React, { useState, useMemo } from "react";
import { Mail, Search, Filter, ArrowLeft, ArrowRight } from "lucide-react";
import { CampaignCard } from "@/components/parts/CampaignCard";
import { Campaign } from "@/types/main";
import { Breadcrumb } from "@/components/ui/breadcrumb";

const MOCK_CAMPAIGNS = [
  {
    id: 101,
    name: "Q3 Product Launch",
    status: "Completed",
    created_at: "2024-09-15T10:00:00Z",
    emails_sent: 15500,
    opens: 3875,
    clicks: 1240,
    bounces: 155,
    conversions: 250,
    target: "VIP Users",
  },
  {
    id: 102,
    name: "October Newsletter",
    status: "Completed",
    created_at: "2024-10-01T14:30:00Z",
    emails_sent: 25000,
    opens: 6000,
    clicks: 1750,
    bounces: 500,
    conversions: 400,
    target: "All Subscribers",
  },
  {
    id: 103,
    name: "Holiday Sales Preview",
    status: "Scheduled",
    created_at: "2024-11-05T08:00:00Z",
    emails_sent: 18000,
    opens: 0,
    clicks: 0,
    bounces: 0,
    conversions: 0,
    target: "Engaged Users",
  },
  {
    id: 104,
    name: "Onboarding Follow-up Series",
    status: "Active",
    created_at: "2024-08-20T09:00:00Z",
    emails_sent: 80000,
    opens: 16000,
    clicks: 4800,
    bounces: 800,
    conversions: 1200,
    target: "New Signups",
  },
  {
    id: 105,
    name: "Draft: Q4 Strategy Meeting",
    status: "Draft",
    created_at: null,
    emails_sent: 0,
    opens: 0,
    clicks: 0,
    bounces: 0,
    conversions: 0,
    target: "Internal Team",
  },
  {
    id: 106,
    name: "Customer Feedback Survey",
    status: "Completed",
    created_at: "2024-07-22T11:00:00Z",
    emails_sent: 12000,
    opens: 3000,
    clicks: 900,
    bounces: 60,
    conversions: 300,
    target: "Recent Buyers",
  },
  {
    id: 107,
    name: "A/B Test - Subject Line",
    status: "Completed",
    created_at: "2024-10-20T13:00:00Z",
    emails_sent: 5000,
    opens: 1500,
    clicks: 450,
    bounces: 50,
    conversions: 80,
    target: "Small Segment",
  },
  {
    id: 108,
    name: "Reactivation Campaign",
    status: "Active",
    created_at: "2024-09-01T16:00:00Z",
    emails_sent: 4000,
    opens: 400,
    clicks: 80,
    bounces: 160,
    conversions: 10,
    target: "Inactive Users",
  },
  {
    id: 109,
    name: "Upcoming Webinar Invitation",
    status: "Completed",
    created_at: "2024-10-18T10:00:00Z",
    emails_sent: 7000,
    opens: 2100,
    clicks: 630,
    bounces: 70,
    conversions: 100,
    target: "Leads",
  },
  {
    id: 110,
    name: "End of Year Review",
    status: "Draft",
    created_at: null,
    emails_sent: 0,
    opens: 0,
    clicks: 0,
    bounces: 0,
    conversions: 0,
    target: "All Subscribers",
  },
];

const CAMPAIGNS_PER_PAGE = 6;
const STATUS_OPTIONS = ["All", "Completed", "Active", "Scheduled", "Draft"];

const CampaignManagementPage = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredCampaigns = useMemo(() => {
    let filtered = campaigns;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(searchLower) ||
          c.target.toLowerCase().includes(searchLower)
      );
    }

    if (filterStatus !== "All") {
      filtered = filtered.filter((c) => c.status === filterStatus);
    }

    filtered.sort((a, b) => {
      if (a.status === "draft" && b.status !== "draft") return 1;
      if (a.status !== "draft" && b.status === "draft") return -1;
      if (a.created_at && b.created_at) {
        return Date.parse(b.created_at) - Date.parse(a.created_at);
      }
      return 0;
    });

    setCurrentPage(1);

    return filtered;
  }, [campaigns, searchTerm, filterStatus]);

  const totalItems = filteredCampaigns.length;
  const totalPages = Math.ceil(totalItems / CAMPAIGNS_PER_PAGE);
  const start = (currentPage - 1) * CAMPAIGNS_PER_PAGE;
  const end = start + CAMPAIGNS_PER_PAGE;
  const currentCampaigns = filteredCampaigns.slice(start, end);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10 font-sans">
      <div className="page">
        <Breadcrumb />

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Email Marketing Campaigns
          </h1>
          <p className="text-gray-500 mt-1">
            Monitor performance and manage your scheduled and completed
            campaigns.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="relative md:w-1/3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search campaign name or target..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary shadow-sm"
            />
          </div>

          <div className="relative md:w-1/3">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary p-2.5 pl-10"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status} Status
                </option>
              ))}
            </select>
          </div>

          <button
            className="md:w-auto flex items-center justify-center px-4 py-2.5 bg-primary text-white font-semibold rounded-lg shadow-md transition"
            onClick={() => alert("Simulating 'Create New Campaign' action.")}
          >
            <Mail className="w-5 h-5 mr-2" />
            New Campaign
          </button>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-5">
          Showing {filteredCampaigns.length} Campaigns
        </h2>

        {currentCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
            {currentCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        ) : (
          <div className="text-center p-12 bg-white rounded-xl shadow-lg border border-dashed border-gray-300">
            <Mail className="w-10 h-10 mx-auto text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-700">
              No campaigns found.
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Try clearing your filters or create a new campaign.
            </p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-8 p-4 bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="text-sm text-gray-600">
              Showing {start + 1} to {Math.min(end, totalItems)} of {totalItems}{" "}
              results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="flex items-center px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition"
                title="First Page"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="flex items-center px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition"
              >
                Previous
              </button>
              <div className="px-3 py-1 text-sm font-semibold text-gray-800 bg-gray-100 rounded-lg flex items-center">
                Page {currentPage} / {totalPages}
              </div>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="flex items-center px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition"
              >
                Next
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="flex items-center px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition"
                title="Last Page"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignManagementPage;
