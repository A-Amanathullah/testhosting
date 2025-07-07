import React, { useState, useRef, useEffect, useContext } from 'react';
import { FiEdit, FiLock, FiLogOut, FiX } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';
import { fetchUser, changePassword, storeUserDetails } from '../services/authService';

const UserProfileDropdown = ({ user, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const { setUser } = useContext(AuthContext);

  // Form states
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    phone_no: '',
    gender: '',
    nic_no: '',
    address: '',
    profile_image: null
  });

  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  });

  const [errors, setErrors] = useState({});

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch user details when dropdown opens
  useEffect(() => {
    if (isDropdownOpen && !userDetails) {
      fetchUserDetails();
    }
  }, [isDropdownOpen, userDetails]);

  const fetchUserDetails = async () => {
    try {
      const userData = await fetchUser();
      setUserDetails(userData);
      setEditForm({
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        phone_no: userData.phone_no || '',
        gender: userData.gender || '',
        nic_no: userData.nic_no || '',
        address: userData.address || '',
        profile_image: null
      });
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const formData = new FormData();
      formData.append('user_id', user.id);
      formData.append('first_name', editForm.first_name);
      formData.append('last_name', editForm.last_name);
      formData.append('phone_no', editForm.phone_no);
      formData.append('gender', editForm.gender);
      formData.append('email', user.email);
      formData.append('nic_no', editForm.nic_no);
      formData.append('address', editForm.address);
      
      if (editForm.profile_image) {
        formData.append('profile_image', editForm.profile_image);
      }

      await storeUserDetails(formData);
      
      // Refresh user data in context and local state
      const updatedUser = await fetchUser();
      setUser(updatedUser);
      setUserDetails(updatedUser);
      
      setIsEditModalOpen(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        alert('Error updating profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    if (passwordForm.new_password !== passwordForm.new_password_confirmation) {
      setErrors({ new_password_confirmation: ['Passwords do not match'] });
      setLoading(false);
      return;
    }

    try {
      await changePassword(
        passwordForm.current_password,
        passwordForm.new_password,
        passwordForm.new_password_confirmation
      );
      
      setIsPasswordModalOpen(false);
      setPasswordForm({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
      });
      alert('Password changed successfully!');
    } catch (error) {
      console.error('Error changing password:', error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response?.data?.message) {
        setErrors({ current_password: [error.response.data.message] });
      } else {
        alert('Error changing password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const profileImageUrl = (userDetails?.profile_image || user?.profile_image) 
    ? `http://localhost:8000/storage/${userDetails?.profile_image || user?.profile_image}`
    : null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Picture Circle */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="w-10 h-10 rounded-full border-2 border-primary hover:border-primary/80 transition-colors duration-200 overflow-hidden"
      >
        {profileImageUrl ? (
          <img 
            src={profileImageUrl} 
            alt={user.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-bold text-sm">
              {user.name.split(' ').map(part => part.charAt(0)).join('').toUpperCase()}
            </span>
          </div>
        )}
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* User Info Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20 flex-shrink-0">
                {profileImageUrl ? (
                  <img 
                    src={profileImageUrl} 
                    alt={user.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold">
                      {user.name.split(' ').map(part => part.charAt(0)).join('').toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{user.name}</p>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
                <p className="text-xs text-primary capitalize">{user.role}</p>
              </div>
            </div>
          </div>

          {/* User Details */}
          {userDetails && (
            <div className="p-4 border-b border-gray-200">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Phone:</span>
                  <span className="text-gray-900">{userDetails.phone_no || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Gender:</span>
                  <span className="text-gray-900 capitalize">{userDetails.gender || 'Not set'}</span>
                </div>
                {userDetails.nic_no && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">NIC:</span>
                    <span className="text-gray-900">{userDetails.nic_no}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="p-2">
            <button
              onClick={() => {
                setIsEditModalOpen(true);
                setIsDropdownOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <FiEdit className="w-4 h-4" />
              <span>Update Profile</span>
            </button>
            <button
              onClick={() => {
                setIsPasswordModalOpen(true);
                setIsDropdownOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <FiLock className="w-4 h-4" />
              <span>Change Password</span>
            </button>
            <button
              onClick={() => {
                onLogout();
                setIsDropdownOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <FiLogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Update Profile</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.first_name}
                    onChange={(e) => setEditForm({...editForm, first_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name[0]}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.last_name}
                    onChange={(e) => setEditForm({...editForm, last_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name[0]}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={editForm.phone_no}
                  onChange={(e) => setEditForm({...editForm, phone_no: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                {errors.phone_no && <p className="text-red-500 text-xs mt-1">{errors.phone_no[0]}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  value={editForm.gender}
                  onChange={(e) => setEditForm({...editForm, gender: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender[0]}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NIC Number
                </label>
                <input
                  type="text"
                  value={editForm.nic_no}
                  onChange={(e) => setEditForm({...editForm, nic_no: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                {errors.nic_no && <p className="text-red-500 text-xs mt-1">{errors.nic_no[0]}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  value={editForm.address}
                  onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address[0]}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditForm({...editForm, profile_image: e.target.files[0]})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                {errors.profile_image && <p className="text-red-500 text-xs mt-1">{errors.profile_image[0]}</p>}
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Change Password</h2>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password *
                </label>
                <input
                  type="password"
                  required
                  value={passwordForm.current_password}
                  onChange={(e) => setPasswordForm({...passwordForm, current_password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                {errors.current_password && <p className="text-red-500 text-xs mt-1">{errors.current_password[0]}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={passwordForm.new_password}
                  onChange={(e) => setPasswordForm({...passwordForm, new_password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                {errors.new_password && <p className="text-red-500 text-xs mt-1">{errors.new_password[0]}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={passwordForm.new_password_confirmation}
                  onChange={(e) => setPasswordForm({...passwordForm, new_password_confirmation: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                {errors.new_password_confirmation && <p className="text-red-500 text-xs mt-1">{errors.new_password_confirmation[0]}</p>}
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;
