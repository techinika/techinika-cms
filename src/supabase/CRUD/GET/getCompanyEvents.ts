import supabase, { supabaseAdminClient } from "@/supabase/supabase";
import { EventInterface } from "@/types/event";

export async function getCompanyEvents(companySlug: string) {
  const { data: company, error: companyError } = await supabase
    .from("featured_startups")
    .select("id")
    .eq("slug", companySlug)
    .single();

  if (companyError || !company) {
    console.error("Company not found:", companyError);
    return null;
  }

  const companyId = company.id;

  const { data, error } = await supabaseAdminClient
    .from("events")
    .select("*")
    .eq("company_id", companyId)
    .order("event_date", { ascending: true });

  if (error) {
    console.error("Error fetching company events:", error);
    return { data: [], error };
  }

  return { data: data as EventInterface[], error: null };
}
