import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_PROJECT_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_API_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase environment variables are not set.");
}

// Create a single supabase client for interacting with your database
const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");

export default supabase;
