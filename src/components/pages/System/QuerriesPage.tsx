"use client";

import React, { useState, useMemo } from "react";
import {
  Mail,
  Search,
  Clock,
  CheckCircle,
  Slash,
  XCircle,
  Users,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Querry } from "@/types/main";

const INITIAL_QUERIES = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex.j@example.com",
    subject: "Integration Question",
    message: "How do I connect your platform with our CRM system?",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    feedback: "Pending",
  },
  {
    id: "2",
    name: "Maria Rodriguez",
    email: "maria.r@web.net",
    subject: "New Campaign Inquiry",
    message:
      "I loved your article on dynamic templates. Can you elaborate on pricing for 5 campaigns a month?",
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    feedback: "Pending",
  },
  {
    id: "3",
    name: "Spammer Bot",
    email: "spam@bot.com",
    subject: "FREE MONEY NOW!",
    message: "Click this link for instant crypto gains. Limited offer.",
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    feedback: "Spam",
  },
  {
    id: "4",
    name: "Daniel Chen",
    email: "daniel.c@corp.org",
    subject: "Feature Request",
    message:
      "Please add LaTeX support to the text editor. This is essential for my team.",
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    feedback: "Followed Up (Lead)",
  },
  {
    id: "5",
    name: "Alex Johnson",
    email: "alex.j@example.com",
    subject: "Follow-up: Integration",
    message: "Still waiting on an answer about CRM integration. Thanks!",
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    feedback: "Duplicate",
  },
  {
    id: "6",
    name: "Ghost Account",
    email: "no-reply@ghost.net",
    subject: "Test",
    message: "",
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    feedback: "Empty",
  },
];

const STATUS_OPTIONS = [
  { value: "All", label: "All Queries", icon: Mail, color: "text-gray-600" },
  { value: "Pending", label: "Pending", icon: Clock, color: "text-red-500" },
  {
    value: "Followed Up (Lead)",
    label: "Followed Up (Lead)",
    icon: CheckCircle,
    color: "text-green-600",
  },
  { value: "Spam", label: "Spam", icon: Slash, color: "text-yellow-600" },
  {
    value: "Duplicate",
    label: "Duplicate",
    icon: RotateCcw,
    color: "text-primary",
  },
  { value: "Empty", label: "Empty", icon: Trash2, color: "text-gray-500" },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Pending":
      return {
        style: "bg-red-100 text-red-700",
        icon: Clock,
        label: "Pending",
      };
    case "Followed Up (Lead)":
      return {
        style: "bg-green-100 text-green-700",
        icon: CheckCircle,
        label: "Followed Up (Lead)",
      };
    case "Spam":
      return {
        style: "bg-yellow-100 text-yellow-700",
        icon: Slash,
        label: "Spam",
      };
    case "Duplicate":
      return {
        style: "bg-blue-100 text-primary",
        icon: RotateCcw,
        label: "Duplicate",
      };
    case "Empty":
      return {
        style: "bg-gray-100 text-gray-700",
        icon: Trash2,
        label: "Empty",
      };
    default:
      return {
        style: "bg-gray-200 text-gray-800",
        icon: Mail,
        label: "Unknown",
      };
  }
};

const ContactQueriesDashboard = () => {
  const [queries, setQueries] = useState<Querry[]>(INITIAL_QUERIES);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Pending");
  const [expandedQueryId, setExpandedQueryId] = useState<string | null>("");

  const handleStatusChange = (id: string, newStatus: string) => {
    setQueries((prevQueries) =>
      prevQueries.map((query) =>
        query.id === id ? { ...query, feedback: newStatus } : query
      )
    );
  };

  const handleExpandQuery = (id: string | null) => {
    setExpandedQueryId((prevId) => (prevId === id ? null : id));
  };

  const filteredQueries = useMemo(() => {
    let result = queries;

    // 1. Status Filter
    if (filterStatus !== "All") {
      result = result.filter((query) => query.feedback === filterStatus);
    }

    if (search) {
      const lowerCaseSearch = search.toLowerCase();
      result = result.filter(
        (query) =>
          query.name.toLowerCase().includes(lowerCaseSearch) ||
          query.email.toLowerCase().includes(lowerCaseSearch)
      );
    }

    return result.sort(
      (a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)
    );
  }, [queries, search, filterStatus]);

  const renderStatusDropdown = (query: Querry) => {
    return (
      <select
        value={query.feedback}
        onChange={(e) => handleStatusChange(query.id, e.target.value)}
        className={`py-1.5 pl-3 pr-8 text-sm font-medium rounded-lg border focus:ring-blue-500 focus:border-blue-500 transition duration-150 shadow-sm
                    ${
                      query.feedback === "Pending"
                        ? "border-red-400 bg-red-50 text-red-700"
                        : query.feedback === "Followed Up (Lead)"
                        ? "border-green-400 bg-green-50 text-green-700"
                        : query.feedback === "Spam"
                        ? "border-yellow-400 bg-yellow-50 text-yellow-700"
                        : query.feedback === "Duplicate"
                        ? "border-blue-400 bg-blue-50 text-primary"
                        : "border-gray-400 bg-gray-50 text-gray-700"
                    }`}
      >
        {STATUS_OPTIONS.filter((o) => o.value !== "All").map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-white text-gray-900"
          >
            {option.label}
          </option>
        ))}
      </select>
    );
  };

  const renderQueryTable = () => {
    if (filteredQueries.length === 0) {
      return (
        <div className="text-center p-12 bg-white rounded-xl shadow-lg mt-6">
          <XCircle className="w-12 h-12 mx-auto text-red-400" />
          <h3 className="mt-2 text-xl font-semibold text-gray-900">
            No Queries Found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search term or changing the status filter.
          </p>
        </div>
      );
    }

    return (
      <div className="mt-6 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                Sender
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                Subject / Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                Feedback/Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredQueries.map((query) => {
              const badge = getStatusBadge(query.feedback);
              const isExpanded = expandedQueryId === query.id;
              return (
                <React.Fragment key={query.id}>
                  <tr className="hover:bg-gray-50 transition duration-150">
                    {/* Sender */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {query.name}
                      </div>
                      <div
                        className="text-xs text-primary hover:text-primary truncate"
                        title={query.email}
                      >
                        {query.email}
                      </div>
                    </td>
                    {/* Subject / Date */}
                    <td className="px-6 py-4">
                      <div
                        className="text-sm font-semibold text-gray-800 truncate"
                        title={query.subject}
                      >
                        {query.subject}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(query.created_at).toLocaleDateString()} at{" "}
                        {new Date(query.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>
                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderStatusDropdown(query)}
                    </td>
                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleExpandQuery(query.id)}
                        className="text-primary hover:text-blue-800 transition duration-150 text-xs font-bold"
                      >
                        {isExpanded ? "Collapse" : "View Message"}
                      </button>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr className="bg-blue-50/50">
                      <td colSpan={4} className="p-6">
                        <div className="font-semibold text-gray-800 mb-2 flex items-center">
                          <Users className="w-4 h-4 mr-2 text-primary" /> Full
                          Message:
                        </div>
                        <div className="p-4 bg-white rounded-lg border border-blue-200 text-sm text-gray-700 whitespace-pre-wrap">
                          {query.message || (
                            <span className="text-gray-400 italic">
                              No message content provided.
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10">
      <div className="page">
        <Breadcrumb />

        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Mail className="w-7 h-7 mr-2 text-red-600" /> Contact Query Inbox
            </h1>
            <p className="text-gray-500 mt-1">
              Review and categorize incoming customer and lead inquiries.
            </p>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white p-5 rounded-xl shadow-xl border border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Status Filter Tabs */}
            <div className="flex flex-wrap gap-2 md:gap-3">
              {STATUS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilterStatus(option.value)}
                  className={`flex items-center text-sm font-semibold px-4 py-2 rounded-full transition duration-200 shadow-sm
                                        ${
                                          filterStatus === option.value
                                            ? `ring-2 ring-offset-2 ring-blue-500 ${option.color} bg-blue-50`
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                >
                  <option.icon
                    className={`w-4 h-4 mr-1 ${
                      filterStatus === option.value
                        ? "text-primary"
                        : option.color
                    }`}
                  />
                  {option.label}
                  {/* Display count for All */}
                  {option.value === "All" && (
                    <span className="ml-1 text-xs font-bold">
                      ({queries.length})
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-auto md:min-w-[300px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Query Table */}
        {renderQueryTable()}
      </div>
    </div>
  );
};

export default ContactQueriesDashboard;
