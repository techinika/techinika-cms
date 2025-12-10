import supabase from "@/supabase/supabase";
import { Opportunity } from "@/types/opportunity";

export async function getOpportunities(slug: string) {
  const { data: company, error: companyError } = await supabase
    .from("featured_startups")
    .select("id")
    .eq("slug", slug)
    .single();

  if (companyError || !company) {
    console.error("Company not found:", companyError);
    return null;
  }

  const companyId = company.id;

  const { data, error } = await supabase
    .from("opportunities")
    .select("*")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching opportunities:", error);
    throw new Error(error.message);
  }

  return (data || []) as Opportunity[];
}
