"use client";

import React, { useState, useEffect, useMemo } from "react";
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
import { getOpportunities } from "@/supabase/CRUD/GET/getCompanyOpportunities";
import { Opportunity, OPPORTUNITY_TYPES } from "@/types/opportunity";
import { useRouter } from "next/navigation";
import { StatCard } from "@/components/ui/stat-card";
import { FilterInput } from "@/components/ui/filter-input";
import { FilterSelect } from "@/components/ui/filter-select";
import Link from "next/link";

export const OpportunitiesPage = ({ companySlug }: { companySlug: string }) => {
  const router = useRouter();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [nameFilter, setNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const fetchedOpportunities = await getOpportunities(companySlug);

        setOpportunities(fetchedOpportunities ?? []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredOpportunities = useMemo(() => {
    let filtered = opportunities;

    if (nameFilter) {
      filtered = filtered.filter((opp) =>
        opp?.title.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(
        (opp) => opp.status === statusFilter.toLowerCase()
      );
    }

    if (typeFilter) {
      filtered = filtered.filter((opp) => opp.type === typeFilter);
    }

    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filtered = filtered.filter((opp) => {
        const expiresDate = new Date(opp?.expires_at ?? new Date());
        return expiresDate <= filterDate;
      });
    }

    return filtered.sort(
      (a, b) =>
        new Date(b?.expires_at ?? new Date()).getTime() -
        new Date(a?.expires_at ?? new Date()).getTime()
    );
  }, [opportunities, nameFilter, statusFilter, typeFilter, dateFilter]);

  const analytics = useMemo(() => {
    const total = opportunities.length;
    const active = opportunities.filter((o) => o.status === "published").length;
    const inactive = total - active;
    const totalBudget = opportunities.reduce(
      (sum, o) => sum + +(o?.salary ?? 0),
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

  const paginatedOpportunities = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredOpportunities.slice(startIndex, endIndex);
  }, [filteredOpportunities, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredOpportunities.length / itemsPerPage);

  const handleNewOpportunity = async () => {
    try {
      console.log("New opportunity added successfully with ID:");
    } catch (error) {
      console.error("Error adding document:", error);
    }
  };

  const handleRowClick = (id: string) => {
    router.push(`/${companySlug}/opportunities/${id}`);
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderTableContent = () => {
    if (loading) {
      return (
        <tr className="bg-gray-50">
          <td colSpan={6} className="py-12 text-center text-primary">
            <Loader2 className="w-6 h-6 animate-spin inline-block mr-2" />
            Loading opportunities...
          </td>
        </tr>
      );
    }

    if (filteredOpportunities.length === 0) {
      return (
        <tr className="bg-white">
          <td colSpan={6} className="py-12 text-center text-gray-500">
            <AlertTriangle className="w-5 h-5 inline-block mr-1" />
            No opportunities match your current filters.
          </td>
        </tr>
      );
    }

    return paginatedOpportunities.map((opp) => (
      <tr
        key={opp.id}
        className="group border-b border-gray-100 hover:bg-blue-50 transition duration-150 cursor-pointer"
        onClick={() => handleRowClick(opp.id)}
      >
        <td className="px-6 py-4 text-sm font-medium text-gray-900 truncate max-w-xs">
          {opp?.title}
        </td>
        <td className="px-6 py-4 text-sm text-gray-500">
          <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            {opp?.type}
          </span>
        </td>
        <td className="px-6 py-4">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
              opp.status === "published"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {opp.status}
          </span>
        </td>
        <td className="px-6 py-4 text-sm text-gray-500">
          {new Date(opp?.expires_at ?? new Date()).toLocaleDateString()}
        </td>
        <td className="px-6 py-4 text-sm font-semibold text-gray-700">
          {opp?.salary ? `$${opp?.salary.toLocaleString()}` : "N/A"}
        </td>
        <td className="px-6 py-4 text-right">
          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition duration-150 ml-auto" />
        </td>
      </tr>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <Breadcrumb />

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Opportunities Management
          </h1>
          <Link
            href={`/${companySlug}/opportunities/new`}
            className="flex items-center px-4 py-2 bg-primary text-white font-semibold rounded shadow-md hover:bg-primary/80 transition duration-300 transform hover:scale-[1.02]"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Opportunity
          </Link>
        </div>

        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Current Analytics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Total Opportunities"
            value={analytics.total}
            icon={Database}
            color="text-primary"
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
            color="text-primary"
          />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex flex-wrap items-end gap-4 mb-6 pb-6 border-b border-gray-100">
            <Filter className="w-5 h-5 text-gray-400 mr-2 self-center hidden sm:block" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 grow">
              <FilterInput
                label="Search by Name"
                placeholder="e.g., Q4 Launch"
                value={nameFilter}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setNameFilter(e.target.value);
                  setCurrentPage(1);
                }}
                icon={Search}
              />
              <FilterSelect
                label="Filter by Status"
                value={statusFilter}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                options={["Published", "Draft"]}
              />
              <FilterSelect
                label="Filter by Type"
                value={typeFilter}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setTypeFilter(e.target.value);
                  setCurrentPage(1);
                }}
                options={OPPORTUNITY_TYPES}
              />
              <FilterInput
                label="Expires Before Date"
                type="date"
                value={dateFilter}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setDateFilter(e.target.value);
                  setCurrentPage(1);
                }}
                icon={Calendar}
                placeholder={undefined}
              />
            </div>
          </div>

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
              <span className="px-3 py-1 bg-blue-50 text-primary rounded-lg text-sm font-medium">
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
