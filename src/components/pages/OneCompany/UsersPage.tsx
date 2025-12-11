"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Users,
  User,
  Briefcase,
  Filter,
  Search,
  Plus,
  Loader2,
  AlertTriangle,
  ArrowRight,
  X,
  Mail,
  CheckCircle,
} from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { COMPANY_USER_ROLES, UserType } from "@/types/users";
import { FilterSelect } from "@/components/ui/filter-select";
import { FilterInput } from "@/components/ui/filter-input";
import { StatCard } from "@/components/ui/stat-card";
import { getCompanyUsers } from "@/supabase/CRUD/GET/getCompanyUsers";
import { decodeUnderscoreSlug } from "../../../lib/functions";
import { AddUserModal } from "@/components/parts/modal/NewCompanyUserModal";
import { useRouter } from "next/navigation";

const STATUSES = ["confirmed", "pending_confirmation"];

export const UsersPage = ({ companySlug }: { companySlug: string }) => {
  const router = useRouter();
  const [companyUsers, setCompanyUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [nameEmailFilter, setNameEmailFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    async function loadUsers() {
      setLoading(true);

      const users = await getCompanyUsers(companySlug);

      setCompanyUsers(users);
      console.log(users);
      setLoading(false);
    }

    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    let filtered = companyUsers;

    if (nameEmailFilter) {
      const search = nameEmailFilter.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search)
      );
    }
    if (roleFilter) {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    if (statusFilter) {
      filtered = filtered.filter((user) => user.status === statusFilter);
    }

    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [companyUsers, nameEmailFilter, roleFilter, statusFilter]);

  const analytics = useMemo(() => {
    const total = companyUsers.length;
    const managers = companyUsers.filter((u) => u.role === "manager").length;
    const employees = companyUsers.filter((u) => u.role === "author").length;
    const active = companyUsers.filter((u) => u.status === "confirmed").length;

    return {
      total,
      managers,
      employees,
      active,
    };
  }, [companyUsers]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleRowClick = (id: string) => {
    router.push(`/${companySlug}/users/${id}`);
  };

  const handlePageChange = (page: React.SetStateAction<any>) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderTableContent = () => {
    if (loading) {
      return (
        <tr className="bg-gray-50">
          <td colSpan={5} className="py-12 text-center text-primary">
            <Loader2 className="w-6 h-6 animate-spin inline-block mr-2" />
            Loading company users...
          </td>
        </tr>
      );
    }

    if (filteredUsers.length === 0) {
      return (
        <tr className="bg-white">
          <td colSpan={5} className="py-12 text-center text-gray-500">
            <AlertTriangle className="w-5 h-5 inline-block mr-1" />
            No users match your current filters.
          </td>
        </tr>
      );
    }

    return paginatedUsers.map((user) => (
      <tr
        key={user.id}
        className="group border-b border-gray-100 hover:bg-blue-50 transition duration-150 cursor-pointer"
        onClick={() => handleRowClick(user.username)}
      >
        <td className="px-6 py-4">
          <div className="flex items-center">
            <User className="w-5 h-5 text-gray-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <Mail className="w-3 h-3 mr-1" />
                {user.email}
              </p>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 text-sm text-gray-500">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
              user.role === "manager"
                ? "bg-blue-100 text-primary"
                : "bg-blue-100 text-primary"
            }`}
          >
            {decodeUnderscoreSlug(user.role)}
          </span>
        </td>
        <td className="px-6 py-4 text-sm text-gray-500">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
              user.status === "confirmed"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {decodeUnderscoreSlug(user.status)}
          </span>
        </td>
        <td className="px-6 py-4 text-sm text-gray-500">
          Joined: {new Date(user?.joined_at ?? new Date()).toLocaleDateString()}
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
        <AddUserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          slug={companySlug}
        />

        <Breadcrumb />

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">User Management</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-primary text-white font-semibold rounded shadow-md hover:bg-primary transition duration-300 transform hover:scale-[1.02]"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New User
          </button>
        </div>

        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          User Statistics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Total Users"
            value={analytics.total}
            icon={Users}
            color="text-primary"
          />
          <StatCard
            title="Managers"
            value={analytics.managers}
            icon={Briefcase}
            color="text-primary"
          />
          <StatCard
            title="Employees"
            value={analytics.employees}
            icon={User}
            color="text-primary"
          />
          <StatCard
            title="Active Users"
            value={analytics.active}
            icon={CheckCircle}
            color="text-green-600"
          />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex flex-wrap items-end gap-4 mb-6 pb-6 border-b border-gray-100">
            <Filter className="w-5 h-5 text-gray-400 mr-2 self-center hidden sm:block" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 grow">
              <FilterInput
                label="Search Name or Email"
                placeholder="e.g., Alice or @company.com"
                value={nameEmailFilter}
                onChange={(e) => {
                  setNameEmailFilter(e.target.value);
                  setCurrentPage(1);
                }}
                icon={Search}
              />
              <FilterSelect
                label="Filter by Role"
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setCurrentPage(1);
                }}
                options={COMPANY_USER_ROLES}
              />
              <FilterSelect
                label="Filter by Status"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                options={STATUSES}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Join Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
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
                {Math.min(currentPage * itemsPerPage, filteredUsers.length)}
              </span>{" "}
              of <span className="font-semibold">{filteredUsers.length}</span>{" "}
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
              <span className="px-3 py-1 bg-blue-50 text-primary rounded-lg text-sm font-medium">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={
                  currentPage === totalPages || filteredUsers.length === 0
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
