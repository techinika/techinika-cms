import supabase, { supabaseAdminClient } from "../supabase";

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

export async function fetchAuthorsWithEmails() {
  try {
    const { data: users, error: usersError } =
      await supabaseAdminClient.auth.admin.listUsers();

    if (usersError) {
      throw new Error(usersError.message);
    }

    const usersMap = new Map();
    for (const user of users.users) {
      usersMap.set(user.id, user);
    }

    const { data: authors, error: authorsError } = await supabase
      .from("authors")
      .select("*");

    if (authorsError) {
      throw new Error(authorsError.message);
    }

    const authorsWithEmails = authors.map((author) => {
      const user = usersMap.get(author.id);
      return {
        ...author,
        email: user ? user.email : "Email not found",
      };
    });

    return { data: authorsWithEmails, error: null };
  } catch (err) {
    console.error("Error fetching authors:", err);
    return {
      data: null,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
