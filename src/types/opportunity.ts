import { Company } from "./company";

export const LOCATION_TYPES = ["In-Person", "Remote", "Hybrid"];

export interface Opportunity {
  id: string;
  title: string;
  slug: string;
  type: "Job" | "Tender" | "Grant" | "Internship" | "Other";
  organization?: string | null;
  companyId?: string | null;
  company?: Company | null;
  location: string;
  salary?: string | null;
  application_link?: string | null;
  contact_email?: string;
  tags?: string;
  description: string;
  full_description: string;
  requirements?: string | null;
  benefits?: string | null;
  status?: string;
  featured: boolean;
  views: number;
  created_at?: string;
  updated_at?: string;
  expires_at?: string;
  seo_description?: string | null;
  hints?: {
    bestCandidate: string;
    winningTips: string[];
  };
  location_type: "In-Person" | "Remote" | "Hybrid";
  country?: string;
  employment_type?: string;
  application_type?: string;
  lang?: string;
}

export const OPPORTUNITY_TYPES = [
  "Job",
  "Tender",
  "Grant",
  "Internship",
  "Other",
] as const;
export type OpportunityType = (typeof OPPORTUNITY_TYPES)[number];

export type ApplicationPayload = {
  id: string;
  opportunity_id: string;

  name?: string;
  email?: string;
  phone?: string;
  location?: string;

  resume_url?: string;
  supportingDocs?: (File | null)[];
  portfolio_links?: string[];
  cover_letter?: string;

  company_name?: string;
  tender_email?: string;
  proposal?: File | null;
  feedback: ApplicationFeedback[];
};

export interface ApplicationFeedback {
  id: string;
  application_id: string;
  feedback_message: string;
  status: string;
  reviewer_id: string | null;
  created_at: string;
}

export interface FullOpportunity {
  opportunity: Opportunity;
  applications: Array<{
    application: ApplicationPayload;
    feedback: ApplicationFeedback[];
  }>;
}

export const APPLICATION_STATUSES = [
  {
    value: "received",
    label: "Application Received",
    color: "text-black-600 bg-gray-100",
  },
  {
    value: "in_review",
    label: "Pending Review",
    color: "text-yellow-600 bg-yellow-100",
  },
  { value: "Reviewed", label: "Reviewed", color: "text-blue-600 bg-blue-100" },
  {
    value: "interview_pending",
    label: "Interview Pending",
    color: "text-purple-600 bg-purple-100",
  },
  { value: "rejected", label: "Rejected", color: "text-red-600 bg-red-100" },
  { value: "hired", label: "Hired", color: "text-green-600 bg-green-100" },
  {
    value: "quit",
    label: "Quit on their own",
    color: "text-black-600 bg-orange-100",
  },
  {
    value: "contract_sign_pending",
    label: "Contract Signing Pending",
    color: "text-white bg-blue-100",
  },
];

export const OPPORTUNITY_STATUSES = ["Draft", "Published", "Archived"];
export const EMPLOYMENT_TYPES = [
  "Full-Time",
  "Part-Time",
  "Contract",
  "Temporary",
  "Volunteering",
  "Task",
  "Internship",
];

export type OpportunityInsert = {
  title: string;
  slug?: string;
  type: "Job" | "Tender" | "Grant" | "Internship" | "Other" | string;
  location: string;
  work_mode?: "In-person" | "Hybrid" | "Remote" | string;
  country?: string | null;
  employment_type?: string;
  salary?: string | null;
  application_type?: "Internal" | "External" | string;
  application_link?: string | null;
  contact_email?: string | null;
  tags?: string | null; // CSV or free text
  description: string;
  full_description: string;
  requirements?: string | null;
  benefits?: string | null;
  status?: string;
  featured?: boolean;
  expires_at?: string | null; // ISO string or null
  seo_description?: string | null;
  lang?: string;
  hints?: any; // kept as-is
};
