import supabase from "@/supabase/supabase";
import { CompanyStats } from "@/types/stats";

export async function getCompanyStats(
  slug: string
): Promise<CompanyStats | null> {
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

  const now = new Date().toISOString();

  const { data: opps, error: oppError } = await supabase
    .from("opportunities")
    .select("id, expires_at")
    .eq("company_id", companyId);

  if (oppError || !opps) {
    console.error("Failed to load opportunities:", oppError);
    return null;
  }

  const activeOpportunities = opps.filter(
    (o) => o.expires_at && o.expires_at > now
  ).length;

  const closedOpportunities = opps.filter(
    (o) => o.expires_at && o.expires_at < now
  ).length;

  const { count: eventCount, error: eventError } = await supabase
    .from("events")
    .select("*", { count: "exact", head: true })
    .eq("organizer_id", companyId);

  if (eventError) {
    console.error("Failed to load events:", eventError);
    return null;
  }

  const { data: users, error: usersError } = await supabase
    .from("user_company")
    .select("role")
    .eq("company_id", companyId);

  if (usersError || !users) {
    console.error("Failed to load users:", usersError);
    return null;
  }

  const roleCount = users.reduce<Record<string, number>>((acc, entry) => {
    const r = entry.role || "unknown";
    acc[r] = (acc[r] || 0) + 1;
    return acc;
  }, {});

  return {
    companyId,
    activeOpportunities,
    closedOpportunities,
    events: eventCount ?? 0,
    users: users.length,
    roles: roleCount,
  };
}
