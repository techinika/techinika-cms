"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  LayoutGrid,
  TrendingUp,
  Filter,
  Search,
  Plus,
  Calendar,
  Loader2,
  Database,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";

const MOCK_OPPORTUNITIES = [
  {
    id: "1",
    name: "Q4 Product Launch",
    type: "Marketing",
    status: "Active",
    expires_at: "2025-12-31",
    budget: 50000,
    company: "Acme Corp",
  },
  {
    id: "2",
    name: "New Feature Development",
    type: "Engineering",
    status: "Inactive",
    expires_at: "2025-10-15",
    budget: 75000,
    company: "Acme Corp",
  },
  {
    id: "3",
    name: "HR System Upgrade",
    type: "Operations",
    status: "Active",
    expires_at: "2026-03-01",
    budget: 15000,
    company: "Acme Corp",
  },
  {
    id: "4",
    name: "Security Audit Q1",
    type: "Compliance",
    status: "Active",
    expires_at: "2025-11-20",
    budget: 30000,
    company: "Acme Corp",
  },
  {
    id: "5",
    name: "APAC Market Expansion",
    type: "Sales",
    status: "Inactive",
    expires_at: "2026-06-30",
    budget: 120000,
    company: "Acme Corp",
  },
  {
    id: "6",
    name: "Website Redesign",
    type: "Marketing",
    status: "Active",
    expires_at: "2025-12-15",
    budget: 45000,
    company: "Acme Corp",
  },
];

const OPPORTUNITY_TYPES = [
  "Marketing",
  "Engineering",
  "Operations",
  "Compliance",
  "Sales",
];

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100 transition duration-300 hover:shadow-xl">
    <div
      className={`flex items-center justify-between p-2 rounded-full w-12 h-12 ${color} bg-opacity-10 mb-3`}
    >
      <Icon className={`w-6 h-6 ${color}`} />
    </div>
    <p className="text-3xl font-bold text-gray-800">{value}</p>
    <p className="text-sm text-gray-500 mt-1">{title}</p>
  </div>
);

const FilterInput = ({
  label,
  value,
  onChange,
  type = "text",
  icon: Icon,
  placeholder,
}) => (
  <div className="flex flex-col">
    <label className="text-xs font-medium text-gray-600 mb-1">{label}</label>
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm transition duration-150"
      />
      {Icon && (
        <Icon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
      )}
    </div>
  </div>
);

const FilterSelect = ({ label, value, onChange, options }) => (
  <div className="flex flex-col">
    <label className="text-xs font-medium text-gray-600 mb-1">{label}</label>
    <select
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-indigo-500 focus:border-indigo-500 text-sm transition duration-150 appearance-none"
    >
      <option value="">All</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

export const OpportunitiesPage = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter states
  const [nameFilter, setNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [dateFilter, setDateFilter] = useState(""); // YYYY-MM-DD

  const filteredOpportunities = useMemo(() => {
    let filtered = opportunities;

    if (nameFilter) {
      filtered = filtered.filter((opp) =>
        opp.name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    // 2. Status Filter
    if (statusFilter) {
      filtered = filtered.filter((opp) => opp.status === statusFilter);
    }

    // 3. Type Filter
    if (typeFilter) {
      filtered = filtered.filter((opp) => opp.type === typeFilter);
    }

    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filtered = filtered.filter((opp) => {
        const expiresDate = new Date(opp.expires_at);
        return expiresDate <= filterDate;
      });
    }

    // Sort by expiration date (newest first)
    return filtered.sort(
      (a, b) => new Date(b.expires_at) - new Date(a.expires_at)
    );
  }, [opportunities, nameFilter, statusFilter, typeFilter, dateFilter]);

  // Derived State: Analytics
  const analytics = useMemo(() => {
    const total = opportunities.length;
    const active = opportunities.filter((o) => o.status === "Active").length;
    const inactive = total - active;
    const totalBudget = opportunities.reduce(
      (sum, o) => sum + (o.budget || 0),
      0
    );
    const avgBudget = total > 0 ? totalBudget / total : 0;

    return {
      total,
      active,
      inactive,
      totalBudget: `$${totalBudget.toLocaleString()}`,
      avgBudget: `$${Math.round(avgBudget).toLocaleString()}`,
    };
  }, [opportunities]);

  // Derived State: Paginated Opportunities
  const paginatedOpportunities = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredOpportunities.slice(startIndex, endIndex);
  }, [filteredOpportunities, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredOpportunities.length / itemsPerPage);

  // --- Handlers ---

  const handleNewOpportunity = async () => {
    if (!isAuthenticated || !userId || !db) {
      console.error(
        "Not authenticated or DB not initialized. Cannot add opportunity."
      );
      return;
    }

    const newOpp = {
      name: "New Draft Opportunity",
      type: "Draft",
      status: "Inactive",
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0], // 30 days from now
      budget: 0,
      company: "Acme Corp",
      createdAt: serverTimestamp(),
      createdBy: userId,
    };

    try {
      const appId =
        typeof __app_id !== "undefined" ? __app_id : "default-app-id";
      const collectionPath = `artifacts/${appId}/users/${userId}/opportunities`;
      // Using setDoc with a new document ID, or addDoc if Firestore security rules allow
      // For simplicity and guaranteed ID, we use setDoc with a generated ID
      const newDocRef = doc(collection(db, collectionPath));
      await setDoc(newDocRef, newOpp);
      console.log("New opportunity added successfully with ID:", newDocRef.id);
      // Optionally, navigate to the edit page or show a success message
    } catch (error) {
      console.error("Error adding document:", error);
      // Show custom alert message instead of console.error in production
    }
  };

  const handleRowClick = (id) => {
    console.log(
      `Opportunity ID ${id} clicked. Navigation/Modal view logic goes here.`
    );
    // In a real app, this would trigger a modal or routing to /opportunities/{id}
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // --- Render Functions ---

  const renderTableContent = () => {
    if (loading) {
      return (
        <tr className="bg-gray-50">
          <td colSpan="6" className="py-12 text-center text-indigo-600">
            <Loader2 className="w-6 h-6 animate-spin inline-block mr-2" />
            Loading opportunities...
          </td>
        </tr>
      );
    }

    if (filteredOpportunities.length === 0) {
      return (
        <tr className="bg-white">
          <td colSpan="6" className="py-12 text-center text-gray-500">
            <AlertTriangle className="w-5 h-5 inline-block mr-1" />
            No opportunities match your current filters.
          </td>
        </tr>
      );
    }

    return paginatedOpportunities.map((opp) => (
      <tr
        key={opp.id}
        className="group border-b border-gray-100 hover:bg-indigo-50 transition duration-150 cursor-pointer"
        onClick={() => handleRowClick(opp.id)}
      >
        <td className="px-6 py-4 text-sm font-medium text-gray-900 truncate max-w-xs">
          {opp.name}
        </td>
        <td className="px-6 py-4 text-sm text-gray-500">
          <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            {opp.type}
          </span>
        </td>
        <td className="px-6 py-4">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
              opp.status === "Active"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {opp.status}
          </span>
        </td>
        <td className="px-6 py-4 text-sm text-gray-500 font-mono">
          {new Date(opp.expires_at).toLocaleDateString()}
        </td>
        <td className="px-6 py-4 text-sm font-semibold text-gray-700">
          {opp.budget ? `$${opp.budget.toLocaleString()}` : "N/A"}
        </td>
        <td className="px-6 py-4 text-right">
          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition duration-150 ml-auto" />
        </td>
      </tr>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-[Inter]">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb />

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Opportunities Management
          </h1>
          <button
            onClick={handleNewOpportunity}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-700 transition duration-300 transform hover:scale-[1.02]"
            disabled={!isAuthenticated}
          >
            <Plus className="w-5 h-5 mr-2" />
            New Opportunity
          </button>
        </div>

        {/* Analytics Section */}
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Current Analytics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Total Opportunities"
            value={analytics.total}
            icon={Database}
            color="text-indigo-600"
          />
          <StatCard
            title="Active Projects"
            value={analytics.active}
            icon={TrendingUp}
            color="text-green-600"
          />
          <StatCard
            title="Total Budget (All Time)"
            value={analytics.totalBudget}
            icon={LayoutGrid}
            color="text-yellow-600"
          />
          <StatCard
            title="Avg Budget per Opportunity"
            value={analytics.avgBudget}
            icon={TrendingUp}
            color="text-purple-600"
          />
        </div>

        {/* Filter and Table Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          {/* Filters */}
          <div className="flex flex-wrap items-end gap-4 mb-6 pb-6 border-b border-gray-100">
            <Filter className="w-5 h-5 text-gray-400 mr-2 self-center hidden sm:block" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-grow">
              <FilterInput
                label="Search by Name"
                placeholder="e.g., Q4 Launch"
                value={nameFilter}
                onChange={(e) => {
                  setNameFilter(e.target.value);
                  setCurrentPage(1);
                }}
                icon={Search}
              />
              <FilterSelect
                label="Filter by Status"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                options={["Active", "Inactive"]}
              />
              <FilterSelect
                label="Filter by Type"
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setCurrentPage(1);
                }}
                options={OPPORTUNITY_TYPES}
              />
              <FilterInput
                label="Expires Before Date"
                type="date"
                value={dateFilter}
                onChange={(e) => {
                  setDateFilter(e.target.value);
                  setCurrentPage(1);
                }}
                icon={Calendar}
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Opportunity Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expires On
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {renderTableContent()}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold">
                {Math.min(
                  currentPage * itemsPerPage,
                  filteredOpportunities.length
                )}
              </span>{" "}
              of{" "}
              <span className="font-semibold">
                {filteredOpportunities.length}
              </span>{" "}
              results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>
              {/* Simple Page Indicator */}
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={
                  currentPage === totalPages ||
                  filteredOpportunities.length === 0
                }
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          </div>
        </div>
       
      </div>
    </div>
  );
};
