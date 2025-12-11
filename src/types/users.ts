export interface UserType {
  id: string;
  created_at: string;
  lang: string;
  name: string;
  email: string;
  title: string | null;
  bio: string | null;
  image_url: string | null;
  external_link: string | null;
  username: string;
  location: string | null;
  status: "confirmed" | "pending_confirmation" | string;
  x_handle?: string | null;
  role: "admin" | "author" | "undecided" | "manager" | string;
  github_handle?: string | null;
  linkedin_handle?: string | null;
  joined_at?: string;
}

export const COMPANY_USER_ROLES = ["Manager", "Employee"];
