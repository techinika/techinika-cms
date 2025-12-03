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
  Database,
  AlertTriangle,
  ArrowRight,
  X,
  Mail,
  CheckCircle,
} from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";

const MOCK_COMPANY_USERS = [
  {
    id: "u1",
    name: "Alice Johnson",
    email: "alice@company.com",
    role: "Manager",
    status: "Active",
    joined_at: "2020-01-15",
  },
  {
    id: "u2",
    name: "Bob Smith",
    email: "bob@company.com",
    role: "Employee",
    status: "Active",
    joined_at: "2021-03-20",
  },
  {
    id: "u3",
    name: "Charlie Brown",
    email: "charlie@company.com",
    role: "Employee",
    status: "Inactive",
    joined_at: "2022-07-01",
  },
  {
    id: "u4",
    name: "Diana Prince",
    email: "diana@company.com",
    role: "Manager",
    status: "Active",
    joined_at: "2019-11-10",
  },
  {
    id: "u5",
    name: "Eve Adams",
    email: "eve@company.com",
    role: "Employee",
    status: "Active",
    joined_at: "2023-05-25",
  },
];

const MOCK_NEW_USER_OPTIONS = [
  { id: "nu1", name: "Frank Miller", email: "frank@external.com" },
  { id: "nu2", name: "Grace Lee", email: "grace@external.com" },
  { id: "nu3", name: "Henry Jones", email: "henry@external.com" },
];

const ROLES = ["Manager", "Employee"];
const STATUSES = ["Active", "Inactive"];

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

const FilterInput = ({ label, value, onChange, icon: Icon, placeholder }) => (
  <div className="flex flex-col">
    <label className="text-xs font-medium text-gray-600 mb-1">{label}</label>
    <div className="relative">
      <input
        type="text"
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

const AddUserModal = ({ isOpen, onClose, onAddUser, existingUsers }) => {
  const availableUsers = MOCK_NEW_USER_OPTIONS.filter(
    (opt) => !existingUsers.some((eu) => eu.email === opt.email)
  );

  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState("Employee");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isOpen) {
      setSelectedUserId("");
      setSelectedRole("Employee");
      setMessage("");
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!selectedUserId) {
      setMessage("Please select a user.");
      return;
    }

    const userToAdd = availableUsers.find((u) => u.id === selectedUserId);
    if (userToAdd) {
      onAddUser({
        name: userToAdd.name,
        email: userToAdd.email,
        role: selectedRole,
      });
      onClose();
    } else {
      setMessage("Selected user not found.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all scale-100">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <User className="w-5 h-5 mr-2 text-indigo-500" />
            Add New Company User
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {message && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {message}
            </div>
          )}

          {availableUsers.length === 0 ? (
            <div className="p-6 text-center bg-yellow-50 rounded-lg text-yellow-700">
              No external users available to add.
            </div>
          ) : (
            <div className="space-y-4">
              {/* User Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select User
                </label>
                <select
                  value={selectedUserId}
                  onChange={(e) => {
                    setSelectedUserId(e.target.value);
                    setMessage("");
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-indigo-500 focus:border-indigo-500 text-base transition appearance-none"
                >
                  <option value="">-- Choose a user --</option>
                  {availableUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assign Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => {
                    setSelectedRole(e.target.value);
                    setMessage("");
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-indigo-500 focus:border-indigo-500 text-base transition appearance-none"
                >
                  {ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-150 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedUserId || availableUsers.length === 0}
            className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-150 disabled:opacity-50"
          >
            Confirm Add User
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---

export const UsersPage = () => {
  const [companyUsers, setCompanyUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter states
  const [nameEmailFilter, setNameEmailFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filteredUsers = useMemo(() => {
    let filtered = companyUsers;

    // 1. Name/Email Filter
    if (nameEmailFilter) {
      const search = nameEmailFilter.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search)
      );
    }

    // 2. Role Filter
    if (roleFilter) {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    // 3. Status Filter
    if (statusFilter) {
      filtered = filtered.filter((user) => user.status === statusFilter);
    }

    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [companyUsers, nameEmailFilter, roleFilter, statusFilter]);

  const analytics = useMemo(() => {
    const total = companyUsers.length;
    const managers = companyUsers.filter((u) => u.role === "Manager").length;
    const employees = companyUsers.filter((u) => u.role === "Employee").length;
    const active = companyUsers.filter((u) => u.status === "Active").length;

    return {
      total,
      managers,
      employees,
      active,
    };
  }, [companyUsers]);

  // Derived State: Paginated Users
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleAddUser = async ({ name, email, role }) => {
    if (!isAuthenticated || !userId || !db) {
      console.error(
        "Not authenticated or DB not initialized. Cannot add user."
      );
      return;
    }

    const newUser = {
      name: name,
      email: email,
      role: role,
      status: "Active", // Default status upon adding
      joined_at: new Date().toISOString().split("T")[0],
      createdAt: new Date(),
      addedBy: userId,
    };

    try {
      const appId =
        typeof __app_id !== "undefined" ? __app_id : "default-app-id";
      const collectionPath = `artifacts/${appId}/users/${userId}/company_users`;
      const newDocRef = doc(collection(db, collectionPath));
      await setDoc(newDocRef, newUser);
      console.log("New user added successfully with ID:", newDocRef.id);
    } catch (error) {
      console.error("Error adding user document:", error);
    }
  };

  const handleRowClick = (id) => {
    console.log(`User ID ${id} clicked. Edit User Modal logic goes here.`);
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
          <td colSpan="5" className="py-12 text-center text-indigo-600">
            <Loader2 className="w-6 h-6 animate-spin inline-block mr-2" />
            Loading company users...
          </td>
        </tr>
      );
    }

    if (filteredUsers.length === 0) {
      return (
        <tr className="bg-white">
          <td colSpan="5" className="py-12 text-center text-gray-500">
            <AlertTriangle className="w-5 h-5 inline-block mr-1" />
            No users match your current filters.
          </td>
        </tr>
      );
    }

    return paginatedUsers.map((user) => (
      <tr
        key={user.id}
        className="group border-b border-gray-100 hover:bg-indigo-50 transition duration-150 cursor-pointer"
        onClick={() => handleRowClick(user.id)}
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
              user.role === "Manager"
                ? "bg-purple-100 text-purple-800"
                : "bg-indigo-100 text-indigo-800"
            }`}
          >
            {user.role}
          </span>
        </td>
        <td className="px-6 py-4 text-sm text-gray-500">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
              user.status === "Active"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {user.status}
          </span>
        </td>
        <td className="px-6 py-4 text-sm text-gray-500 font-mono">
          Joined: {new Date(user.joined_at).toLocaleDateString()}
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
        {/* Modal */}
        <AddUserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddUser={handleAddUser}
          existingUsers={companyUsers}
        />

        {/* Breadcrumb */}
        <Breadcrumb />

        {/* Header & New Button */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">
            User Management
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-700 transition duration-300 transform hover:scale-[1.02]"
            disabled={!isAuthenticated}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New User
          </button>
        </div>

        {/* Analytics Section */}
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          User Statistics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Total Users"
            value={analytics.total}
            icon={Users}
            color="text-indigo-600"
          />
          <StatCard
            title="Managers"
            value={analytics.managers}
            icon={Briefcase}
            color="text-purple-600"
          />
          <StatCard
            title="Employees"
            value={analytics.employees}
            icon={User}
            color="text-blue-600"
          />
          <StatCard
            title="Active Users"
            value={analytics.active}
            icon={CheckCircle}
            color="text-green-600"
          />
        </div>

        {/* Filter and Table Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          {/* Filters */}
          <div className="flex flex-wrap items-end gap-4 mb-6 pb-6 border-b border-gray-100">
            <Filter className="w-5 h-5 text-gray-400 mr-2 self-center hidden sm:block" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-grow">
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
                options={ROLES}
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

          {/* Table */}
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

          {/* Pagination */}
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
              {/* Simple Page Indicator */}
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium">
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
