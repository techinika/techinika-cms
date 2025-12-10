"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Mail,
  Users,
  TrendingUp,
  Calendar,
  Search,
  UploadCloud,
  FileText,
  ArrowLeft,
  ArrowRight,
  Clock,
} from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { SubAnalyticsCard } from "@/components/parts/AnalyticsCard";
import { Subscriber } from "@/types/main";
import { getSubscribers } from "@/supabase/CRUD/GET";
import Loading from "@/app/loading";

const SUBSCRIBERS_PER_PAGE = 8;
const CURRENT_DATE_MOCK = new Date();

const CSVImportSection = () => {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFileName(files[0].name);
    } else {
      setFileName(null);
    }
  };

  const handleUpload = () => {
    if (fileName) {
      alert(
        `Mock upload started for: ${fileName}. Data will be processed in the background.`
      );
      setFileName(null);
    } else {
      alert("Please select a CSV file to import.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-full flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
          <UploadCloud className="w-5 h-5 mr-2 text-primary" /> Import
          Subscribers
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Upload a CSV file containing new subscriber emails and subscription
          dates.
        </p>

        <div className="flex items-center space-x-3">
          <label className="flex-grow cursor-pointer">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition">
              <FileText className="w-6 h-6 mx-auto text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                {fileName ? (
                  <span className="font-medium text-primary">{fileName}</span>
                ) : (
                  "Click to select a CSV file"
                )}
              </p>
            </div>
          </label>
        </div>
      </div>
      <button
        onClick={handleUpload}
        disabled={!fileName}
        className="mt-4 w-full flex items-center justify-center px-4 py-2.5 bg-primary text-white font-semibold rounded-lg shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <UploadCloud className="w-5 h-5 mr-2" />
        Upload & Process
      </button>
    </div>
  );
};

const SubscriberManagementPage = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getSubscribers();
        setSubscribers(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const { totalSubscribers, newThisMonth } = useMemo(() => {
    const total = subscribers.length;

    const currentYear = CURRENT_DATE_MOCK.getFullYear();
    const currentMonth = CURRENT_DATE_MOCK.getMonth();

    const newSubs = subscribers.filter((sub) => {
      const subDate = new Date(sub.created_at);
      return (
        subDate.getFullYear() === currentYear &&
        subDate.getMonth() === currentMonth
      );
    }).length;

    return { totalSubscribers: total, newThisMonth: newSubs };
  }, [subscribers]);

  const filteredSubscribers = useMemo(() => {
    let filtered = subscribers;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((sub) =>
        sub.email.toLowerCase().includes(searchLower)
      );
    }

    filtered.sort(
      (a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)
    );

    setCurrentPage(1);

    return filtered;
  }, [subscribers, searchTerm]);

  const totalItems = filteredSubscribers.length;
  const totalPages = Math.ceil(totalItems / SUBSCRIBERS_PER_PAGE);
  const start = (currentPage - 1) * SUBSCRIBERS_PER_PAGE;
  const end = start + SUBSCRIBERS_PER_PAGE;
  const currentSubscribers = filteredSubscribers.slice(start, end);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10">
      <div className="page">
        <Breadcrumb />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Email Subscribers
          </h1>
          <p className="text-gray-500 mt-1">
            Monitor growth and manage your mailing list audience.
          </p>
        </div>

        <div className="grid grid-cols-1 items-start lg:grid-cols-3 gap-6 mb-10">
          <SubAnalyticsCard
            title="Total Subscribers"
            value={totalSubscribers.toLocaleString()}
            icon={Users}
            colorClass="#10B981" // Green-500
            increase={newThisMonth}
          />
          <SubAnalyticsCard
            title="New This Month"
            value={newThisMonth.toLocaleString()}
            icon={TrendingUp}
            colorClass="#F59E0B"
            increase={0}
          />
          <CSVImportSection />
        </div>

        {/* Filters and List Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Mail className="w-6 h-6 mr-2 text-red-600" /> Subscriber List
          </h2>

          {/* Filter Input */}
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by email address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary shadow-sm"
            />
          </div>
        </div>

        {/* Subscriber List Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Table Header */}
          <div className="font-bold text-gray-500 uppercase text-xs p-4 flex border-b border-gray-100 bg-gray-50">
            <div className="w-7/12">Email Address</div>
            <div className="w-4/12">Subscription Date</div>
            <div className="w-1/12 text-right">Actions</div>
          </div>

          <div>
            {currentSubscribers.length > 0 ? (
              currentSubscribers.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center p-4 border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <div className="w-7/12 flex items-center space-x-3 text-gray-800 font-medium">
                    <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="truncate">{sub.email}</span>
                  </div>
                  <div className="w-4/12 text-sm text-gray-600 flex items-center">
                    <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                    {new Date(sub.created_at).toLocaleDateString()}
                    <Clock className="w-4 h-4 ml-3 mr-1 text-gray-400" />
                    {new Date(sub.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div className="w-1/12 flex justify-end">
                    <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                      Remove
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-8 text-gray-500">
                No subscribers match your current search criteria.
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-between items-center p-4 border-t border-gray-100">
              <div className="text-sm text-gray-600">
                Showing {start + 1} to {Math.min(end, totalItems)} of{" "}
                {totalItems} results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className="flex items-center px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" /> Previous
                </button>
                <div className="px-3 py-1 text-sm font-semibold text-gray-800 bg-gray-100 rounded-lg">
                  {currentPage} / {totalPages}
                </div>
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="flex items-center px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition"
                >
                  Next <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriberManagementPage;
