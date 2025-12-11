"use client";

import { APPLICATION_STATUSES, ApplicationPayload } from "@/types/opportunity";
import {
  Briefcase,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Send,
  User,
} from "lucide-react";
import { useState } from "react";
import { StatusBadge } from "../ui/status-badge";
import { formatPlainTextToHTML } from "@/lib/utils";
import { saveApplicationFeedback } from "@/supabase/CRUD/INSERT/sendApplicationFeedback";
import { useAuth } from "@/lib/AuthContext";

function ApplicationView({
  selectedApplication,
  companySlug,
  closeSide,
  position,
}: {
  selectedApplication: ApplicationPayload;
  companySlug: string;
  closeSide: () => void;
  position: string;
}) {
  const auth = useAuth();
  console.log("user", auth);
  const [newFeedbackMessage, setNewFeedbackMessage] = useState("");
  const [newFeedbackStatus, setNewFeedbackStatus] = useState("received");
  const [sending, setSending] = useState(false);

  const handleFeedbackSubmit = async () => {
    setSending(true);
    try {
      await saveApplicationFeedback(
        selectedApplication?.id,
        newFeedbackMessage,
        auth?.user?.id ?? "",
        newFeedbackStatus,
        selectedApplication?.email ?? "",
        selectedApplication?.name ?? "",
        companySlug,
        position
      );

      setNewFeedbackMessage("");
      setNewFeedbackStatus("received");
      closeSide();
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <h3 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4 flex items-center">
        <User className="w-5 h-5 mr-2 text-primary" />
        Review: {selectedApplication?.name}
      </h3>

      <div className="space-y-2 mb-4 text-sm">
        <div className="flex items-center">
          <Mail className="w-4 h-4 mr-2 text-gray-400" />
          {selectedApplication.email}
        </div>
        <div className="flex items-center">
          <Phone className="w-4 h-4 mr-2 text-gray-400" />
          {selectedApplication.phone || "N/A"}
        </div>
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
          {selectedApplication.location || "N/A"}
        </div>
        <div className="flex items-center">
          <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
          Current Status:{" "}
          <StatusBadge status={selectedApplication?.email ?? ""} />
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-4 max-h-1/2 overflow-y-auto">
        <p className="text-xs font-semibold text-gray-700 mb-1">
          Cover Letter:
        </p>
        <div
          dangerouslySetInnerHTML={{
            __html: formatPlainTextToHTML(
              selectedApplication?.cover_letter || "No cover letter provided."
            ),
          }}
          className="text-sm prose max-w-none! text-gray-600 italic"
        ></div>
      </div>

      <div className="shrink-0 mb-4 border-t pt-4">
        <h4 className="text-lg font-semibold text-gray-700 mb-2">
          Feedback History ({selectedApplication?.name})
        </h4>
        <div className="max-h-40 overflow-y-auto space-y-3 p-1">
          {selectedApplication.feedback.length === 0 ? (
            <p className="text-sm text-gray-500">No review history yet.</p>
          ) : (
            selectedApplication.feedback.map((f) => (
              <div
                key={f.id}
                className="p-3 bg-white rounded-lg shadow-sm border border-gray-100"
              >
                <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                  <StatusBadge status={f.status} />
                  <span className="text-xs">
                    {new Date(f.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700 italic">
                  {f.feedback_message}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-auto pt-4 border-t">
        <h4 className="text-lg font-semibold text-gray-700 mb-3">
          Add New Feedback
        </h4>
        <div className="space-y-3">
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700"
            >
              Update Status
            </label>
            <select
              id="status"
              value={newFeedbackStatus}
              onChange={(e) => setNewFeedbackStatus(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded text-sm transition appearance-none focus:ring-primary focus:border-primary"
            >
              {APPLICATION_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700"
            >
              Message (Optional)
            </label>
            <textarea
              id="message"
              rows={3}
              value={newFeedbackMessage}
              onChange={(e) => setNewFeedbackMessage(e.target.value)}
              placeholder="Enter your private feedback or notes here..."
              className="w-full mt-1 p-3 border border-gray-300 rounded text-sm transition focus:ring-primary focus:border-primary"
            ></textarea>
          </div>

          <button
            onClick={handleFeedbackSubmit}
            disabled={sending}
            className="w-full flex items-center justify-center px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary transition duration-150 disabled:opacity-50"
          >
            {sending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            Submit Feedback & Status
          </button>
        </div>
      </div>
    </div>
  );
}

export default ApplicationView;
