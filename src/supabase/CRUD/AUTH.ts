import supabase from "../supabase";

export async function signInWithEmail(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.error("Supabase Auth Error:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true, user: data.user, session: data.session };
  } catch (error) {
    console.error("An unexpected error occurred during login:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function requestPasswordReset(email: string) {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      console.error("Supabase Password Reset Error:", error.message);
      // For security, you might want to return a generic message
      return {
        success: false,
        error: "Could not send reset email. Please try again.",
      };
    }

    // Supabase will return a generic success message to prevent user enumeration
    // The data object might contain a user and a session, but the important
    // part is that an email was sent.
    return {
      success: true,
      message: "Password reset email sent. Check your inbox.",
    };
  } catch (error) {
    console.error(
      "An unexpected error occurred during password reset request:",
      error
    );
    return { success: false, error: "An unexpected error occurred." };
  }
}
