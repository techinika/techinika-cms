/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Briefcase } from "lucide-react";
import { Tile } from "@/types/main";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function mapCompaniesToCards(companies: any[]): Tile[] {
  return companies.map((item) => ({
    id: item?.company?.slug,
    title: item?.company?.name,
    role: ["manager"],
    icon: Briefcase,
    color: "bg-indigo-600",
    stats: [
      { label: "Events", value: item.events },
      { label: "Opportunities", value: item.opportunities },
    ],
    children: true,
  }));
}
