import React, { useState, useEffect } from "react";
import useProfile from '../../hooks/useProfile';
import { changePassword } from '../../services/authService';
import { FaEye, FaEyeSlash } from '../components/Icons';

const ProfilePage = () => {
  const { profile, setProfile, loading, error, updateProfile } = useProfile();
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [localProfile, setLocalProfile] = useState(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordMsg('');
    try {
      const res = await changePassword(passwords.current, passwords.new, passwords.confirm);
      setPasswordMsg(res.message || 'Password changed successfully!');
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (err) {
      setPasswordMsg(
        err.response?.data?.message || 'Failed to change password. Please try again.'
      );
    }
    setPasswordLoading(false);
  };

  if (loading || !localProfile) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">Error loading profile</div>;

  return (
    <div className="flex flex-col flex-grow overflow-hidden bg-gray-50">
      <div className="flex-grow p-6 overflow-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>
        <div className="bg-white rounded-lg shadow p-6 h-auto w-full">
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
          <div className="mb-6">
            <button
              className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 mb-2"
              onClick={() => setShowPasswordForm((v) => !v)}
              type="button"
            >
              {showPasswordForm ? 'Cancel Password Change' : 'Change Password'}
            </button>
            {showPasswordForm && (
              <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrent ? 'text' : 'password'}
                      name="current"
                      value={passwords.current}
                      onChange={handlePasswordChange}
                      required
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      tabIndex={-1}
                      onClick={() => setShowCurrent(v => !v)}
                    >
                      {showCurrent ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">New Password</label>
                  <div className="relative">
                    <input
                      type={showNew ? 'text' : 'password'}
                      name="new"
                      value={passwords.new}
                      onChange={handlePasswordChange}
                      required
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      tabIndex={-1}
                      onClick={() => setShowNew(v => !v)}
                    >
                      {showNew ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      name="confirm"
                      value={passwords.confirm}
                      onChange={handlePasswordChange}
                      required
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      tabIndex={-1}
                      onClick={() => setShowConfirm(v => !v)}
                    >
                      {showConfirm ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                {passwordMsg && (
                  <div className={`text-sm ${passwordMsg.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{passwordMsg}</div>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? 'Changing...' : 'Change Password'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
