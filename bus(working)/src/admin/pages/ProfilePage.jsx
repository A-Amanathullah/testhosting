import React, { useState, useEffect } from "react";
import useProfile from '../../hooks/useProfile';

const ProfilePage = () => {
  const { profile, setProfile, loading, error, updateProfile } = useProfile();
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [localProfile, setLocalProfile] = useState(null);

  useEffect(() => {
    if (profile) {
      setLocalProfile({
        name: profile.name || '',
        email: profile.email || '',
        role: profile.role || '',
        phone: profile.phone_no || '',
        joined: profile.created_at || profile.joined || '',
        user_id: profile.id,
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        gender: profile.gender || '',
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    setLocalProfile({ ...localProfile, [e.target.name]: e.target.value });
  };

  const handleEdit = () => setEditing(true);
  const handleCancel = () => {
    setLocalProfile({
      name: profile.name || '',
      email: profile.email || '',
      role: profile.role || '',
      phone: profile.phone_no || '',
      joined: profile.created_at || profile.joined || '',
      user_id: profile.id,
      first_name: profile.first_name || '',
      last_name: profile.last_name || '',
      gender: profile.gender || '',
    });
    setEditing(false);
    setMessage("");
  };

  const handleSave = async () => {
    const payload = {
      user_id: localProfile.user_id,
      first_name: localProfile.first_name,
      last_name: localProfile.last_name,
      phone_no: localProfile.phone,
      gender: localProfile.gender,
      email: localProfile.email,
      role: localProfile.role,
    };
    const res = await updateProfile(payload);
    if (res.success) {
      setMessage("Profile updated successfully!");
      setEditing(false);
      setProfile({ ...profile, ...payload });
    } else {
      setMessage("Failed to update profile");
    }
  };

  if (loading || !localProfile) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">Error loading profile</div>;

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
              value={localProfile.name}
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
              value={localProfile.email}
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
              value={localProfile.role}
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
              value={localProfile.phone}
              onChange={handleChange}
              disabled={!editing}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 bg-gray-50"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              name="first_name"
              value={localProfile.first_name}
              onChange={handleChange}
              disabled={!editing}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 bg-gray-50"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={localProfile.last_name}
              onChange={handleChange}
              disabled={!editing}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 bg-gray-50"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              name="gender"
              value={localProfile.gender}
              onChange={handleChange}
              disabled={!editing}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 bg-gray-50"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Joined</label>
            <input
              type="text"
              name="joined"
              value={localProfile.joined}
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
