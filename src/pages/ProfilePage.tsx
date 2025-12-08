import { useState } from "react";
import { FaPen } from "react-icons/fa6";
import { useAuth } from "@contexts/AuthContext";
import {
  EditProfileModal,
  ProfilePanelMenu,
  UserActivitySection,
} from "@features/auth";
import { UserAvatar } from "@layout/UserAvatar/UserAvatar";

export default function ProfilePage() {
  const { user } = useAuth();
  const [selectedPanel, setSelectedPanel] = useState("account");
  const [editOpen, setEditOpen] = useState(false);

  // Only allow editing for email/password users
  const canEdit = user?.providerData?.[0]?.providerId === "password";

  // Format join date from user metadata
  const joinDate = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString()
    : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-4 max-w-4xl mx-auto flex gap-6">
        {/* Account Panel Menu */}
        <ProfilePanelMenu
          selectedPanel={selectedPanel}
          setSelectedPanel={setSelectedPanel}
          canEdit={canEdit}
        />

        {/* Main profile content */}
        <main className="flex-1 p-8 mt-16 bg-white dark:bg-gray-800 rounded shadow">
          <div className="flex items-center mb-8">
            <UserAvatar user={user} size={80} />
            <div className="flex-1 ml-6">
              <div className="text-2xl font-bold">{user?.displayName}</div>
              <div className="text-gray-600 dark:text-gray-400">
                {user?.email}
              </div>
              <div className="text-gray-500 text-sm mt-1">
                Joined: <span className="font-medium">{joinDate}</span>
              </div>
            </div>
            {canEdit && (
              <div className="flex-shrink-0 ml-auto">
                <button
                  className="px-4 py-2 flex items-center gap-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition"
                  onClick={() => setEditOpen(true)}
                >
                  <FaPen className="text-lg" />
                  Edit Profile
                </button>
              </div>
            )}
          </div>
          {selectedPanel === "account" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Account Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full mb-8">
                <div className="flex flex-col">
                  <span className="text-gray-500 text-sm">Name</span>
                  <span className="font-medium text-lg">
                    {user?.displayName || (
                      <span className="italic text-gray-400">Not set</span>
                    )}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500 text-sm">Email</span>
                  <span className="font-medium text-lg">{user?.email}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500 text-sm">Joined</span>
                  <span className="font-medium text-lg">{joinDate}</span>
                </div>
              </div>
            </div>
          )}
          {selectedPanel === "activity" && <UserActivitySection />}
        </main>
      </div>
      {/* Edit Profile Modal */}
      <EditProfileModal
        user={user}
        open={editOpen}
        onClose={() => setEditOpen(false)}
      />
    </div>
  );
}
