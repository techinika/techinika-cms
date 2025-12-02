import { IconNode } from "lucide-react";

export interface MenuCompanyCard {
  id: string;
  title: string;
  role: string[];
  icon: IconNode;
  color: string;
  stats: { label: string; value: string | number }[];
  children: boolean;
}
