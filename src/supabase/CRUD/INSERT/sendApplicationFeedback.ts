import supabase from "@/supabase/supabase";
import { APPLICATION_STATUSES } from "@/types/opportunity";

export async function saveApplicationFeedback(
  applicationId: string,
  feedback_message: string,
  reviewerId: string,
  status: string,
  receiverEmail: string,
  receiverName: string,
  companySlug: string,
  position: string
) {
  try {
    const { data: company, error: opError } = await supabase
      .from("featured_startups")
      .select("*")
      .eq("slug", companySlug)
      .single();

    if (opError) {
      console.error("Error fetching opportunity:", opError);
      throw new Error(opError.message);
    }

    if (!company) return null;

    if (!company) return null;

    const { data: feedbackData, error: feedbackError } = await supabase
      .from("applications_feedback")
      .insert({
        application_id: applicationId,
        reviewer_id: reviewerId,
        feedback_message,
        status,
      })
      .select()
      .single();

    if (feedbackError) {
      console.error("Error saving feedback:", feedbackError);
      return { error: feedbackError, data: null };
    }

    const ccList: string[] = [company?.email];

    const emailResult = await fetch("/api/communicate/email", {
      method: "POST",
      body: JSON.stringify({
        receiver: receiverEmail,
        cc: ccList,
        subject: `Application Update - ${company?.name}`,
        company: company?.name,
        name: receiverName,
        message: `<p>Thank you for taking the time to apply for the ${position} role at ${
          company?.name
        }. We appreciated learning about your experience and seeing the portfolio you shared.</p><p><strong>Your Feedback:</strong></p>
        <div class="padding:10px;background:#aaa;font-style:italic;"><p>${feedback_message}</p><p><strong>Next Step:</strong>: ${
          APPLICATION_STATUSES?.find((l) => l?.value === status)?.label
        }</p></div><p>Thank you again for your interest in our company.
</p>`,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    await supabase.from("activities_logging").insert({
      type: "email_sent",
      performed_by: reviewerId,
      application_id: applicationId,
      details: {
        sent_to: receiverEmail,
        cc: ccList,
        status,
        feedback: feedback_message,
        email_result: emailResult,
      },
    });

    return {
      data: {
        feedback: feedbackData,
        email: emailResult,
      },
      error: null,
    };
  } catch (err) {
    console.error("Unexpected error in saveApplicationFeedback:", err);
    return { error: err, data: null };
  }
}
