import { supabaseAdminClient } from "@/supabase/supabase";

export async function getSignedUrl(url: string) {
  console.log(url);
  const { data, error } = await supabaseAdminClient.storage
    .from("applications")
    .createSignedUrl(url, 60 * 60); // 1 hour

  if (error) console.error(error);

  console.log(data?.signedUrl);

  if (data) return data?.signedUrl;
  return "";
}
