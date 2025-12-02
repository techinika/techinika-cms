import {
  Category,
  JoinedArticle,
  ResourceCategory,
  ResourceFile,
  Subscriber,
} from "@/types/main";
import supabase, { supabaseAdminClient } from "../supabase";

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

export const getSubscribers = async (): Promise<Subscriber[]> => {
  try {
    const { data, error } = await supabase
      .from("subscribers")
      .select()
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching subscribers:", error);
      return [];
    }

    console.log(data, error);

    return data as unknown as Subscriber[];
  } catch (err) {
    console.error("An unexpected error occurred:", err);
    return [];
  }
};

export const getCategories = async () => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, created_at")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching categories:", error);
      return [];
    }

    return data as Category[];
  } catch (err) {
    console.error("An unexpected error occurred:", err);
    return [];
  }
};

export const getResources = async (buckets: string[]) => {
  try {
    const allResults = await Promise.all(
      buckets.map(async (bucket) => {
        const { data, error } = await supabaseAdminClient.storage
          .from(bucket)
          .list("", {
            limit: 1000,
            sortBy: { column: "name", order: "asc" },
          });

        if (error) {
          console.error(`Error fetching from ${bucket}:`, error.message);
          return [];
        }

        return (
          data?.map((item) => ({
            ...item,
            category: bucket,
            url: supabase.storage.from(bucket).getPublicUrl(item.name).data
              .publicUrl,
          })) || []
        );
      })
    );

    const flattened = allResults.flat();

    console.log(flattened);

    flattened.sort((a, b) => a.name.localeCompare(b.name));

    return flattened;
  } catch (err) {
    console.error("Unexpected error fetching resources:", err);
    return [];
  }
};
