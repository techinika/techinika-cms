import supabase from "@/supabase/supabase";
import { generateSlug } from "@/lib/functions";
import { v4 as uuidv4 } from "uuid";
import { OpportunityInsert } from "@/types/opportunity";

export async function createOpportunity(
  payload: OpportunityInsert,
  companySlug: string
) {
  try {
    const { data: company, error: companyError } = await supabase
      .from("featured_startups")
      .select("id")
      .eq("slug", companySlug)
      .maybeSingle();

    if (companyError) {
      throw companyError;
    }
    if (!company) {
      throw new Error(`Company with slug "${companySlug}" not found`);
    }

    const company_id = company.id;

    let slug = (
      payload.slug || generateSlug(payload.title || "")
    ).toLowerCase();
    const { data: existingSlugs } = await supabase
      .from("opportunities")
      .select("id")
      .eq("slug", slug);

    if (existingSlugs && existingSlugs.length > 0) {
      const suffix = uuidv4().split("-")[0];
      slug = `${slug}-${suffix}`;
    }

    const insertObj: any = {
      title: payload.title,
      slug,
      type: payload.type ?? "Other",
      location: payload.location ?? "",
      work_mode: payload.work_mode ?? "Hybrid",
      country: payload.country ?? null,
      employment_type: payload.employment_type ?? "Full-Time",
      salary: payload.salary ?? null,
      application_type: payload.application_type ?? "Internal",
      application_link: payload.application_link ?? null,
      contact_email: payload.contact_email ?? null,
      tags: payload.tags ?? null,
      description: payload.description ?? "",
      full_description: payload.full_description ?? "",
      requirements: payload.requirements ?? null,
      benefits: payload.benefits ?? null,
      status: payload.status ?? "published",
      featured: payload.featured ?? false,
      views: 0,
      expires_at: payload.expires_at
        ? new Date(payload.expires_at).toISOString()
        : null,
      seo_description:
        payload.seo_description ??
        (payload.description ? payload.description.slice(0, 160) : null),
      lang: payload.lang ?? "english",
      hints: payload.hints ?? null,
      company_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: inserted, error: insertError } = await supabase
      .from("opportunities")
      .insert(insertObj)
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    return { data: inserted, error: null };
  } catch (err: any) {
    return { data: null, error: err };
  }
}
