"use client";

import { toastError, toastSuccess } from "@/components/ui/toast";
import { useAuth } from "@/lib/AuthContext";
import { fetchAllUsers } from "@/supabase/CRUD/GET/getAllUsers";
import { addUserToCompany } from "@/supabase/CRUD/INSERT/addUserToCompany";
import { COMPANY_USER_ROLES, UserType } from "@/types/users";
import { Loader, Loader2, Search, User, X } from "lucide-react";
import { useEffect, useState } from "react";

export const AddUserModal = ({
  isOpen,
  onClose,
  slug,
}: {
  isOpen: boolean;
  onClose: () => void;
  slug: string;
}) => {
  const auth = useAuth();
  const [existingUsers, setExistingUsers] = useState<UserType[]>([]);
  const availableUsers = existingUsers.filter(
    (opt) => !existingUsers.some((eu) => eu.email === opt.email)
  );

  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState("Employee");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [fetchingUsers, setFetchingUsers] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {}, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    if (isOpen) {
      setSelectedUserId("");
      setSelectedRole("Employee");
      setMessage("");
      setFetchingUsers(true);
    }

    setSearch("");
    setSelectedUser(null);
    setSelectedRole("Employee");
    setMessage("");

    (async () => {
      const users = await fetchAllUsers();
      setExistingUsers(users);
    })();
    setFetchingUsers(false);
  }, [isOpen]);

  const filteredUsers = existingUsers.filter((u) => {
    const term = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term)
    );
  });

  const isUserMissing = search.length > 2 && filteredUsers.length === 0;

  const handleSubmit = async () => {
    try {
      setAdding(true);
      if (!selectedUser) {
        setMessage("Please select a user.");
        return;
      }

      if (!auth?.user?.id) {
        setMessage("You must be logged into a company account.");
        return;
      }

      const response = await addUserToCompany({
        userId: selectedUser.id,
        companySlug: slug,
        addedBy: auth.user.id,
        role: selectedRole.toLowerCase(),
      });

      toastSuccess("Adding the user to the company is successful.");
      onClose();
    } catch (error) {
      console.log("Error adding user to the company: ", error);
      toastError("Error adding user to the company.");
    } finally {
      setAdding(false);
    }
  };

  const handleInviteUser = () => {
    if (!selectedUserId) {
      setMessage("Please select a user.");
      return;
    }

    const userToAdd = availableUsers.find((u) => u.id === selectedUserId);
    if (userToAdd) {
      
      onClose();
    } else {
      setMessage("Selected user not found.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold flex items-center">
            <User className="w-5 h-5 mr-2 text-primary" />
            Add New Company User
          </h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {message && (
            <div className="bg-red-100 text-red-700 p-3 rounded">{message}</div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-700">
              Search for a user
            </label>

            <div className="relative mt-1">
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedUser(null);
                  setMessage("");
                }}
                className="w-full px-4 py-2 border rounded outline-none focus:ring-2 focus:ring-primary"
                placeholder="Search by name or email..."
              />
              <Search className="w-4 h-4 absolute right-3 top-3 text-gray-400" />
            </div>
          </div>

          {filteredUsers.length > 0 && !fetchingUsers && (
            <div className="border rounded max-h-40 overflow-y-auto">
              {filteredUsers.map((u) => (
                <div
                  key={u.id}
                  onClick={() => setSelectedUser(u)}
                  className={`p-3 cursor-pointer hover:bg-gray-100 ${
                    selectedUser?.id === u.id ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="font-medium">{u.name}</div>
                  <div className="text-sm text-gray-600">{u.email}</div>
                </div>
              ))}
            </div>
          )}

          {isUserMissing && (
            <div className="bg-yellow-100 text-yellow-800 p-3 rounded text-sm">
              User not found.
              <span className="font-semibold">
                Please make sure the email is valid and invite the user:
              </span>
              <span className="ml-1 font-mono">{search}</span>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-700">
              Assign Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-4 py-2 border rounded mt-1 focus:ring-primary"
            >
              {COMPANY_USER_ROLES.map((role) => (
                <option key={role}>{role}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-6 border-t flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-100">
            Cancel
          </button>
          {isUserMissing ? (
            <button
              onClick={handleInviteUser}
              className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
            >
              Invite User
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!selectedUser}
              className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
            >
              {adding ? (
                <Loader2 className="animate-spin border-2" />
              ) : (
                "Add User"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
