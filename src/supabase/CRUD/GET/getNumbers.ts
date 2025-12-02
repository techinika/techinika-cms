import supabase from "@/supabase/supabase";

export async function getArticlesStats() {
  const now = new Date();
  const firstDayOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  ).toISOString();

  const { count: totalArticles } = await supabase
    .from("articles")
    .select("*", { count: "exact", head: true });

  const { count: monthlyArticles } = await supabase
    .from("articles")
    .select("*", { count: "exact", head: true })
    .gte("created_at", firstDayOfMonth);

  const { count: drafts } = await supabase
    .from("articles")
    .select("*", { count: "exact", head: true })
    .eq("status", "draft");

  const { count: totalSubscribers } = await supabase
    .from("subscribers")
    .select("*", { count: "exact", head: true });

  return {
    totalArticles: totalArticles ?? 0,
    monthlyArticles: monthlyArticles ?? 0,
    drafts: drafts ?? 0,
    totalSubscribers: totalSubscribers ?? 0,
  };
}
