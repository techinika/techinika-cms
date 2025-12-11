import supabase, { supabaseAdminClient } from "@/supabase/supabase";
import { UserType } from "@/types/users";

export async function getAuthUsersByIds(userIds: string[]) {
  const { data, error } = await supabaseAdminClient.auth.admin.listUsers();

  if (error) {
    console.error("Error fetching auth users:", error);
    return [];
  }

  const filtered = data.users.filter((u) => userIds.includes(u.id));

  return filtered.map((user) => ({
    id: user.id,
    email: user.email ?? null,
  }));
}

export async function getCompanyUsers(slug: string): Promise<UserType[]> {
  try {
    const { data: company, error: companyError } = await supabase
      .from("featured_startups")
      .select("id")
      .eq("slug", slug)
      .single();

    if (companyError || !company) {
      console.error("Company not found:", companyError);
      return [];
    }

    const companyId = company.id;

    const { data: ucRows, error: ucError } = await supabase
      .from("user_company")
      .select("id, user_id, role, created_at, status")
      .eq("company_id", companyId);

    if (ucError || !ucRows) {
      console.error("Error fetching user_company:", ucError);
      return [];
    }

    const userIds = ucRows.map((u) => u.user_id).filter(Boolean);

    if (userIds.length === 0) return [];

    const authUsers = await getAuthUsersByIds(userIds);

    const { data: authors } = await supabase
      .from("authors")
      .select(
        `id, name,
          bio,
          image_url,
          external_link,
          title,
          username,
          location,
          lang`
      )
      .in("id", userIds);

    if (ucError) {
      console.error("Error fetching company users:", ucError);
      return [] as UserType[];
    }

    return ucRows.map((row) => {
      const email = authUsers?.find((a) => a.id === row.user_id)?.email;
      const name = authors?.find((a) => a.id === row.user_id)?.name;
      const profile = authors?.find((l) => l?.id === row?.user_id);

      return {
        id: row.user_id,
        email: email,
        lang: profile?.lang || "english",
        name: name || "Unnamed User",
        title: profile?.title,
        bio: profile?.bio,
        image_url: profile?.image_url,
        external_link: profile?.external_link,
        username: profile?.username,
        role: row.role || "manager",
        status: row.status ?? "pending_confirmation",
        joined_at: row?.created_at,
      } as unknown as UserType;
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return [] as UserType[];
  }
}
