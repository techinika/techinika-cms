// app/reset-password/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Key, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { requestPasswordReset } from "@/supabase/CRUD/AUTH";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setIsSuccess(false);

    // In a real application, you would make an API call here to your backend
    // to send a password reset email.
    console.log("Password reset requested for email:", email);

    try {
      const { success, error } = await requestPasswordReset(email);
      setIsSuccess(true);
      setEmail("");
    } catch (error) {
      console.error("Password reset request failed:", error);
      setErrorMessage(
        typeof error === "string"
          ? error
          : error instanceof Error && error.message
          ? error.message
          : "An unknown error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4 lg:p-12">
      <div className="container mx-auto grid h-full max-w-5xl lg:grid-cols-2 lg:gap-12">
        {/* Left Section: Hero Message */}
        <div className="hidden lg:flex items-center justify-center p-8 bg-primary text-white rounded-2xl shadow-xl">
          <div className="text-center space-y-6">
            <Key className="mx-auto h-20 w-20 text-white animate-bounce-slow" />
            <h2 className="text-4xl font-extrabold tracking-tight">
              Regain Access to Your Account
            </h2>
            <p className="text-lg text-purple-100">
              We will send you a secure link to reset your password and get back
              to your content.
            </p>
          </div>
        </div>

        {/* Right Section: Reset Password Card */}
        <Card className="w-full max-w-xl mx-auto self-center rounded-2xl p-6 shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold">Reset Password</CardTitle>
            <CardDescription>
              Enter your email address to receive a password reset link.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center p-6 space-y-4 text-center">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
                <h3 className="text-lg font-semibold text-green-700">
                  Request Sent!
                </h3>
                <p className="text-sm text-gray-500">
                  If an account exists for that email, a password reset link has
                  been sent to you.
                </p>
                <Link
                  href="/"
                  className="font-medium text-purple-600 hover:text-purple-500 hover:underline transition-colors mt-4"
                >
                  Return to login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleResetRequest} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {errorMessage && (
                  <p className="text-red-500 text-sm py-2">{errorMessage}</p>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending request...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Mail size={20} />
                      Send Reset Link
                    </div>
                  )}
                </Button>
              </form>
            )}
            {!isSuccess && (
              <div className="text-center text-sm">
                <Link
                  href="/"
                  className="text-purple-600 hover:text-purple-500 hover:underline transition-colors"
                >
                  Return to login
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
