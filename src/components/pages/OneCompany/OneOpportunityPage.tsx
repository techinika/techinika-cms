"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Users,
  Eye,
  MousePointerClick,
  FileText,
  Briefcase,
  MapPin,
  X,
  ChevronDown,
  Clock,
  AlertTriangle,
  Download,
  ArrowLeft,
} from "lucide-react";
import {
  ApplicationFeedback,
  ApplicationPayload,
  Opportunity,
} from "@/types/opportunity";
import { StatCard } from "@/components/ui/stat-card";
import Loading from "@/app/loading";
import { getOpportunityById } from "@/supabase/CRUD/GET/getOpportunityById";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { getSignedUrl } from "@/supabase/CRUD/GET/getSignedUrl";
import ApplicationView from "@/components/parts/ApplicationView";
import { StatusBadge } from "@/components/ui/status-badge";

export const OneOpportunityPage = ({
  companySlug,
  opportunityId,
}: {
  companySlug: string;
  opportunityId: string;
}) => {
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [applications, setApplications] = useState<ApplicationPayload[]>([]);
  const [loading, setLoading] = useState(true);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState<
    string | null
  >(null);
  const [documentUrl, setDocumentUrl] = useState("");
  const [documentType, setDocumentType] = useState<string>("");

  const selectedApplication = useMemo(() => {
    return applications.find(
      (app: ApplicationPayload) => app?.id === selectedApplicationId
    );
  }, [applications, selectedApplicationId]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getOpportunityById(opportunityId);

        if (data) {
          setOpportunity(data.opportunity ?? null);
          const formattedApplications = (data.applications ?? []).map(
            (item) => ({
              ...item.application,
              feedback: item.feedback,
            })
          );
          setApplications(formattedApplications);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDocumentClick = (url: string) => {
    setDocumentUrl(url);
    if (url.toLowerCase().endsWith(".pdf")) {
      setDocumentType("pdf");
    } else {
      setDocumentType("other");
    }
    setIsSidebarOpen(true);
    setSelectedApplicationId(null);
  };

  const handleApplicationRowClick = (appId: string) => {
    setSelectedApplicationId(appId);
    setDocumentUrl("");
    setIsSidebarOpen(true);
  };

  const DocumentPreviewSidebar = () => {
    const isPdf = documentType === "pdf";

    if (documentUrl) {
      return (
        <div className="p-6 h-full flex flex-col">
          <h3 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">
            Document Preview
          </h3>
          <div className="grow overflow-y-auto bg-gray-100 rounded">
            {isPdf ? (
              <iframe
                src={documentUrl}
                className="w-full h-full border-0 rounded"
                title="Document Preview"
              ></iframe>
            ) : (
              <div className="p-8 text-center text-gray-600 space-y-4">
                <Download className="w-8 h-8 mx-auto text-primary" />
                <p className="font-semibold">
                  Document Not Directly Embeddable
                </p>
                <p className="text-sm">
                  This file type must be downloaded to view. The link is
                  provided below.
                </p>
                <Link
                  href={documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary transition"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Document
                </Link>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (selectedApplication) {
      return (
        <ApplicationView
          selectedApplication={selectedApplication}
          companySlug={companySlug}
          closeSide={() => setIsSidebarOpen(false)}
          position={opportunity?.title ?? ""}
        />
      );
    }
    return (
      <div className="p-6 text-gray-500 text-center">
        Select an application or document to review.
      </div>
    );
  };

  if (!opportunity && loading) {
    return <Loading />;
  }

  if (!opportunity) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto p-6 bg-white rounded-xl shadow-lg text-center">
          <AlertTriangle className="w-8 h-8 mx-auto text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800">
            Opportunity Not Found
          </h1>
          <p className="text-gray-600 mt-2">
            The opportunity with ID `{opportunityId}` could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  const isExternalLink = opportunity?.application_link !== "apply";

  const getLatestFeedbackStatus = (
    feedbackArray: ApplicationFeedback[]
  ): string => {
    if (!feedbackArray || feedbackArray.length === 0) {
      return "received";
    }

    const sortedFeedback = [...feedbackArray].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return dateB - dateA;
    });

    const latestFeedback = sortedFeedback[0];
    return latestFeedback?.status ?? "received";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <Breadcrumb />
          <div
            className={`grow p-4 sm:p-8 transition-all duration-300 ${
              isSidebarOpen ? "lg:w-2/3 xl:w-3/4" : "w-full"
            }`}
          >
            <div className="max-w-full mx-auto">
              <div className="flex items-center mb-4">
                <Link
                  href="#"
                  className="text-primary hover:text-primary transition"
                >
                  <ArrowLeft className="w-5 h-5 mr-2 inline-block" />
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 truncate">
                  {opportunity.title}
                </h1>
              </div>

              <p className="text-sm text-gray-500 mb-6 flex items-center space-x-4">
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" /> {opportunity.location}
                </span>
                <span className="flex items-center">
                  <Briefcase className="w-4 h-4 mr-1" /> {opportunity.salary}
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" /> Posted:{" "}
                  {new Date(
                    opportunity?.created_at ?? new Date()
                  ).toLocaleDateString()}
                </span>
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                <StatCard
                  title="Total Views"
                  value={opportunity?.views.toLocaleString()}
                  icon={Eye}
                  color="text-primary"
                />
                <StatCard
                  title="Applications Received"
                  value={isExternalLink ? "N/A" : applications.length}
                  icon={Users}
                  color="text-green-600"
                />
                <StatCard
                  title="Link Clicks (External)"
                  value={0}
                  icon={MousePointerClick}
                  color="text-yellow-600"
                />
              </div>

              {isExternalLink && (
                <div className="p-6 bg-yellow-100 border border-yellow-300 rounded-xl mb-6 flex items-center space-x-3">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                  <p className="text-yellow-800 font-medium">
                    External Application Link: Applications must be managed on
                    the external site. Only link click metrics are tracked here.
                  </p>
                </div>
              )}

              {!isExternalLink && (
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Review Applications ({applications.length})
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Applicant
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contact
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Documents
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Review
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {applications.length === 0 ? (
                          <tr>
                            <td
                              colSpan={5}
                              className="py-8 text-center text-gray-500"
                            >
                              No applications submitted yet.
                            </td>
                          </tr>
                        ) : (
                          applications.map((app) => (
                            <tr
                              key={app?.id}
                              className="group border-b border-gray-100 hover:bg-indigo-50 transition duration-150 cursor-pointer"
                            >
                              <td className="px-6 py-4">
                                <p className="text-sm font-medium text-gray-900">
                                  {app?.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {app.email}
                                </p>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500">
                                {app.location}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500">
                                <StatusBadge
                                  status={getLatestFeedbackStatus(
                                    app?.feedback
                                  )}
                                />
                              </td>
                              <td className="px-6 py-4 text-sm space-x-2">
                                <button
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    handleDocumentClick(
                                      await getSignedUrl(
                                        app?.resume_url?.split(
                                          "applications/"
                                        )[1] ?? ""
                                      )
                                    );
                                  }}
                                  className="text-xs text-primary hover:text-primary font-medium border-b border-indigo-200 transition"
                                >
                                  Resume
                                </button>
                                {app?.portfolio_links &&
                                  app.portfolio_links.length > 0 &&
                                  app.portfolio_links.map((l, index) => {
                                    return (
                                      <button
                                        key={l}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDocumentClick(l ?? "");
                                        }}
                                        className="text-xs text-primary hover:text-primary font-medium border-b border-indigo-200 transition"
                                      >
                                        Portfolio ({index + 1})
                                      </button>
                                    );
                                  })}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleApplicationRowClick(app.id);
                                  }}
                                  className="inline-flex items-center text-xs font-semibold text-primary hover:text-primary"
                                >
                                  <ChevronDown className="w-4 h-4 mr-1 transition group-hover:rotate-180" />
                                  Details
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`fixed top-0 right-0 h-full bg-gray-50 shadow-2xl z-40 transition-all duration-300 overflow-y-auto ${
          isSidebarOpen ? "w-full lg:w-2/3 xl:w-2/4" : "w-0"
        }`}
        style={{
          opacity: isSidebarOpen ? 1 : 0,
          pointerEvents: isSidebarOpen ? "auto" : "none",
        }}
      >
        <div className="sticky top-0 bg-white p-4 border-b border-gray-100 flex justify-between items-center z-50">
          <h2 className="text-xl font-bold text-gray-800">Review Panel</h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="h-full">
          <DocumentPreviewSidebar />
        </div>
      </div>
    </div>
  );
};
