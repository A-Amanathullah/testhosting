import React, { useState } from "react";

const dummyUser = {
  name: "Admin User",
  email: "admin@example.com",
  role: "Administrator",
  phone: "077-1234567",
  joined: "2024-01-15",
};

const ProfilePage = () => {
  const [profile, setProfile] = useState(dummyUser);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleEdit = () => setEditing(true);
  const handleCancel = () => {
    setProfile(dummyUser);
    setEditing(false);
    setMessage("");
  };
  const handleSave = () => {
    setEditing(false);
    setMessage("Profile updated successfully!");
  };

  return (
    <div className="flex flex-col flex-grow overflow-hidden bg-gray-50">
      <div className="flex-grow p-6 overflow-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>
        <div className="bg-white rounded-lg shadow p-6 h-full w-full">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              disabled={!editing}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 bg-gray-50"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              disabled
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <input
              type="text"
              name="role"
              value={profile.role}
              onChange={handleChange}
              disabled
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              disabled={!editing}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 bg-gray-50"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Joined</label>
            <input
              type="text"
              name="joined"
              value={profile.joined}
              onChange={handleChange}
              disabled
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
            />
          </div>
          {message && <div className="mb-4 text-green-600 font-medium">{message}</div>}
          <div className="flex gap-3">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
