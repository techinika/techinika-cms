import supabase, { supabaseAdminClient } from "@/supabase/supabase";
import { FullOpportunity } from "@/types/opportunity";

export async function getOpportunityById(
  id: string
): Promise<FullOpportunity | null> {
  const { data: opportunity, error: opError } = await supabase
    .from("opportunities")
    .select("*")
    .eq("id", id)
    .single();

  if (opError) {
    console.error("Error fetching opportunity:", opError);
    throw new Error(opError.message);
  }

  if (!opportunity) return null;

  const { data: applications, error: appError } = await supabaseAdminClient
    .from("applications")
    .select("*")
    .eq("opportunity_id", id);

  if (appError) {
    console.error("Error fetching applications:", appError);
    throw new Error(appError.message);
  }

  const applicationIds = applications.map((a) => a.id);

  const { data: feedback, error: fbError } = await supabase
    .from("applications_feedback")
    .select("*")
    .in("application_id", applicationIds.length > 0 ? applicationIds : [""]);

  if (fbError) {
    console.error("Error fetching application feedback:", fbError);
    throw new Error(fbError.message);
  }

  const structuredApplications = applications.map((app) => ({
    application: app,
    feedback: feedback.filter((fb) => fb.application_id === app.id),
  }));

  return {
    opportunity,
    applications: structuredApplications,
  } as FullOpportunity;
}
