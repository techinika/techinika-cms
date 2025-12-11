import supabase, { supabaseAdminClient } from "@/supabase/supabase";
import { UserType } from "@/types/users";

export async function fetchAllUsers(): Promise<UserType[]> {
  const { data: profileUsers, error: profileError } = await supabase
    .from("authors")
    .select("*");

  if (profileError) {
    console.error("Error fetching profile users:", profileError);
    return [];
  }

  const { data: authData, error: authError } =
    await supabaseAdminClient.auth.admin.listUsers();

  if (authError) {
    console.error("Error fetching auth users:", authError);
    return [];
  }

  const authUsers = authData.users;

  const merged = profileUsers.map((p) => {
    const auth = authUsers.find((u) => u.id === p.id);

    return {
      id: p.id,
      name: p.name,
      email: auth?.email || "",
      title: p.title,
      bio: p.bio,
      created_at: p.created_at,
      image_url: p.image_url,
      external_link: p.external_link,
      username: p.username,
      location: p.location,
      lang: p.lang,
      status: p.status,
      role: p.role || "User", // Default role
    } as UserType;
  });

  return merged;
}
