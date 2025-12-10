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
  username: string | null;
  location: string | null;
  x_handle: string | null;
  role: "admin" | "author" | "undecided" | "manager";
  github_handle: string | null;
  linkedin_handle: string | null;
}
