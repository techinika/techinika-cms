import { Article } from "@/types/main";
import supabase from "../supabase";
import { v4 as uuidv4 } from "uuid";

export async function createArticle(articleData: Article) {
  try {
    // Assuming the 'articles' table schema matches the provided type
    const { data, error } = await supabase
      .from("articles")
      .insert([articleData])
      .select(); // Use .select() to return the created data

    if (error) {
      console.error("Error creating article:", error.message);
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data: data[0], error: null };
  } catch (error) {
    console.error(
      "An unexpected error occurred while creating article:",
      error
    );
    return {
      success: false,
      data: null,
      error: "An unexpected error occurred.",
    };
  }
}

export async function uploadImage(file: File) {
  const fileExt = file.name.split(".").pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `public/${fileName}`;

  try {
    const { data, error } = await supabase.storage
      .from("articles")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Error uploading image:", error.message);
      return { success: false, data: null, error: error.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from("articles")
      .getPublicUrl(filePath);

    return { success: true, data: publicUrlData.publicUrl, error: null };
  } catch (error) {
    console.error("An unexpected error occurred during image upload:", error);
    return {
      success: false,
      data: null,
      error: "An unexpected error occurred.",
    };
  }
}
