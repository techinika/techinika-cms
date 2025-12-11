"use client";

import { CheckboxToggle } from "@/components/ui/checkbox-toggle";
import { InputField } from "@/components/ui/input-field";
import { SelectField } from "@/components/ui/select-field";
import { TextareaField } from "@/components/ui/textarea-field";
import { useAuth } from "@/lib/AuthContext";
import { generateSlug } from "@/lib/functions";
import { COMPANY_STATUSES } from "@/types/company";
import {
  AlertTriangle,
  Briefcase,
  Building,
  CheckCircle,
  Globe,
  Hash,
  Heart,
  Image,
  Info,
  Link,
  Loader2,
  Mail,
  MapPin,
  Plus,
  Settings,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

const initialCompanyData = {
  name: "",
  logo_url: "https://placehold.co/40x40/4f46e5/ffffff?text=C",
  description: "",
  email: "",
  country: "",
  website: "",
  location: "",
  industry: "",
  status: COMPANY_STATUSES[0],
  tags: "",
  is_featured: true,
  learn_more_links: "[]", // Start as empty JSON array string
};

export const CompanySidebar = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const auth = useAuth();
  const [companyData, setCompanyData] = useState(initialCompanyData);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value, type, checked } = e.target;
    setCompanyData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setStatusMessage({ type: "", text: "" });
  };

  const validateForm = () => {
    const requiredFields = ["name", "description"];
    try {
      JSON.parse(companyData.learn_more_links);
    } catch (e) {
      return "Learn More Links must be valid JSON.";
    }
    return null;
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setStatusMessage({
        type: "error",
        text: `Validation Error: ${validationError}`,
      });
      return;
    }

    setLoading(true);

    const slug = generateSlug(companyData.name);

    const finalData = {
      ...companyData,
      slug: slug,
      lang: "en", // default language
      learn_more_links: JSON.parse(companyData.learn_more_links),
      created_at: new Date(),
      updated_at: new Date(),
      reviews_count: 0,
      avg_rating: 0,
      roles: [],
    };

    try {
      setStatusMessage({
        type: "success",
        text: `Company "${companyData.name}" created successfully!`,
      });
      setCompanyData(initialCompanyData); // Reset form
      setTimeout(onClose, 1500); // Close sidebar after success
    } catch (error) {
      console.error("Error creating company:", error);
      setStatusMessage({
        type: "error",
        text: `Failed to create company.`,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setStatusMessage({ type: "", text: "" });
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden transition-opacity duration-300 ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className="absolute inset-0 bg-gray-900 bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl overflow-y-auto transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Building className="w-5 h-5 mr-2 text-indigo-600" />
            Add New Company
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {statusMessage.text && (
            <div
              className={`p-3 flex items-center shadow-sm border text-sm ${
                statusMessage.type === "success"
                  ? "bg-green-100 border-green-400 text-green-800"
                  : "bg-red-100 border-red-400 text-red-800"
              }`}
            >
              {statusMessage.type === "success" ? (
                <CheckCircle className="w-4 h-4 mr-2" />
              ) : (
                <AlertTriangle className="w-4 h-4 mr-2" />
              )}
              <p className="font-medium">{statusMessage.text}</p>
            </div>
          )}

          {/* Basic Info */}
          <InputField
            name="name"
            label="Company Name"
            icon={Building}
            required
            value={companyData.name}
            onChange={handleChange}
            placeholder="e.g., Acme Corp"
          />

          <TextareaField
            name="description"
            label="Company Description"
            icon={Info}
            required
            rows={4}
            value={companyData.description}
            onChange={handleChange}
            placeholder="A brief overview of the company, mission, and culture."
          />

          <InputField
            name="logo_url"
            label="Logo URL"
            icon={Image}
            type="url"
            value={companyData.logo_url}
            onChange={handleChange}
            placeholder="Paste image link here (e.g., https://example.com/logo.png)"
          />

          <div className="grid grid-cols-1 gap-4">
            <InputField
              name="website"
              label="Website"
              icon={Link}
              type="url"
              value={companyData.website}
              onChange={handleChange}
              placeholder="https://www.company.com"
            />
            <InputField
              name="email"
              label="Contact Email"
              icon={Mail}
              type="email"
              value={companyData.email}
              onChange={handleChange}
              placeholder="hr@company.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField
              name="location"
              label="Location (City/State)"
              icon={MapPin}
              value={companyData.location}
              onChange={handleChange}
              placeholder="San Francisco, CA"
            />
            <InputField
              name="country"
              label="Country"
              icon={Globe}
              value={companyData.country}
              onChange={handleChange}
              placeholder="United States"
            />
          </div>

          <div className="space-y-4">
            <InputField
              name="industry"
              label="Industry"
              icon={Briefcase}
              value={companyData.industry}
              onChange={handleChange}
              placeholder="e.g., Software, Finance, Healthcare"
            />
            <InputField
              name="tags"
              label="Tags (Comma Separated)"
              icon={Hash}
              value={companyData.tags}
              onChange={handleChange}
              placeholder="e.g., SaaS, B2B, Startup"
            />

            <SelectField
              name="status"
              label="Company Status"
              icon={Settings}
              options={COMPANY_STATUSES}
              value={companyData.status}
              onChange={handleChange}
              required
            />

            <CheckboxToggle
              name="is_featured"
              label="Mark as Featured"
              checked={companyData.is_featured}
              onChange={handleChange}
              icon={Heart}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-3 bg-indigo-600 text-white font-semibold border-b-4 border-indigo-800 hover:bg-indigo-700 transition duration-300 transform active:border-b-0 active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <Plus className="w-5 h-5 mr-2" />
            )}
            {loading ? "Creating Company..." : "Create Company Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};
