import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = process.env.NEXT_PUBLIC_PROJECT_URL;
export const supabaseAnonKey = process.env.NEXT_PUBLIC_API_KEY;
export const serviceKey = process.env.NEXT_PUBLIC_SERVICE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase environment variables are not set.");
}

// Create a single supabase client for interacting with your database
const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");
const supabaseAdmin = createClient(supabaseUrl || "", serviceKey || "");

export default supabase;
export const supabaseAdminClient = supabaseAdmin;
