
import React, { useEffect, useState, useMemo } from 'react';
import Pagination from '../components/Pagination';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { fetchUsers, createUser, updateUser, deleteUser } from '../../services/userService';
import { getRoles } from '../../services/roleService';
import { FaEdit, FaTrash, FaEye, FaEyeSlash } from '../components/Icons';
import { usePermissions } from '../../context/PermissionsContext';

// Import auth service to get current user info
import { getToken } from '../../utils/auth';
import axios from 'axios';



const initialForm = {
  name: '',
  email: '',
  role: 'User',
  password: '',
  confirm_password: '',
  first_name: '',
  last_name: '',
  phone_no: '', // will store full phone with country code
  countryCode: '',
  gender: '',
};

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [search, setSearch] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: '' });
  
  // Get permissions
  const { permissions } = usePermissions();

  // Helper functions to check permissions
  const hasPermission = (action) => {
    if (!permissions || !permissions['User Management']) return false;
    return !!permissions['User Management'][action];
  };
  
  const canAdd = () => hasPermission('add');
  const canEdit = () => hasPermission('edit');
  const canDelete = () => hasPermission('delete');

  // Pagination state
  const [page, setPage] = useState(1);
  const rowsPerPage = 15;

  // Filtered users for search
  const filteredUsers = useMemo(() => {
    setPage(1); // Reset to first page on search change
    const q = search.toLowerCase();
    return users.filter(u => (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.first_name?.toLowerCase().includes(q) ||
      u.last_name?.toLowerCase().includes(q) ||
      u.phone_no?.toLowerCase().includes(q)
    ));
    // eslint-disable-next-line
  }, [users, search]);

  // Paginated data
  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredUsers.slice(start, start + rowsPerPage);
  }, [filteredUsers, page]);

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage) || 1;

  useEffect(() => {
    // Fetch current user info first
    const fetchCurrentUser = async () => {
      try {
        const token = getToken();
        if (!token) throw new Error('No token found');

        const response = await axios.get('http://localhost:8000/api/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUser(response.data);
      } catch (err) {
        console.log('Could not fetch current user:', err);
      }
    };
    
    // Load users and roles
    const loadData = async () => {
      try {
        const [userData, rolesData] = await Promise.all([
          fetchUsers(),
          getRoles()
        ]);
        
        // console.log('All users from API:', userData);
        // console.log('Roles from API:', rolesData);
        // console.log('Users with role "User":', userData.filter(u => u.role === 'User'));
        
        setUsers(userData.filter(u => u.role === 'User'));
        // Ensure roles is always an array
        setRoles(Array.isArray(rolesData) ? rolesData : []);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load data:', err);
        if (err.response && err.response.status === 403) {
          setError('Access denied. You need admin privileges to manage users.');
        } else {
          setError('Failed to load data. Please check your connection.');
        }
        // Set empty arrays on error to prevent crashes
        setUsers([]);
        setRoles([]);
        setLoading(false);
      }
    };

    if (getToken()) {
      fetchCurrentUser();
      loadData();
    } else {
      setError('Please login to access this page.');
      setLoading(false);
    }
  }, []);

  const handleEdit = (user) => {
    if (!canEdit()) {
      setNotification({
        message: 'You do not have permission to edit users.',
        type: 'error'
      });
      return;
    }
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
      password: '',
      confirm_password: '',
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      phone_no: user.phone_no || '',
      countryCode: user.phone_no ? user.phone_no.replace(/^\+(\d{1,3}).*$/, '$1') : '',
      gender: user.gender || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!canDelete()) {
      setNotification({
        message: 'You do not have permission to delete users.',
        type: 'error'
      });
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        setUsers(users.filter(u => u.id !== id));
        setNotification({
          message: 'User deleted successfully.',
          type: 'success'
        });
      } catch (err) {
        setNotification({
          message: 'Failed to delete user.',
          type: 'error'
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setFormError(null);
    setSubmitting(true);
    // Phone validation: must start with country code and be exactly 9 digits after country code
    const countryCode = form.countryCode;
    const phoneWithoutCode = form.phone_no.startsWith(countryCode) ? form.phone_no.slice(countryCode.length) : form.phone_no;
    const phoneRegex = /^\d{9}$/;
    if (!form.phone_no || !countryCode || !phoneRegex.test(phoneWithoutCode)) {
      setFormError('Please enter a valid 9-digit phone number after the country code.');
      setSubmitting(false);
      return;
    }
    // Ensure phone number includes '+' before country code
    let formattedPhone = form.phone_no;
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = `+${formattedPhone}`;
    }
    // Check permissions before submission
    if (editingUser && !canEdit()) {
      setFormError('You do not have permission to edit users.');
      setSubmitting(false);
      return;
    }
    if (!editingUser && !canAdd()) {
      setFormError('You do not have permission to add users.');
      setSubmitting(false);
      return;
    }
    if (!editingUser && form.password !== form.confirm_password) {
      setFormError('Passwords do not match.');
      setSubmitting(false);
      return;
    }
    const userPayload = {
      name: form.name,
      email: form.email,
      role: form.role.toLowerCase(),
      password: form.password,
    };
    const userDetailsPayload = {
      first_name: form.first_name,
      last_name: form.last_name,
      phone_no: formattedPhone,
      gender: form.gender,
      email: form.email,
      role: form.role.toLowerCase(),
    };
    try {
      if (editingUser) {
        const updated = await updateUser(editingUser.id, userPayload, userDetailsPayload);
        setUsers(users.map(u => (u.id === editingUser.id ? updated : u)));
        setNotification({ message: 'User updated successfully.', type: 'success' });
      } else {
        const created = await createUser(userPayload, userDetailsPayload);
        setUsers([...users, created]);
        setNotification({ message: 'User created successfully.', type: 'success' });
      }
      setShowForm(false);
      setEditingUser(null);
      setForm(initialForm);
    } catch (err) {
      if (err.response && err.response.data) {
        const msg = err.response.data.message || 'Failed to save user.';
        const details = err.response.data.errors ? Object.values(err.response.data.errors).flat().join(' ') : '';
        setFormError(`${msg} ${details}`.trim());
      } else {
        setFormError('An unexpected error occurred.');
      }
    }
    setSubmitting(false);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh]">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
      <span className="text-lg text-gray-600 font-medium">Loading users...</span>
    </div>
  );
  if (error) return (
    <div className="flex flex-col items-center justify-center h-[60vh]">
      <div className="text-red-600 text-lg font-semibold mb-2">{error}</div>
      {error.includes('Access denied') && (
        <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 px-6 py-4 rounded shadow">
          <strong>Note:</strong> To access user management, please login with an admin account.<br />
          <small>Test admin credentials: admin@test.com / password123</small>
          {currentUser && (
            <div className="mt-2">
              <small>Currently logged in as: <strong>{currentUser.name}</strong> (Role: <strong>{currentUser.role}</strong>)</small>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col flex-grow overflow-hidden bg-gray-50">
      <div className="flex-grow p-6 overflow-auto">
        {/* Notification */}
        {notification.message && (
          <div className={`mb-4 p-4 rounded-md ${
            notification.type === 'error' ? 'bg-red-100 border border-red-400 text-red-700' : 'bg-green-100 border border-green-400 text-green-700'
          }`}>
            <div className="whitespace-pre-line">{notification.message}</div>
          </div>
        )}
          
        <div className="bg-white rounded-2xl shadow-lg p-8 animate-fade-in">
          {/* Card header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 border-b pb-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 text-blue-700 rounded-full p-3 shadow text-2xl">
                {/* User icon alternative */}
                <span role="img" aria-label="users">👥</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">User Management</h1>
                {currentUser && (
                  <p className="text-sm text-gray-500 mt-1">Logged in as: <span className="font-semibold">{currentUser.name}</span> ({currentUser.role})</p>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-stretch sm:items-center w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition w-full sm:w-64 shadow-sm"
              />
              {canAdd() && (
                <button
                  className="flex items-center justify-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-lg shadow transition-all duration-150"
                  onClick={() => { setShowForm(true); setEditingUser(null); setForm(initialForm); }}
                >
                  <span className="text-lg font-bold">+</span> Add User
                </button>
              )}
            </div>
          </div>
          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
            <table className="min-w-full text-sm text-gray-900">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left font-semibold">Name</th>
                  <th className="px-4 py-3 text-left font-semibold">Email</th>
                  <th className="px-4 py-3 text-left font-semibold">Role</th>
                  <th className="px-4 py-3 text-left font-semibold">First Name</th>
                  <th className="px-4 py-3 text-left font-semibold">Last Name</th>
                  <th className="px-4 py-3 text-left font-semibold">Phone</th>
                  <th className="px-4 py-3 text-left font-semibold">Gender</th>
                  <th className="px-4 py-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.length > 0 ? paginatedUsers.map(user => (
                  <tr key={user.id || user.email} className="even:bg-gray-50 hover:bg-blue-50 transition">
                    <td className="px-4 py-3 whitespace-nowrap">{user.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{user.email}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{user.role}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{user.first_name}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{user.last_name}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{user.phone_no}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{user.gender}</td>
                    <td className="px-4 py-3 flex gap-2">
                      {canEdit() && (
                        <button title="Edit" className="p-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded-full shadow transition" onClick={() => handleEdit(user)}><FaEdit /></button>
                      )}
                      {canDelete() && (
                        <button title="Delete" className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow transition" onClick={() => handleDelete(user.id)}><FaTrash /></button>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="8" className="px-4 py-8 text-center text-gray-400 font-medium">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination controls */}
          {filteredUsers.length > rowsPerPage && (
            <div className="flex justify-center mt-8">
              <Pagination page={page} setPage={setPage} totalPages={totalPages} />
            </div>
          )}
          {/* Modal for Add/Edit User */}
          {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
                <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl" onClick={() => { setShowForm(false); setEditingUser(null); setForm(initialForm); }}>&times;</button>
                <h2 className="text-xl font-bold mb-4">{editingUser ? 'Edit User' : 'Add User'}</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  {formError && <div className="text-red-600 text-sm font-medium">{formError}</div>}
                  {(editingUser && !canEdit()) || (!editingUser && !canAdd()) ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                      You do not have permission to {editingUser ? 'edit' : 'add'} users.
                    </div>
                  ) : null}
                    <div>
                      <label className="block text-sm font-medium">Name</label>
                      <input type="text" className="w-full border rounded px-3 py-2" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                    </div>
                  <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input type="email" className="w-full border rounded px-3 py-2" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Role</label>
                    <select className="w-full border rounded px-3 py-2" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} required>
                      <option value="">Select Role</option>
                      {Array.isArray(roles) && roles.map(role => (
                        <option key={role.id} value={role.name}>{role.label || role.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Password {editingUser ? '(Leave blank to keep unchanged)' : ''}</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="w-full border rounded px-3 py-2 pr-10"
                        value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
                        required={!editingUser}
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        tabIndex={-1}
                        onClick={() => setShowPassword(v => !v)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                  {!editingUser && (
                    <div>
                      <label className="block text-sm font-medium">Confirm Password</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          className="w-full border rounded px-3 py-2 pr-10"
                          value={form.confirm_password}
                          onChange={e => setForm({ ...form, confirm_password: e.target.value })}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          tabIndex={-1}
                          onClick={() => setShowConfirmPassword(v => !v)}
                        >
                          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium">First Name</label>
                    <input type="text" className="w-full border rounded px-3 py-2" value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Last Name</label>
                    <input type="text" className="w-full border rounded px-3 py-2" value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Phone</label>
                    <PhoneInput
                      country={'lk'}
                      value={form.phone_no}
                      onChange={(value, data) => setForm(f => ({ ...f, phone_no: value, countryCode: data.dialCode }))}
                      inputProps={{
                        name: 'phone_no',
                        required: true,
                        className: "w-full border rounded px-3 py-2"
                      }}
                      enableSearch={true}
                      onlyCountries={['lk']}
                      countryCodeEditable={false}
                      placeholder="Phone Number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Gender</label>
                    <select className="w-full border rounded px-3 py-2" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button 
                      type="submit" 
                      className={`px-4 py-2 bg-blue-700 text-white rounded${submitting ? ' opacity-50 cursor-not-allowed' : ''}${
                        (editingUser && !canEdit()) || (!editingUser && !canAdd()) ? ' opacity-50 cursor-not-allowed' : ''
                      }`} 
                      disabled={submitting || (editingUser && !canEdit()) || (!editingUser && !canAdd())}
                    >
                      {submitting ? (editingUser ? 'Updating...' : 'Creating...') : (editingUser ? 'Update' : 'Create')}
                    </button>
                    <button type="button" className="px-4 py-2 bg-gray-300 text-gray-700 rounded" onClick={() => { setShowForm(false); setEditingUser(null); setForm(initialForm); }}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;