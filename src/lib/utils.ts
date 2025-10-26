import { UserType } from "@/types/main";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const MOCK_USER: UserType = {
  id: "1",
  name: "Alex Johnson",
  role: "admin",
  image_url: "https://placehold.co/40x40/1D4ED8/fff?text=AJ",
  created_at: new Date().toISOString(),
  lang: "en",
  title: "Administrator",
  email: "alex@example.com",
  bio: "Tech enthusiast and admin.",
  external_link: null,
  username: "alexj",
  location: "New York, USA",
  x_handle: null,
  github_handle: null,
  linkedin_handle: null,
};