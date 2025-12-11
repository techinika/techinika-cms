import supabase, { supabaseAdminClient } from "@/supabase/supabase";

export async function addUserToCompany({
  userId,
  companySlug,
  addedBy,
  role,
}: {
  userId: string;
  companySlug: string;
  addedBy: string;
  role: string;
}) {
  const { data: company, error: companyError } = await supabase
    .from("featured_startups")
    .select("id, name")
    .eq("slug", companySlug)
    .single();

  if (companyError || !company) {
    console.error("Company not found:", companyError);
    return [];
  }

  const companyId = company.id;
  const { data, error } = await supabase
    .from("user_company")
    .insert([
      {
        user_id: userId,
        company_id: companyId,
        added_by: addedBy,
        role: role,
      },
    ])
    .select("*")
    .single();

  if (error) {
    console.error("Error adding user to company:", error);
    return { error };
  }

  const { data: authUser, error: authError } =
    await supabaseAdminClient.auth.admin.getUserById(userId);

  if (authError || !authUser?.user) {
    console.error("Could not fetch email for user:", authError);
    return { error: authError };
  }

  const userEmail = authUser.user.email;
  const userName =
    authUser.user.user_metadata?.name ||
    authUser.user.user_metadata?.full_name ||
    "there";

  const confirmUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/?action=confirm-joining-company&company=${companyId}&user=${userId}`;

  const email = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/communicate/email`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        receiver: userEmail,
        company: company?.name,
        name: userName,
        subject: `Invitation to join ${company?.name} on Techinika.`,
        message: `<p>You have been invited to join ${company?.name} on Techinika as "${role}."</p>
      <p>Please click on the link below to confirm this invitation.</p>
      
      <a href="${confirmUrl}" class="text-decoration: none;padding: 10px;background-color: #3182ce; color:#fff;">Confirm Invitation</a>
      
      <p>If you believe this email is not directed to you, please ignore it.</p>`,
      }),
    }
  );

  return { data };
}
