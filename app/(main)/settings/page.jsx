"use client";

import { useState, useEffect, useContext } from "react";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Trash2Icon } from "lucide-react";

export default function SettingsPage() {
  const { userDetails, setUserDetails } = useContext(UserDetailContext);
  const convex = useConvex();

  const [userData, setUserData] = useState(null);
  const [username, setUsername] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleDeleteAccount = async () => {
    if (!userDetails?._id) return;

    const confirm = window.confirm(
      "Are you sure you want to delete your account? This cannot be undone."
    );
    if (!confirm) return;

    try {
      await deleteAccount({ userId: userDetails._id });
      toast.success("Account deleted successfully.");
      setUserDetails(null);
      router.push("/"); // or login page
    } catch (err) {
      toast.error("Error deleting account.");
      console.error(err);
    }
  };

  useEffect(() => {
    if (userDetails?.email) {
      fetchUserData();
    }
  }, [userDetails]);

  const fetchUserData = async () => {
    try {
      const data = await convex.query(api.users.GetUser, {
        email: userDetails.email,
      });
      setUserData(data);
      setUsername(data?.name || "");
    } catch (err) {
      toast.error("Failed to load user data");
    }
  };

  const handleSave = async () => {
    if (!username.trim()) {
      toast.error("Username cannot be empty");
      return;
    }

    try {
      await convex.mutation(api.users.UpdateUserName, {
        userId: userData._id,
        name: username,
      });
      toast.success("Username updated!");
      setUserData({ ...userData, name: username });
      setUserDetails((prev) => ({ ...prev, name: username }));
      setIsEditing(false);
    } catch (err) {
      toast.error("Failed to update username");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl rounded-2xl p-8">
        <h1 className="text-2xl font-semibold mb-6">⚙️ Account Settings</h1>

        {userData && (
          <>
            <div className="flex items-center gap-5 mb-6">
              <Image
                src={userData.picture}
                alt="User Avatar"
                width={60}
                height={60}
                className="rounded-full border"
              />
              <div>
                <h2 className="text-xl font-medium">{userData.email}</h2>
                <p className="text-sm text-muted-foreground">
                  UID: {userData.uid}
                </p>
                <p className="text-sm text-muted-foreground">
                  Tokens: {userData.token}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Username
              </label>
              <div className="flex gap-3 items-center">
                <Input
                  disabled={!isEditing}
                  className="max-w-sm"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                {!isEditing ? (
                  <Button
                    variant="secondary"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </Button>
                ) : (
                  <Button variant="default" onClick={handleSave}>
                    Save
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      <button
        onClick={handleDeleteAccount}
        className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl text-red-400 bg-red-400/5 backdrop-blur-md hover:bg-red-400/10 transition-all duration-300"
      >
        <Trash2Icon className="w-5 h-5" />
        Delete My Account
      </button>
    </div>
  );
}
