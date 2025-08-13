// app/login/page.tsx
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
import { LogIn, Rocket } from "lucide-react";
import { signInWithEmail } from "@/supabase/CRUD/AUTH";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const { success, error: loginError } = await signInWithEmail(
      username,
      password
    );

    if (success) {
      router.push("/dashboard");
    } else {
      setError(
        loginError || "Failed to sign in. Please check your credentials."
      );
    }
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4 lg:p-12">
      <div className="container mx-auto grid h-full max-w-5xl lg:grid-cols-2 lg:gap-12">
        {/* Left Section: Hero Message */}
        <div className="hidden lg:flex items-center justify-center p-8 bg-primary text-white rounded-2xl shadow-xl">
          <div className="text-center space-y-6">
            <Rocket className="mx-auto h-20 w-20 text-white animate-bounce-slow" />
            <h2 className="text-4xl font-extrabold tracking-tight">
              Welcome to Techinika CMS
            </h2>
            <p className="text-lg text-indigo-100">
              Our CMS is where great ideas are shared. Sign in to start managing
              moving the world forward.
            </p>
          </div>
        </div>

        {/* Right Section: Login Card */}
        <Card className="w-full max-w-xl mx-auto self-center rounded-2xl p-6 shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold">Sign In</CardTitle>
            <CardDescription>
              Enter your username and password to access the CMS.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="author-name"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-red-500 text-sm py-2">{error}</p>}
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
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn size={20} />
                    Sign in
                  </div>
                )}
              </Button>
            </form>
            <div className="text-center text-sm">
              <a
                href="/reset-password"
                className="text-indigo-600 hover:text-indigo-500 hover:underline transition-colors"
              >
                Forgot your password?
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
