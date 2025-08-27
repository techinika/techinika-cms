// app/authors/new/page.tsx

"use client";

import { useState, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/AuthProvider";
import { inviteNewAuthor } from "@/supabase/CRUD/INSERT";
import Loading from "@/app/loading";
import {
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "../ui/drawer";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Loader2 } from "lucide-react";

type AuthorFormData = {
  name: string;
  email: string;
  bio: string;
  is_admin: boolean;
};

export default function CreateAuthorPage() {
  const { user, loading } = useAuth();
  const [formData, setFormData] = useState<AuthorFormData>({
    name: "",
    email: "",
    bio: "",
    is_admin: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      is_admin: e.target.checked,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (!user?.is_admin) {
      setError("You are not authorized to create new authors.");
      setIsLoading(false);
      return;
    }

    try {
      const { data: newUser, error: createError } = await inviteNewAuthor(
        formData
      );

      if (createError) {
        throw new Error(createError);
      }

      setSuccessMessage(
        `Successfully invited ${newUser?.name}. An invitation email has been sent.`
      );
      setFormData({ name: "", email: "", bio: "", is_admin: false });
    } catch (err) {
      console.error(err);
      setError(
        "Failed to create author. Please check the email and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || isLoading) return <Loading />;

  return (
    <DrawerContent>
      {loading ? (
        <Loading />
      ) : (
        <div className="grid gap-6 min-w-4xl mx-auto p-4">
          <DrawerHeader className="flex items-center gap-4">
            <DialogTitle className="text-3xl font-bold tracking-tight">
              Invite New Author
            </DialogTitle>
          </DrawerHeader>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col lg:flex-row gap-8"
          >
            <div className="flex-grow space-y-6">
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              {successMessage && (
                <p className="text-green-500 text-sm mb-4">{successMessage}</p>
              )}

              <div className="flex flex-col lg:flex-row gap-8">
                {/* Author Name Input */}
                <div className="grid gap-2 w-full">
                  <label htmlFor="name">Name</label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter the author's full name"
                    required
                  />
                </div>

                {/* Email Input */}
                <div className="grid gap-2 w-full">
                  <label htmlFor="email">Email</label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter the author's email address"
                    required
                  />
                </div>
              </div>

              {/* Bio Textarea */}
              <div className="grid gap-2">
                <label htmlFor="bio">Short Bio</label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="A short biography of the author"
                  required
                />
              </div>

              {/* Admin Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_admin"
                  name="is_admin"
                  checked={formData.is_admin}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <label
                  htmlFor="is_admin"
                  className="text-sm font-medium text-gray-700"
                >
                  Make this user an Admin
                </label>
              </div>

              <DrawerFooter>
                <div className="flex justify-between items-center gap-2 mt-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="rounded-2xl flex-1"
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      "Invite Author"
                    )}
                  </Button>
                  <DrawerClose className="flex-1">
                    <Button variant="outline" className="rounded-2xl w-full">
                      Cancel
                    </Button>
                  </DrawerClose>
                </div>
              </DrawerFooter>
            </div>
          </form>
        </div>
      )}
    </DrawerContent>
  );
}
