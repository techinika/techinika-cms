import supabase from "../supabase";

export async function fetchArticles({ query = "", status = "all" }) {
  try {
    let articlesQuery = supabase
      .from("articles")
      .select("slug, title, status, created_at, views");

    if (query) {
      articlesQuery = articlesQuery.ilike("title", `%${query}%`);
    }

    if (status && status !== "all") {
      articlesQuery = articlesQuery.eq("status", status);
    }

    const { data: articles, error } = await articlesQuery.order("created_at", {
      ascending: false,
    });

    if (error) {
      console.error("Error fetching articles:", error.message);
      return { success: false, data: [], error: error.message };
    }

    return { success: true, data: articles, error: null };
  } catch (error) {
    console.error(
      "An unexpected error occurred while fetching articles:",
      error
    );
    return { success: false, data: [], error: "An unexpected error occurred." };
  }
}
