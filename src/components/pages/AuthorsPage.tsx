"use client";

import Loading from "@/app/loading";
import { useAuth } from "@/lib/AuthProvider";
import { fetchAuthorsWithEmails } from "@/supabase/CRUD/GET";
import { inviteNewAuthor } from "@/supabase/CRUD/INSERT";
import React, { useState, useEffect, useCallback } from "react";
import CreateAuthorPage from "../parts/NewAuthor";
import { Drawer, DrawerTrigger } from "../ui/drawer";

interface Author {
  id: string;
  email: string;
  name: string;
  bio: string;
  image_url: string;
  external_link?: string;
  lang: string;
  is_admin: boolean;
}

const Authors: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [authors, setAuthors] = useState<Author[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    lang: "en",
    is_admin: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAuthors = useCallback(async () => {
    setDataLoading(true);
    setError(null);
    try {
      const { data, error } = await fetchAuthorsWithEmails();
      if (error) {
        throw new Error(error);
      }
      setAuthors(data as Author[]);
    } catch (err) {
      setError("Failed to load authors. Please try again.");
      console.log(err);
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading) {
      fetchAuthors();
    }
  }, [authLoading, fetchAuthors]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  interface AddAuthorFormData {
    name: string;
    email: string;
    bio: string;
    lang: string;
    is_admin: boolean;
  }

  interface InviteNewAuthorParams {
    email: string;
    name: string;
    bio: string;
    is_admin: boolean;
  }

  const handleAddAuthor = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    // if (!user || !user.is_admin) {
    //   setError("You are not authorized to add new authors.");
    //   return;
    // }
    try {
      setError(null);
      setDataLoading(true);
      const { error }: { error: string | null } = await inviteNewAuthor({
        email: formData.email,
        name: formData.name,
        bio: formData.bio,
        is_admin: formData.is_admin,
      } as InviteNewAuthorParams);
      if (error) {
        throw new Error(error);
      }
      setFormData({
        name: "",
        email: "",
        bio: "",
        lang: "en",
        is_admin: false,
      } as AddAuthorFormData);
      await fetchAuthors();
    } catch (err) {
      setError(
        "Failed to invite author. Please ensure email is valid and unique."
      );
      console.log(err);
    } finally {
      setDataLoading(false);
    }
  };

  // Filter authors based on the search term
  const filteredAuthors = authors.filter(
    (author) =>
      author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      author.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading || dataLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="text-start mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Author Management
            </h1>
          </div>
          <Drawer>
            <DrawerTrigger>
              {/* <Button>Invite a user</Button> */}
            </DrawerTrigger>
            <CreateAuthorPage />
          </Drawer>
        </header>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Existing Authors</h2>
          <div className="relative w-full md:w-1/3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full rounded-full pl-10 pr-4 py-2 border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Authors Grid */}
        <section>
          {filteredAuthors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAuthors.map((author) => (
                <div
                  key={author.id}
                  className="bg-white p-8 rounded-3xl shadow-lg flex flex-col items-center text-center transition-transform hover:scale-105 duration-200"
                >
                  <img
                    src={
                      author.image_url ||
                      `https://placehold.co/100x100/A0B935/ffffff?text=${author.name.charAt(
                        0
                      )}`
                    }
                    alt={`Profile of ${author.name}`}
                    className="w-24 h-24 rounded-full mb-4 object-cover ring-4 ring-indigo-200"
                  />
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {author.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">{author.email}</p>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      author.is_admin
                        ? "bg-indigo-100 text-indigo-800"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {author.is_admin ? "Administrator" : "Author"}
                  </span>
                  <p className="text-sm text-gray-600 italic leading-relaxed mt-4 mb-4">
                    {author.bio}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <span className="text-6xl" role="img" aria-label="Sticker">
                🤷
              </span>
              <p className="mt-4 text-xl font-medium text-gray-700">
                No authors found.
              </p>
              <p className="mt-2 text-gray-500">
                Try adjusting your search filters or add a new author above.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Authors;
