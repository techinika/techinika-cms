"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Calendar,
  Users,
  MapPin,
  Filter,
  Search,
  Plus,
  Clock,
  Loader2,
  Database,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";

const MOCK_EVENTS = [
  {
    id: "e1",
    name: "Annual Tech Summit 2026",
    type: "Conference",
    location: "Virtual",
    capacity: 1000,
    attendees: 850,
    date: "2026-04-20T09:00:00",
    status: "Upcoming",
  },
  {
    id: "e2",
    name: "Q1 Sales Training Workshop",
    type: "Workshop",
    location: "New York",
    capacity: 50,
    attendees: 48,
    date: "2025-12-15T14:00:00",
    status: "Completed",
  },
  {
    id: "e3",
    name: "Client Appreciation Mixer",
    type: "Networking",
    location: "London",
    capacity: 150,
    attendees: 10,
    date: "2026-01-10T18:30:00",
    status: "Draft",
  },
  {
    id: "e4",
    name: "Product Demo Webinar",
    type: "Webinar",
    location: "Virtual",
    capacity: 500,
    attendees: 401,
    date: "2025-11-28T11:00:00",
    status: "Completed",
  },
  {
    id: "e5",
    name: "Team Building Day",
    type: "Internal",
    location: "HQ Office",
    capacity: 80,
    attendees: 0,
    date: "2026-05-01T10:00:00",
    status: "Upcoming",
  },
];

const EVENT_TYPES = [
  "Conference",
  "Workshop",
  "Networking",
  "Webinar",
  "Internal",
];
const EVENT_STATUSES = ["Upcoming", "Completed", "Draft", "Cancelled"];

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
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm transition duration-150"
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
      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 text-sm transition duration-150 appearance-none"
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

// --- Main Component ---

export const EventsPage = () => {
  const [events, setEvents] = useState([]);
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

  // Derived State: Filtered Events
  const filteredEvents = useMemo(() => {
    let filtered = events;

    // 1. Name Filter
    if (nameFilter) {
      filtered = filtered.filter((event) =>
        event.name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    // 2. Status Filter
    if (statusFilter) {
      filtered = filtered.filter((event) => event.status === statusFilter);
    }

    // 3. Type Filter
    if (typeFilter) {
      filtered = filtered.filter((event) => event.type === typeFilter);
    }

    if (dateFilter) {
      const filterDate = new Date(dateFilter).getTime();
      filtered = filtered.filter((event) => {
        const eventStartDate = new Date(event.date).getTime();
        // Check if event starts on or after the filter date
        return eventStartDate >= filterDate;
      });
    }

    // Sort by event date (closest upcoming first)
    return filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [events, nameFilter, statusFilter, typeFilter, dateFilter]);

  // Derived State: Analytics
  const analytics = useMemo(() => {
    const total = events.length;
    const upcoming = events.filter((e) => e.status === "Upcoming").length;
    const completed = events.filter((e) => e.status === "Completed").length;
    const totalCapacity = events.reduce((sum, e) => sum + (e.capacity || 0), 0);
    const totalAttendees = events.reduce(
      (sum, e) => sum + (e.attendees || 0),
      0
    );
    const overallFillRate =
      totalCapacity > 0
        ? `${Math.round((totalAttendees / totalCapacity) * 100)}%`
        : "0%";

    return {
      total,
      upcoming,
      completed,
      totalCapacity: totalCapacity.toLocaleString(),
      overallFillRate,
    };
  }, [events]);

  // Derived State: Paginated Events
  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredEvents.slice(startIndex, endIndex);
  }, [filteredEvents, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

  const handleNewEvent = async () => {
    if (!isAuthenticated || !userId || !db) {
      console.error(
        "Not authenticated or DB not initialized. Cannot add event."
      );
      return;
    }

    const now = new Date();
    const futureDate = new Date(now.setMonth(now.getMonth() + 1)); // One month from now

    const newEvent = {
      name: "New Draft Event",
      type: "Draft",
      status: "Draft",
      location: "To Be Determined",
      capacity: 50,
      attendees: 0,
      date: futureDate.toISOString().substring(0, 16), // YYYY-MM-DDTHH:MM
      createdAt: serverTimestamp(),
      createdBy: userId,
    };

    try {
      const appId =
        typeof __app_id !== "undefined" ? __app_id : "default-app-id";
      const collectionPath = `artifacts/${appId}/users/${userId}/events`;
      const newDocRef = doc(collection(db, collectionPath));
      await setDoc(newDocRef, newEvent);
      console.log("New event added successfully with ID:", newDocRef.id);
    } catch (error) {
      console.error("Error adding document:", error);
      // Show custom alert message instead of console.error in production
    }
  };

  const handleRowClick = (id) => {
    console.log(
      `Event ID ${id} clicked. Navigation/Modal view logic goes here.`
    );
    // In a real app, this would trigger a modal or routing to /events/{id}
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderTableContent = () => {
    if (loading) {
      return (
        <tr className="bg-gray-50">
          <td colSpan="7" className="py-12 text-center text-primary">
            <Loader2 className="w-6 h-6 animate-spin inline-block mr-2" />
            Loading events...
          </td>
        </tr>
      );
    }

    if (filteredEvents.length === 0) {
      return (
        <tr className="bg-white">
          <td colSpan="7" className="py-12 text-center text-gray-500">
            <AlertTriangle className="w-5 h-5 inline-block mr-1" />
            No events match your current filters.
          </td>
        </tr>
      );
    }

    return paginatedEvents.map((event) => {
      const eventDate = new Date(event.date);
      const fillRate =
        event.capacity > 0
          ? Math.round((event.attendees / event.capacity) * 100)
          : 0;
      const fillColor =
        fillRate > 90
          ? "bg-red-500"
          : fillRate > 50
          ? "bg-yellow-500"
          : "bg-green-500";

      return (
        <tr
          key={event.id}
          className="group border-b border-gray-100 hover:bg-blue-50 transition duration-150 cursor-pointer"
          onClick={() => handleRowClick(event.id)}
        >
          <td className="px-6 py-4 text-sm font-medium text-gray-900 truncate max-w-xs">
            {event.name}
          </td>
          <td className="px-6 py-4 text-sm text-gray-500">
            <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
              {event.type}
            </span>
          </td>
          <td className="px-6 py-4 text-sm text-gray-500">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1 text-gray-400" />
              {event.location}
            </div>
          </td>
          <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
            {eventDate.toLocaleDateString()}
            <span className="block text-xs text-gray-500">
              {eventDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </td>
          <td className="px-6 py-4 text-sm font-semibold text-gray-700">
            {event.attendees.toLocaleString()} /{" "}
            {event.capacity.toLocaleString()}
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
              <div
                className={`${fillColor} h-1.5 rounded-full`}
                style={{ width: `${fillRate}%` }}
              ></div>
            </div>
          </td>
          <td className="px-6 py-4">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                event.status === "Upcoming"
                  ? "bg-blue-100 text-blue-800"
                  : event.status === "Completed"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {event.status}
            </span>
          </td>
          <td className="px-6 py-4 text-right">
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition duration-150 ml-auto" />
          </td>
        </tr>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <Breadcrumb />

        {/* Header & New Button */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Events Management
          </h1>
          <button
            onClick={handleNewEvent}
            className="flex items-center px-4 py-2 bg-primary text-white font-semibold rounded-xl shadow-md hover:bg-primary transition duration-300 transform hover:scale-[1.02]"
            disabled={!isAuthenticated}
          >
            <Plus className="w-5 h-5 mr-2" />
            New Event
          </button>
        </div>

        {/* Analytics Section */}
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Event Analytics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Total Events"
            value={analytics.total}
            icon={Calendar}
            color="text-primary"
          />
          <StatCard
            title="Upcoming Events"
            value={analytics.upcoming}
            icon={Clock}
            color="text-yellow-600"
          />
          <StatCard
            title="Total Capacity"
            value={analytics.totalCapacity}
            icon={Users}
            color="text-green-600"
          />
          <StatCard
            title="Overall Fill Rate"
            value={analytics.overallFillRate}
            icon={TrendingUp}
            color="text-primary"
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
                placeholder="e.g., Summit"
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
                options={EVENT_STATUSES}
              />
              <FilterSelect
                label="Filter by Type"
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setCurrentPage(1);
                }}
                options={EVENT_TYPES}
              />
              <FilterInput
                label="Events Starting On/After"
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
                    Event Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
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
                {Math.min(currentPage * itemsPerPage, filteredEvents.length)}
              </span>{" "}
              of <span className="font-semibold">{filteredEvents.length}</span>{" "}
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
                  currentPage === totalPages || filteredEvents.length === 0
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
