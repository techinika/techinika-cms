import supabase from "../supabase";

export async function fetchDashboardAnalytics() {
  try {
    // Fetch total articles count
    const { count: totalArticles, error: articlesError } = await supabase
      .from("articles")
      .select("*", { count: "exact", head: true });

    // Fetch total authors count
    const { count: totalAuthors, error: authorsError } = await supabase
      .from("authors")
      .select("*", { count: "exact", head: true });

    // Fetch total views (this assumes you have a views table or a views column)
    const { data: viewsData, error: viewsError } = await supabase
      .from("articles")
      .select("views")
      .not("views", "is", null);

    const totalViews =
      viewsData?.reduce((sum, article) => sum + article.views, 0) || 0;

    // Fetch recent articles
    const { data: recentArticles, error: recentArticlesError } = await supabase
      .from("articles")
      .select("id, title, views, status")
      .order("created_at", { ascending: false })
      .limit(5);

    if (articlesError || authorsError || viewsError || recentArticlesError) {
      console.error("Error fetching dashboard analytics:", {
        articlesError,
        authorsError,
        viewsError,
        recentArticlesError,
      });
      return null;
    }

    return {
      totalArticles,
      totalAuthors,
      totalViews,
      recentArticles,
    };
  } catch (error) {
    console.error(
      "An unexpected error occurred while fetching analytics:",
      error
    );
    return null;
  }
}
