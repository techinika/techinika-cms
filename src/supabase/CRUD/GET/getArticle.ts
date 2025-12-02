import supabase from "@/supabase/supabase";
import { JoinedArticle } from "@/types/main";

export const getArticles = async (): Promise<JoinedArticle[]> => {
  try {
    const { data, error } = await supabase
      .from("articles")
      .select(
        `
        *,
        author:authors!author_id (
          id,
          name,
          image_url,
          created_at,
          lang,
          bio,
          external_link,
          username
        ),
        category:categories (
          id,
          name
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching articles:", error);
      return [];
    }

    return data as unknown as JoinedArticle[];
  } catch (err) {
    console.error("An unexpected error occurred:", err);
    return [];
  }
};
