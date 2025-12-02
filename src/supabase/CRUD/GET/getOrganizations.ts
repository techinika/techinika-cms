import supabase from "@/supabase/supabase";

export async function getUserOrganizations(userId: string) {
  const { data: relations, error } = await supabase
    .from("user_company")
    .select("company_id, role, note, featured_startups(*)")
    .eq("user_id", userId);

  if (error) throw new Error(error.message);

  if (!relations || relations.length === 0) {
    return [];
  }

  const results = [];

  for (const item of relations) {
    const companyId = item.company_id;

    const { count: opportunities } = await supabase
      .from("opportunities")
      .select("*", { count: "exact", head: true })
      .eq("company_id", companyId);

    const { count: events } = await supabase
      .from("events")
      .select("*", { count: "exact", head: true })
      .eq("company_id", companyId);

    results.push({
      company: item.featured_startups,
      role: item.role,
      note: item.note,
      opportunities: opportunities ?? 0,
      events: events ?? 0,
    });
  }

  return results;
}
