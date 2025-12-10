"use client";

import { useState } from "react";

import {
  Briefcase,
  MapPin,
  DollarSign,
  Mail,
  Link,
  Hash,
  FileText,
  Send,
  Loader2,
  AlertTriangle,
  X,
  Calendar,
  Settings,
  Globe,
  Clock,
  Zap,
  Type,
  ListChecks,
  Heart,
  Menu,
} from "lucide-react";
import {
  EMPLOYMENT_TYPES,
  LOCATION_TYPES,
  Opportunity,
  OPPORTUNITY_STATUSES,
  OPPORTUNITY_TYPES,
} from "@/types/opportunity";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { TextareaField } from "@/components/ui/textarea-field";
import { generateSlug } from "@/lib/functions";
import { CheckboxToggle } from "@/components/ui/checkbox-toggle";
import { MarkdownEditor } from "@/components/ui/markdown-editor";
import { SelectField } from "@/components/ui/select-field";
import { InputField } from "@/components/ui/input-field";

export const NewOpportunityPage = ({
  companySlug,
}: {
  companySlug: string;
}) => {
  const [formData, setFormData] = useState<Opportunity>({
    id: Date.now().toString(),
    title: "",
    slug: "",
    type: OPPORTUNITY_TYPES[0],
    location: "",
    location_type: "Hybrid",
    country: "",
    employment_type: EMPLOYMENT_TYPES[0],
    salary: "",
    application_type: "Internal", // Internal or External (custom field for UI logic)
    application_link: "",
    contact_email: "",
    tags: "",
    views: 0,
    description: "", // Short summary
    full_description: "", // Rich content
    requirements: "",
    benefits: "",
    status: OPPORTUNITY_STATUSES[0],
    featured: false,
    expires_at: "", // date-time-local string
    seo_description: "",
    lang: "english",
    hints: {
      bestCandidate: "",
      winningTips: [],
    },
  });

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  const handleChange = (e: { target: any }) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev: any) => {
      const newForm = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      if (name === "title") {
        newForm.slug = generateSlug(value);
      }
      if (name === "application_type") {
        newForm.application_link = "";
        newForm.contact_email = "";
      }

      return newForm;
    });
    setStatusMessage({ type: "", text: "" });
  };

  const validateForm = () => {
    const requiredFields = [
      "title",
      "type",
      "location",
      "description",
      "full_description",
      "status",
      "employment_type",
      "location_type",
    ];

    if (
      formData.application_type === "External" &&
      !formData.application_link
    ) {
      requiredFields.push("application_link");
    }

    for (const field of requiredFields) {
      if (!formData[field]) {
        return `Field required: ${field.replace("_", " ").toUpperCase()}`;
      }
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.title ||
      !formData.description ||
      !formData.full_description
    ) {
      setStatusMessage({
        type: "error",
        text: "Please fill required fields: title, description and full description.",
      });
      return;
    }

    setLoading(true);
    setStatusMessage({ type: "", text: "" });

    // prepare payload
    const payload: OpportunityInsert = {
      title: formData.title,
      slug: formData.slug || generateSlug(formData.title),
      type: formData.type,
      location: formData.location,
      work_mode: formData.work_mode,
      country: formData.country || undefined,
      employment_type: formData.employment_type,
      salary: formData.salary || undefined,
      application_type: formData.application_type,
      application_link: formData.application_link || undefined,
      contact_email: formData.contact_email || undefined,
      tags: formData.tags || undefined,
      description: formData.description,
      full_description: formData.full_description,
      requirements: formData.requirements || undefined,
      benefits: formData.benefits || undefined,
      status: formData.status,
      featured: !!formData.featured,
      expires_at: formData.expires_at || undefined,
      seo_description: formData.seo_description || undefined,
      lang: formData.lang || "english",
      // hints omitted - your table already supports it
    };

    try {
      const result = await createOpportunity(payload, companySlug);
      if (result.error) {
        console.error("Create opportunity error:", result.error);
        setStatusMessage({
          type: "error",
          text: `Failed to create opportunity: ${
            result.error.message || result.error
          }`,
        });
      } else {
        setStatusMessage({
          type: "success",
          text: `Opportunity "${result.data.title}" created successfully!`,
        });
        // reset form
        setFormData(initialForm);
        // optionally redirect to the opportunity page
        // router.push(`/company/${companySlug}/opportunities/${result.data.slug}`);
      }
    } catch (err: any) {
      console.error(err);
      setStatusMessage({
        type: "error",
        text: `Unexpected error: ${err.message || err}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <Breadcrumb />
        <div className="mb-10 border-b-2 pb-6 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center">
              <Briefcase className="w-8 h-8 mr-3 text-primary" />
              Post a New Opportunity
            </h1>
            <p className="mt-2 text-gray-600">
              Enter the details for your new job, tender, or grant posting.
            </p>
          </div>
        </div>

        {statusMessage.text && (
          <div
            className={`p-4 mb-6 flex items-center shadow-sm border ${
              statusMessage.type === "success"
                ? "bg-green-100 border-green-400 text-green-800"
                : "bg-red-100 border-red-400 text-red-800"
            }`}
          >
            {statusMessage.type === "success" ? (
              <Zap className="w-5 h-5 mr-3" />
            ) : (
              <AlertTriangle className="w-5 h-5 mr-3" />
            )}
            <p className="font-medium text-sm">{statusMessage.text}</p>
            <button
              onClick={() => setStatusMessage({ type: "", text: "" })}
              className="ml-auto text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="bg-white p-8 border border-gray-200 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3 flex items-center">
              <Menu className="w-5 h-5 mr-2 text-primary" />
              Core Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                name="title"
                label="Opportunity Title"
                icon={Briefcase}
                required
                placeholder="e.g., Lead DevOps Engineer"
                onChange={handleChange}
                value={formData["title"]}
              />
              <SelectField
                name="type"
                label="Opportunity Type"
                icon={Type}
                options={OPPORTUNITY_TYPES ?? []}
                required
                value={formData["type"]}
                onChange={handleChange}
              />

              <InputField
                name="slug"
                label="URL Slug (Auto-Generated)"
                icon={Link}
                placeholder="lead-devops-engineer"
                disabled
                className="bg-gray-50"
                onChange={handleChange}
                value={formData["slug"]}
              />
              <SelectField
                name="status"
                label="Posting Status"
                icon={Settings}
                options={OPPORTUNITY_STATUSES}
                required
                value={formData["status"]}
                onChange={handleChange}
              />

              <InputField
                name="salary"
                label="Salary / Budget Range"
                icon={DollarSign}
                placeholder="e.g., $120k - $150k"
                value={formData["salary"]}
                onChange={handleChange}
              />
              <InputField
                name="tags"
                label="Skills / Tags (Comma Separated)"
                icon={Hash}
                placeholder="e.g., Python, AWS, Terraform"
                value={formData["tags"]}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="bg-white p-8 border border-gray-200 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-primary" />
              Location & Employment
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SelectField
                name="employment_type"
                label="Employment Type"
                icon={Clock}
                options={EMPLOYMENT_TYPES}
                required
                value={formData["employment_type"]}
                onChange={handleChange}
              />
              <SelectField
                name="location_type"
                label="Location Type"
                icon={Globe}
                options={LOCATION_TYPES}
                required
                value={formData["location_type"]}
                onChange={handleChange}
              />

              <InputField
                name="country"
                label="Country"
                icon={Globe}
                placeholder="e.g., United States"
                value={formData["country"]}
                onChange={handleChange}
              />
            </div>
            <div className="mt-6">
              <InputField
                name="location"
                label="City / Region"
                icon={MapPin}
                required
                placeholder="e.g., San Francisco, CA or Worldwide"
                value={formData["location"]}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="bg-white p-8 border border-gray-200 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-primary" />
              Application & Timing
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                name="expires_at"
                label="Application Deadline (Date & Time)"
                icon={Calendar}
                type="datetime-local"
                value={formData["expires_at"]}
                onChange={handleChange}
              />

              <CheckboxToggle
                name="featured"
                label="Mark as Featured"
                checked={formData.featured}
                icon={Heart}
                onChange={handleChange}
              />

              <div className="col-span-1 md:col-span-2 space-y-4">
                <label className="block text-sm font-semibold text-gray-800">
                  Application Method
                </label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() =>
                      handleChange({
                        target: { name: "application_type", value: "Internal" },
                      })
                    }
                    className={`px-4 py-2 border text-sm font-medium transition duration-150 shadow-sm ${
                      formData.application_type === "Internal"
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    Internal Form (Recommended)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleChange({
                        target: { name: "application_type", value: "External" },
                      })
                    }
                    className={`px-4 py-2 border text-sm font-medium transition duration-150 shadow-sm ${
                      formData.application_type === "External"
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    External Link
                  </button>
                </div>

                <div className="mt-4">
                  {formData.application_type === "Internal" ? (
                    <InputField
                      name="contact_email"
                      label="Contact Email (Internal)"
                      icon={Mail}
                      placeholder="For applicant questions (optional)"
                      value={formData["contact_email"]}
                      onChange={handleChange}
                    />
                  ) : (
                    <InputField
                      name="application_link"
                      label="External Application Link"
                      icon={Link}
                      required
                      placeholder="https://thirdpartyportal.com/apply"
                      type="url"
                      value={formData["application_link"]}
                      onChange={handleChange}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 border border-gray-200 shadow-lg space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-primary" />
              Content Details
            </h2>

            <InputField
              name="seo_description"
              label="Short SEO Description (Max 160 characters)"
              icon={FileText}
              maxLength={160}
              placeholder="A concise, single-sentence summary for search engine results."
              value={formData["seo_description"]}
              onChange={handleChange}
            />

            <TextareaField
              name="description"
              label="Brief Summary (Short Description)"
              required
              rows={3}
              placeholder="A concise, attention-grabbing summary of the role. This appears on the listing page."
              onChange={handleChange}
              value={formData["description"]}
            />

            <MarkdownEditor
              name="full_description"
              label="Full Description (Rich Content Editor)"
              value={formData["full_description"]}
              onChange={handleChange}
              required
              placeholder="Use the formatting toolbar to add headings, bold text, and lists for a detailed, professional description."
              rows={15}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center px-6 py-4 bg-primary text-white font-semibold text-lg border-b-4 border-primary hover:bg-primary transition duration-300 transform active:border-b-0 active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin mr-3" />
            ) : (
              <Send className="w-6 h-6 mr-3" />
            )}
            {loading ? "Publishing Opportunity..." : "Publish New Opportunity"}
          </button>
        </form>
      </div>
    </div>
  );
};
