import { Article } from "@/types/main";
import supabase, { supabaseAdminClient } from "../supabase";
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

// A reusable function to invite a new author via email.
export async function inviteNewAuthor({
  email,
  name,
  bio,
  is_admin,
}: {
  email: string;
  name: string;
  bio: string;
  is_admin: boolean;
}) {
  try {
    const { data: inviteData, error: inviteError } =
      await supabaseAdminClient.auth.admin.inviteUserByEmail(email, {
        data: {
          name,
          bio,
          lang: "english",
          is_admin,
        },
      });

    if (inviteError) {
      throw new Error(inviteError.message);
    }

    const { data: authorData, error: authorError } = await supabaseAdminClient
      .from("authors")
      .insert([
        {
          id: inviteData.user.id, // The unique user ID from the invitation
          name,
          bio,
          lang: "english",
          is_admin,
        },
      ]);

    if (authorError) {
      throw new Error(authorError.message);
    }

    // Return the new user data upon successful completion of both steps.
    return { data: authorData, error: null };
  } catch (err) {
    console.error("Error inviting new user and creating author:", err);
    return {
      data: null,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
